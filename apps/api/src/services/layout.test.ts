import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import { PlantListSchema, type Plant } from '@gpb/shared';
import { computeLayout, validateLayout } from './layout.js';

const here = dirname(fileURLToPath(import.meta.url));
const raw = JSON.parse(readFileSync(resolve(here, '../../../../data/plants.json'), 'utf-8'));
const plants = PlantListSchema.parse(raw);
const db = new Map<string, Plant>(plants.map((p) => [p.id, p]));

describe('computeLayout', () => {
  it('returns an empty grid with min cell size for empty confirmed list', () => {
    const r = computeLayout({ bed: { widthIn: 48, lengthIn: 96 }, confirmedPlants: [], lightHours: 8 }, db);
    expect(r.cellSizeIn).toBe(6);
    expect(r.cols).toBe(8);
    expect(r.rows).toBe(16);
    expect(r.grid).toHaveLength(128);
    expect(r.grid.every((c) => c.plantId === null)).toBe(true);
    expect(r.unplaced).toEqual([]);
  });

  it('packs 6 plants into a 48x96 bed without overlap', () => {
    const ids = ['tomato', 'basil', 'carrot', 'onion', 'marigold', 'nasturtium'];
    const r = computeLayout({ bed: { widthIn: 48, lengthIn: 96 }, confirmedPlants: ids, lightHours: 8 }, db);
    expect(r.cellSizeIn).toBeGreaterThanOrEqual(6);
    expect(r.cellSizeIn).toBeLessThanOrEqual(24);
    expect(r.grid).toHaveLength(r.cols * r.rows);
    // each placed plant id appears at least once and cells are unique
    const seen = new Set<string>();
    for (const c of r.grid) {
      const key = `${c.x},${c.y}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
    for (const id of ids) {
      if (!r.unplaced.includes(id)) {
        expect(r.grid.some((c) => c.plantId === id)).toBe(true);
      }
    }
  });

  it('pushes oversized plants to unplaced', () => {
    // tiny bed: 10x10 in, cell size will be min(24, max(6, max-spacing)).
    // tomato spacingIn 24 -> cell 24 -> cols=floor(10/24)=0 -> nothing fits.
    const r = computeLayout({ bed: { widthIn: 10, lengthIn: 10 }, confirmedPlants: ['tomato'], lightHours: 8 }, db);
    expect(r.cols).toBe(0);
    expect(r.rows).toBe(0);
    expect(r.unplaced).toEqual(['tomato']);
  });

  it('low-light demotes full-sun plants to unplaced', () => {
    const tomato = db.get('tomato')!;
    expect(tomato.sun).toBe('full');
    const r = computeLayout(
      { bed: { widthIn: 48, lengthIn: 96 }, confirmedPlants: ['tomato', 'basil'], lightHours: 4 },
      db,
    );
    expect(r.unplaced).toContain('tomato');
    expect(r.grid.some((c) => c.plantId === 'tomato')).toBe(false);
  });
});

describe('validateLayout', () => {
  it('passes a freshly computed layout', () => {
    const ids = ['tomato', 'basil', 'carrot'];
    const bed = { widthIn: 48, lengthIn: 96 };
    const r = computeLayout({ bed, confirmedPlants: ids, lightHours: 8 }, db);
    expect(validateLayout(r, bed, ids)).toBeNull();
  });

  it('rejects layouts with unknown plant ids', () => {
    const bed = { widthIn: 48, lengthIn: 96 };
    const r = computeLayout({ bed, confirmedPlants: ['tomato'], lightHours: 8 }, db);
    const tampered = {
      ...r,
      grid: r.grid.map((c, i) => (i === 0 ? { ...c, plantId: 'not-a-plant' } : c)),
    };
    const err = validateLayout(tampered, bed, ['tomato']);
    expect(err?.formErrors.some((m) => m.includes('not-a-plant'))).toBe(true);
  });

  it('rejects dimension mismatch', () => {
    const bed = { widthIn: 48, lengthIn: 96 };
    const r = computeLayout({ bed, confirmedPlants: ['tomato'], lightHours: 8 }, db);
    const tampered = { ...r, cols: r.cols + 1, grid: r.grid };
    const err = validateLayout(tampered, bed, ['tomato']);
    expect(err?.formErrors.some((m) => m.includes('dimensions mismatch') || m.includes('grid length'))).toBe(true);
  });
});
