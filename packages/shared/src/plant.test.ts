import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import { PlantListSchema } from './plant.js';

const here = dirname(fileURLToPath(import.meta.url));

describe('plants.json', () => {
  it('validates against PlantListSchema and has >= 20 entries', () => {
    const path = resolve(here, '../../../data/plants.json');
    const raw = JSON.parse(readFileSync(path, 'utf-8'));
    const plants = PlantListSchema.parse(raw);
    expect(plants.length).toBeGreaterThanOrEqual(20);
    const ids = new Set(plants.map((p) => p.id));
    for (const p of plants) {
      for (const c of p.companions) expect(ids.has(c), `unknown companion ${c} in ${p.id}`).toBe(true);
      for (const a of p.antagonists) expect(ids.has(a), `unknown antagonist ${a} in ${p.id}`).toBe(true);
    }
  });
});
