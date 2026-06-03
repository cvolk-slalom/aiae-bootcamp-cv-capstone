import { z } from 'zod';

export const PlanStepSchema = z.enum(['inputs', 'companions', 'layout', 'timing', 'final']);
export type PlanStep = z.infer<typeof PlanStepSchema>;

export const PlanInputsSchema = z.object({
  zone: z.string().min(1),
  lastFrostDate: z.string().min(1),
  bed: z.object({
    widthIn: z.number().positive(),
    lengthIn: z.number().positive(),
  }),
  lightHours: z.number().min(0).max(24),
  desiredPlants: z.array(z.string()),
});

export const PlanCompanionsSchema = z.object({
  recommended: z.array(z.string()),
  discouraged: z.array(
    z.object({ a: z.string(), b: z.string(), reason: z.string() }),
  ),
  confirmedPlants: z.array(z.string()),
});

export const PlanLayoutSchema = z.object({
  cellSizeIn: z.number().positive(),
  grid: z.array(
    z.object({
      x: z.number().int().nonnegative(),
      y: z.number().int().nonnegative(),
      plantId: z.string().nullable(),
    }),
  ),
  unplaced: z.array(z.string()),
});

export const PlanTimingSchema = z.object({
  perPlant: z.array(
    z.object({
      plantId: z.string(),
      startIndoorsOn: z.string().optional(),
      directSowOn: z.string().optional(),
      transplantOn: z.string().optional(),
      harvestStart: z.string().optional(),
      harvestEnd: z.string().optional(),
    }),
  ),
});

export const PlanFinalSchema = z.object({
  summaryMarkdown: z.string(),
});

export const PlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  step: PlanStepSchema,
  inputs: PlanInputsSchema.optional(),
  companions: PlanCompanionsSchema.optional(),
  layout: PlanLayoutSchema.optional(),
  timing: PlanTimingSchema.optional(),
  final: PlanFinalSchema.optional(),
});

export type Plan = z.infer<typeof PlanSchema>;
export type PlanInputs = z.infer<typeof PlanInputsSchema>;
