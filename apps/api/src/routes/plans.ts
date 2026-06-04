import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import {
  CreatePlanRequestSchema,
  UpdateInputsRequestSchema,
  UpdateCompanionsRequestSchema,
  UpdateLayoutRequestSchema,
  newId,
  type Plan,
} from '@gpb/shared';
import { PlansRepo } from '../db/plans-repo.js';
import { buildCompanionsResult } from '../services/companions.js';
import { computeLayout, validateLayout } from '../services/layout.js';

const ParamsSchema = z.object({ id: z.string().min(1) });

export const plansRoutes: FastifyPluginAsync = async (app) => {
  const repo = new PlansRepo(app.db);

  app.get('/plans', async () => repo.list(10));

  app.post('/plans', async (req, reply) => {
    const parsed = CreatePlanRequestSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ errors: parsed.error.flatten() });

    const now = new Date().toISOString();
    const plan: Plan = {
      id: newId(),
      name: parsed.data.name,
      createdAt: now,
      updatedAt: now,
      step: 'inputs',
    };
    repo.insert(plan);
    return reply.code(201).send(plan);
  });

  app.get('/plans/:id', async (req, reply) => {
    const { id } = ParamsSchema.parse(req.params);
    const plan = repo.get(id);
    if (!plan) return reply.code(404).send({ error: 'not found' });
    return plan;
  });

  app.patch('/plans/:id/inputs', async (req, reply) => {
    const { id } = ParamsSchema.parse(req.params);
    const parsed = UpdateInputsRequestSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ errors: parsed.error.flatten() });

    const unknown = parsed.data.desiredPlants.filter((pid) => !app.plants.has(pid));
    if (unknown.length > 0) {
      return reply
        .code(400)
        .send({ errors: { formErrors: [`unknown plant id(s): ${unknown.join(', ')}`], fieldErrors: {} } });
    }

    const existing = repo.get(id);
    if (!existing) return reply.code(404).send({ error: 'not found' });

    const updated: Plan = {
      ...existing,
      inputs: parsed.data,
      step: 'companions',
      updatedAt: new Date().toISOString(),
    };
    repo.update(updated);
    return updated;
  });

  app.get('/plans/:id/companions/recommendations', async (req, reply) => {
    const { id } = ParamsSchema.parse(req.params);
    const plan = repo.get(id);
    if (!plan) return reply.code(404).send({ error: 'not found' });
    if (!plan.inputs) {
      return reply.code(400).send({ errors: { formErrors: ['inputs not set'], fieldErrors: {} } });
    }
    return buildCompanionsResult(plan.inputs.desiredPlants, app.plants);
  });

  app.patch('/plans/:id/companions', async (req, reply) => {
    const { id } = ParamsSchema.parse(req.params);
    const parsed = UpdateCompanionsRequestSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ errors: parsed.error.flatten() });

    const unknown = parsed.data.confirmedPlants.filter((pid) => !app.plants.has(pid));
    if (unknown.length > 0) {
      return reply
        .code(400)
        .send({ errors: { formErrors: [`unknown plant id(s): ${unknown.join(', ')}`], fieldErrors: {} } });
    }

    const existing = repo.get(id);
    if (!existing) return reply.code(404).send({ error: 'not found' });
    if (!existing.inputs) {
      return reply.code(400).send({ errors: { formErrors: ['inputs not set'], fieldErrors: {} } });
    }

    const result = buildCompanionsResult(existing.inputs.desiredPlants, app.plants);
    const updated: Plan = {
      ...existing,
      companions: {
        recommended: result.recommended,
        discouraged: result.discouraged,
        confirmedPlants: parsed.data.confirmedPlants,
      },
      step: 'layout',
      updatedAt: new Date().toISOString(),
    };
    repo.update(updated);
    return updated;
  });

  app.get('/plans/:id/layout/suggestion', async (req, reply) => {
    const { id } = ParamsSchema.parse(req.params);
    const plan = repo.get(id);
    if (!plan) return reply.code(404).send({ error: 'not found' });
    if (!plan.inputs || !plan.companions) {
      return reply
        .code(400)
        .send({ errors: { formErrors: ['inputs and companions must be set first'], fieldErrors: {} } });
    }
    return computeLayout(
      {
        bed: plan.inputs.bed,
        confirmedPlants: plan.companions.confirmedPlants,
        lightHours: plan.inputs.lightHours,
      },
      app.plants,
    );
  });

  app.patch('/plans/:id/layout', async (req, reply) => {
    const { id } = ParamsSchema.parse(req.params);
    const parsed = UpdateLayoutRequestSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ errors: parsed.error.flatten() });

    const existing = repo.get(id);
    if (!existing) return reply.code(404).send({ error: 'not found' });
    if (!existing.inputs || !existing.companions) {
      return reply
        .code(400)
        .send({ errors: { formErrors: ['inputs and companions must be set first'], fieldErrors: {} } });
    }

    const err = validateLayout(parsed.data, existing.inputs.bed, existing.companions.confirmedPlants);
    if (err) return reply.code(400).send({ errors: err });

    const updated: Plan = {
      ...existing,
      layout: parsed.data,
      step: 'timing',
      updatedAt: new Date().toISOString(),
    };
    repo.update(updated);
    return updated;
  });
};
