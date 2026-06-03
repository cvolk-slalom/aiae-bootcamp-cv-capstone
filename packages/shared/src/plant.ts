import { z } from 'zod';

export const PlantSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  spacingIn: z.number().positive(),
  sun: z.enum(['full', 'partial', 'shade']),
  daysToMaturity: z.number().int().positive(),
  frostTolerance: z.enum(['tender', 'hardy', 'half-hardy']),
  startIndoorsWeeksBeforeLastFrost: z.number().int().optional(),
  transplantWeeksAfterLastFrost: z.number().int().optional(),
  directSowWeeksRelativeToLastFrost: z.number().int().optional(),
  companions: z.array(z.string()).default([]),
  antagonists: z.array(z.string()).default([]),
});

export type Plant = z.infer<typeof PlantSchema>;

export const PlantListSchema = z.array(PlantSchema);
