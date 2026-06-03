import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import { PlantListSchema, type Plant } from '@gpb/shared';
import { recommend, discouraged, buildCompanionsResult } from './companions.js';

const here = dirname(fileURLToPath(import.meta.url));
const raw = JSON.parse(readFileSync(resolve(here, '../../../../data/plants.json'), 'utf-8'));
const plants = PlantListSchema.parse(raw);
const db = new Map<string, Plant>(plants.map((p) => [p.id, p]));

describe('companions.recommend', () => {
  it('returns [] for empty desired', () => {
    expect(recommend([], db)).toEqual([]);
  });

  it('suggests companions for an all-good list and excludes desired', () => {
    const recs = recommend(['tomato', 'basil'], db);
    expect(recs.length).toBeGreaterThan(0);
    expect(recs.length).toBeLessThanOrEqual(5);
    expect(recs).not.toContain('tomato');
    expect(recs).not.toContain('basil');
    expect(new Set(recs).size).toBe(recs.length);
  });

  it('excludes candidates whose antagonists overlap the desired set', () => {
    const recs = recommend(['tomato', 'basil', 'fennel'], db);
    for (const r of recs) {
      const p = db.get(r);
      expect(p).toBeDefined();
      expect(p!.antagonists.some((a) => ['tomato', 'basil', 'fennel'].includes(a))).toBe(false);
    }
  });
});

describe('companions.discouraged', () => {
  it('returns [] when no antagonist pair exists', () => {
    expect(discouraged(['tomato', 'basil', 'carrot'], db)).toEqual([]);
  });

  it('flags tomato + fennel', () => {
    const pairs = discouraged(['tomato', 'basil', 'fennel'], db);
    expect(pairs).toHaveLength(1);
    expect(pairs[0]).toMatchObject({ a: 'fennel', b: 'tomato' });
    expect(pairs[0]?.reason).toMatch(/antagonists/);
  });
});

describe('buildCompanionsResult', () => {
  it('shape matches the schema', () => {
    const r = buildCompanionsResult(['tomato', 'basil', 'fennel'], db);
    expect(r).toHaveProperty('recommended');
    expect(r).toHaveProperty('discouraged');
  });
});
