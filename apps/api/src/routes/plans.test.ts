import { describe, it, expect, afterAll } from 'vitest';
import { buildServer } from '../server.js';

process.env.DB_PATH = ':memory:';
process.env.PLANTS_PATH = '../../data/plants.json';

const { app } = await buildServer();
afterAll(async () => {
  await app.close();
});

describe('plans flow', () => {
  it('creates, fetches, updates inputs, and lists', async () => {
    const create = await app.inject({
      method: 'POST',
      url: '/plans',
      payload: { name: 'My Bed' },
    });
    expect(create.statusCode).toBe(201);
    const created = create.json();
    expect(created.step).toBe('inputs');
    expect(created.id).toBeTruthy();

    const get = await app.inject({ method: 'GET', url: `/plans/${created.id}` });
    expect(get.statusCode).toBe(200);
    expect(get.json().name).toBe('My Bed');

    const patch = await app.inject({
      method: 'PATCH',
      url: `/plans/${created.id}/inputs`,
      payload: {
        zone: '7a',
        lastFrostDate: '2026-04-15',
        bed: { widthIn: 48, lengthIn: 96 },
        lightHours: 8,
        desiredPlants: ['tomato', 'basil'],
      },
    });
    expect(patch.statusCode).toBe(200);
    expect(patch.json().step).toBe('companions');
    expect(patch.json().inputs.desiredPlants).toEqual(['tomato', 'basil']);

    const list = await app.inject({ method: 'GET', url: '/plans' });
    expect(list.statusCode).toBe(200);
    const summaries = list.json();
    expect(summaries.length).toBeGreaterThanOrEqual(1);
    expect(summaries[0].id).toBe(created.id);
  });

  it('rejects invalid inputs with 400 + field errors', async () => {
    const create = await app.inject({
      method: 'POST',
      url: '/plans',
      payload: { name: 'Bad' },
    });
    const id = create.json().id;

    const patch = await app.inject({
      method: 'PATCH',
      url: `/plans/${id}/inputs`,
      payload: {
        zone: '',
        lastFrostDate: '2026-04-15',
        bed: { widthIn: -10, lengthIn: 96 },
        lightHours: 50,
        desiredPlants: [],
      },
    });
    expect(patch.statusCode).toBe(400);
    expect(patch.json().errors).toBeTruthy();
  });

  it('rejects unknown plant ids', async () => {
    const create = await app.inject({
      method: 'POST',
      url: '/plans',
      payload: { name: 'X' },
    });
    const id = create.json().id;
    const patch = await app.inject({
      method: 'PATCH',
      url: `/plans/${id}/inputs`,
      payload: {
        zone: '6b',
        lastFrostDate: '2026-04-15',
        bed: { widthIn: 48, lengthIn: 48 },
        lightHours: 6,
        desiredPlants: ['not-a-plant'],
      },
    });
    expect(patch.statusCode).toBe(400);
  });

  it('404s for missing plan', async () => {
    const res = await app.inject({ method: 'GET', url: '/plans/nope' });
    expect(res.statusCode).toBe(404);
  });
});

describe('plants', () => {
  it('returns the seeded list', async () => {
    const res = await app.inject({ method: 'GET', url: '/plants' });
    expect(res.statusCode).toBe(200);
    expect(res.json().length).toBeGreaterThanOrEqual(20);
  });
});

describe('companions flow', () => {
  async function seedPlanWithInputs(desired: string[]) {
    const create = await app.inject({ method: 'POST', url: '/plans', payload: { name: 'C' } });
    const id = create.json().id;
    await app.inject({
      method: 'PATCH',
      url: `/plans/${id}/inputs`,
      payload: {
        zone: '7a',
        lastFrostDate: '2026-04-15',
        bed: { widthIn: 48, lengthIn: 96 },
        lightHours: 8,
        desiredPlants: desired,
      },
    });
    return id;
  }

  it('returns recommendations + discouraged for tomato/basil/fennel', async () => {
    const id = await seedPlanWithInputs(['tomato', 'basil', 'fennel']);
    const res = await app.inject({ method: 'GET', url: `/plans/${id}/companions/recommendations` });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(Array.isArray(body.recommended)).toBe(true);
    expect(body.discouraged).toEqual([
      expect.objectContaining({ a: 'fennel', b: 'tomato' }),
    ]);
  });

  it('PATCH /companions persists confirmed list and advances step to layout', async () => {
    const id = await seedPlanWithInputs(['tomato', 'basil']);
    const res = await app.inject({
      method: 'PATCH',
      url: `/plans/${id}/companions`,
      payload: { confirmedPlants: ['tomato', 'basil', 'carrot'] },
    });
    expect(res.statusCode).toBe(200);
    const plan = res.json();
    expect(plan.step).toBe('layout');
    expect(plan.companions.confirmedPlants).toEqual(['tomato', 'basil', 'carrot']);

    const reload = await app.inject({ method: 'GET', url: `/plans/${id}` });
    expect(reload.json().companions.confirmedPlants).toEqual(['tomato', 'basil', 'carrot']);
  });

  it('PATCH /companions rejects unknown plant ids with 400', async () => {
    const id = await seedPlanWithInputs(['tomato']);
    const res = await app.inject({
      method: 'PATCH',
      url: `/plans/${id}/companions`,
      payload: { confirmedPlants: ['tomato', 'not-a-plant'] },
    });
    expect(res.statusCode).toBe(400);
  });
});

describe('layout flow', () => {
  async function seedThroughCompanions(
    desired: string[],
    confirmed: string[],
    bed = { widthIn: 48, lengthIn: 96 },
    lightHours = 8,
  ) {
    const create = await app.inject({ method: 'POST', url: '/plans', payload: { name: 'L' } });
    const id = create.json().id;
    await app.inject({
      method: 'PATCH',
      url: `/plans/${id}/inputs`,
      payload: { zone: '7a', lastFrostDate: '2026-04-15', bed, lightHours, desiredPlants: desired },
    });
    await app.inject({
      method: 'PATCH',
      url: `/plans/${id}/companions`,
      payload: { confirmedPlants: confirmed },
    });
    return id;
  }

  it('GET /layout/suggestion returns grid covering the bed', async () => {
    const id = await seedThroughCompanions(['tomato', 'basil'], ['tomato', 'basil', 'carrot']);
    const res = await app.inject({ method: 'GET', url: `/plans/${id}/layout/suggestion` });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.grid).toHaveLength(body.cols * body.rows);
    expect(body.cellSizeIn).toBeGreaterThanOrEqual(6);
  });

  it('PATCH /layout persists and advances step to timing', async () => {
    const id = await seedThroughCompanions(['tomato', 'basil'], ['tomato', 'basil']);
    const sug = await app.inject({ method: 'GET', url: `/plans/${id}/layout/suggestion` });
    const layout = sug.json();
    const patch = await app.inject({ method: 'PATCH', url: `/plans/${id}/layout`, payload: layout });
    expect(patch.statusCode).toBe(200);
    expect(patch.json().step).toBe('timing');
    const reload = await app.inject({ method: 'GET', url: `/plans/${id}` });
    expect(reload.json().layout.cols).toBe(layout.cols);
  });

  it('PATCH /layout rejects unknown plant ids in grid', async () => {
    const id = await seedThroughCompanions(['tomato'], ['tomato']);
    const sug = await app.inject({ method: 'GET', url: `/plans/${id}/layout/suggestion` });
    const layout = sug.json();
    layout.grid[0].plantId = 'not-a-plant';
    const patch = await app.inject({ method: 'PATCH', url: `/plans/${id}/layout`, payload: layout });
    expect(patch.statusCode).toBe(400);
    expect(patch.json().errors.formErrors.join(' ')).toMatch(/not-a-plant/);
  });

  it('PATCH /layout rejects dimension mismatch', async () => {
    const id = await seedThroughCompanions(['tomato'], ['tomato']);
    const sug = await app.inject({ method: 'GET', url: `/plans/${id}/layout/suggestion` });
    const layout = sug.json();
    layout.cols = layout.cols + 1;
    const patch = await app.inject({ method: 'PATCH', url: `/plans/${id}/layout`, payload: layout });
    expect(patch.statusCode).toBe(400);
  });
});
