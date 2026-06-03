import 'fastify';
import type { DB } from './db/index.js';
import type { Plant } from '@gpb/shared';

declare module 'fastify' {
  interface FastifyInstance {
    db: DB;
    plants: Map<string, Plant>;
  }
}
