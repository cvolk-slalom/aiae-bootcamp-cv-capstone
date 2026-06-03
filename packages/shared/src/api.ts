import { z } from 'zod';
import { PlanSchema, PlanInputsSchema } from './plan.js';
import { PlantSchema } from './plant.js';

export const HealthResponseSchema = z.object({ ok: z.literal(true) });
export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export const CreatePlanRequestSchema = z.object({
  name: z.string().trim().min(1).max(120),
});
export type CreatePlanRequest = z.infer<typeof CreatePlanRequestSchema>;

export const UpdateInputsRequestSchema = PlanInputsSchema.extend({
  bed: z.object({
    widthIn: z.number().int().positive().max(600),
    lengthIn: z.number().int().positive().max(600),
  }),
  lightHours: z.number().int().min(0).max(16),
});
export type UpdateInputsRequest = z.infer<typeof UpdateInputsRequestSchema>;

export const PlanResponseSchema = PlanSchema;
export type PlanResponse = z.infer<typeof PlanResponseSchema>;

export const PlanSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  step: PlanSchema.shape.step,
  updatedAt: z.string(),
});
export type PlanSummary = z.infer<typeof PlanSummarySchema>;

export const PlanListResponseSchema = z.array(PlanSummarySchema);
export type PlanListResponse = z.infer<typeof PlanListResponseSchema>;

export const PlantListResponseSchema = z.array(PlantSchema);
export type PlantListResponse = z.infer<typeof PlantListResponseSchema>;

export const CompanionsResultSchema = z.object({
  recommended: z.array(z.string()),
  discouraged: z.array(z.object({ a: z.string(), b: z.string(), reason: z.string() })),
});
export type CompanionsResult = z.infer<typeof CompanionsResultSchema>;

export const UpdateCompanionsRequestSchema = z.object({
  confirmedPlants: z.array(z.string()),
});
export type UpdateCompanionsRequest = z.infer<typeof UpdateCompanionsRequestSchema>;
