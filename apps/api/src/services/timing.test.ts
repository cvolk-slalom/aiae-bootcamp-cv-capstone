import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import { PlantListSchema, type Plant } from '@gpb/shared';
import { addWeeks, computeTiming } from './timing.js';

const here = dirname(fileURLToPath(import.meta.url));
const raw = JSON.parse(readFileSync(resolve(here, '../../../../data/plants.json'), 'utf-8'));
const plants = PlantListSchema.parse(raw);
const db = new Map<string, Plant>(plants.map((p) => [p.id, p]));

describe('addWeeks', () => {
  it('handles negative weeks across a month boundary', () => {
    expect(addWeeks('2026-05-01', -6)).toBe('2026-03-20');
  });
  it('handles positive weeks', () => {
    expect(addWeeks('2026-05-01', 2)).toBe('2026-05-15');
  });
});

describe('computeTiming', () => {
  it('matches the brief acceptance for tomato @ 2026-05-01', () => {
    const r = computeTiming('2026-05-01', ['tomato'], db);
    expect(r.perPlant).toHaveLength(1);
    expect(r.perPlant[0]).toMatchObject({
      plantId: 'tomato',
      startIndoorsOn: '2026-03-20',
      transplantOn: '2026-05-15',
      harvestStart: '2026-07-29',
      harvestEnd: '2026-08-19',
    });
    expect(r.perPlant[0]!.directSowOn).toBeUndefined();
  });

  it('direct-sow plant gets directSowOn + harvest from it', () => {
    const directSow = plants.find((p) => p.directSowWeeksRelativeToLastFrost !== undefined);
    expect(directSow, 'dataset should have at least one direct-sow plant').toBeDefined();
    const r = computeTiming('2026-05-01', [directSow!.id], db);
    const row = r.perPlant[0]!;
    expect(row.directSowOn).toBeDefined();
    expect(row.harvestStart).toBeDefined();
    expect(row.startIndoorsOn).toBeUndefined();
    expect(row.transplantOn).toBeUndefined();
  });

  it('plant with no timing data yields plantId-only row', () => {
    // Tamper a copy: strip all timing fields from tomato.
    const stripped: Plant = {
      ...db.get('tomato')!,
      startIndoorsWeeksBeforeLastFrost: undefined,
      transplantWeeksAfterLastFrost: undefined,
      directSowWeeksRelativeToLastFrost: undefined,
    };
    const localDb = new Map(db);
    localDb.set('tomato', stripped);
    const r = computeTiming('2026-05-01', ['tomato'], localDb);
    expect(r.perPlant[0]).toEqual({ plantId: 'tomato' });
  });

  it('unknown plantId becomes a plantId-only row', () => {
    const r = computeTiming('2026-05-01', ['not-a-plant'], db);
    expect(r.perPlant[0]).toEqual({ plantId: 'not-a-plant' });
  });
});
