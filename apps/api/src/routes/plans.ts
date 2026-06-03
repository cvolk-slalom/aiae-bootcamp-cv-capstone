import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import {
  CreatePlanRequestSchema,
  UpdateInputsRequestSchema,
  newId,
  type Plan,
} from '@gpb/shared';
import { PlansRepo } from '../db/plans-repo.js';

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
};
