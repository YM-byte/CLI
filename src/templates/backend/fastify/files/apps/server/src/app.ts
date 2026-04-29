import cors from '@fastify/cors';
import Fastify, { type FastifyInstance } from 'fastify';

import { getAppConfig } from './config.js';
import { registerHealthRoutes } from './routes/health.js';

export async function createApp(): Promise<FastifyInstance> {
  const config = getAppConfig();
  const app = Fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: config.CORS_ORIGIN,
  });

  await registerHealthRoutes(app);

  return app;
}
