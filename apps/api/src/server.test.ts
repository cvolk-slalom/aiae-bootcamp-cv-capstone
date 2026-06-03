import { describe, it, expect, afterAll } from 'vitest';
import { buildServer } from './server.js';

process.env.DB_PATH = ':memory:';
process.env.PLANTS_PATH = '../../data/plants.json';

const app = await buildServer();
afterAll(async () => {
  await app.close();
});

describe('GET /health', () => {
  it('returns { ok: true }', async () => {
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true });
  });
});
