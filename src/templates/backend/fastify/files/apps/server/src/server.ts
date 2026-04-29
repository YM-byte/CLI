import { createApp } from './app.js';
import { getAppConfig } from './config.js';

async function start() {
  const config = getAppConfig();
  const app = await createApp();

  await app.listen({
    host: '0.0.0.0',
    port: config.PORT,
  });
}

void start();
