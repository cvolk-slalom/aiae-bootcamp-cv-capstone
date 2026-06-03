import type { FastifyPluginAsync } from 'fastify';

export const plantsRoutes: FastifyPluginAsync = async (app) => {
  app.get('/plants', async () => Array.from(app.plants.values()));
};
