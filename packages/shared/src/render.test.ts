import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { renderPlanMarkdown, type PlantsDb } from './render.js';
import { PlantListSchema, type Plant } from './plant.js';
import type { Plan } from './plan.js';

const here = dirname(fileURLToPath(import.meta.url));
const plants: Plant[] = PlantListSchema.parse(
  JSON.parse(readFileSync(join(here, '../../../data/plants.json'), 'utf8')),
);
const db: PlantsDb = new Map(plants.map((p) => [p.id, p]));

function fullPlan(): Plan {
  return {
    id: 'plan-1',
    name: 'My Garden',
    createdAt: '2026-06-04T00:00:00Z',
    updatedAt: '2026-06-04T00:00:00Z',
    step: 'final',
    inputs: {
      zone: '7a',
      lastFrostDate: '2026-05-01',
      bed: { widthIn: 48, lengthIn: 96 },
      lightHours: 8,
      desiredPlants: ['tomato', 'basil', 'fennel'],
    },
    companions: {
      recommended: ['carrot'],
      discouraged: [{ a: 'fennel', b: 'tomato', reason: 'Fennel and Tomato are antagonists' }],
      confirmedPlants: ['tomato', 'basil', 'fennel'],
    },
    layout: {
      cellSizeIn: 24,
      cols: 2,
      rows: 4,
      grid: [
        { x: 0, y: 0, plantId: 'tomato' },
        { x: 1, y: 0, plantId: 'fennel' },
        { x: 0, y: 1, plantId: 'basil' },
        { x: 1, y: 1, plantId: null },
        { x: 0, y: 2, plantId: null },
        { x: 1, y: 2, plantId: null },
        { x: 0, y: 3, plantId: null },
        { x: 1, y: 3, plantId: null },
      ],
      unplaced: [],
    },
    timing: {
      perPlant: [
        {
          plantId: 'tomato',
          startIndoorsOn: '2026-03-20',
          transplantOn: '2026-05-15',
          harvestStart: '2026-07-29',
          harvestEnd: '2026-08-19',
        },
      ],
    },
  };
}

describe('renderPlanMarkdown', () => {
  it('renders a full plan with all sections', () => {
    const md = renderPlanMarkdown(fullPlan(), db);
    expect(md).toMatch(/^# My Garden/);
    expect(md).toContain('## Overview');
    expect(md).toContain('## Confirmed plants');
    expect(md).toContain('## Layout');
    expect(md).toContain('## Timing');
    expect(md).toContain('## Notes');
    expect(md).toContain('48″ × 96″');
    expect(md).toContain('2026-05-01');
    expect(md).toContain('| Tomato |');
    expect(md).toContain('2026-07-29');
    // Discouraged kept-pair surfaces in Notes
    expect(md).toMatch(/Kept discouraged pair.*Fennel.*Tomato/);
    // Grid renders short codes
    expect(md).toMatch(/\|\s*Toma\s*\|/);
  });

  it('handles a partial plan (missing layout/timing) gracefully', () => {
    const plan: Plan = {
      id: 'p',
      name: 'Empty',
      createdAt: '2026-06-04T00:00:00Z',
      updatedAt: '2026-06-04T00:00:00Z',
      step: 'inputs',
    };
    const md = renderPlanMarkdown(plan, db);
    expect(md).toMatch(/^# Empty/);
    expect(md).toContain('_Inputs not set._');
    expect(md).toContain('_None confirmed yet._');
    expect(md).toContain('_No layout._');
    expect(md).toContain('_No timing set._');
    expect(md).toContain('_No discouraged pairs kept._');
  });
});
