import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PlantListSchema, type Plant } from '@gpb/shared';

export function loadPlants(path: string): Map<string, Plant> {
  const raw = readFileSync(resolve(path), 'utf-8');
  const parsed = PlantListSchema.parse(JSON.parse(raw));
  return new Map(parsed.map((p) => [p.id, p]));
}
