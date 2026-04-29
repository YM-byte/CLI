import type { FastifyInstance } from 'fastify';

export async function registerHealthRoutes(app: FastifyInstance) {
  app.get('/api/health', async () => {
    return {
      framework: 'fastify',
      project: '{{projectName}}',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  });
}
