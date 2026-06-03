import Fastify from 'fastify';
import cors from '@fastify/cors';
import { openDb } from './db/index.js';
import { loadPlants } from './plants.js';
import { healthRoutes } from './routes/health.js';

const PORT = Number(process.env.PORT ?? 3001);
const DB_PATH = process.env.DB_PATH ?? './data/app.db';
const PLANTS_PATH = process.env.PLANTS_PATH ?? '../../data/plants.json';
const WEB_ORIGIN = process.env.WEB_ORIGIN ?? 'http://localhost:5173';

export async function buildServer() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: WEB_ORIGIN });

  const db = openDb(DB_PATH);
  const plants = loadPlants(PLANTS_PATH);
  app.decorate('db', db);
  app.decorate('plants', plants);

  await app.register(healthRoutes);

  app.addHook('onClose', async () => {
    db.close();
  });

  return app;
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const app = await buildServer();
  try {
    await app.listen({ port: PORT, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}
