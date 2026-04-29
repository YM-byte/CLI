import { z } from 'zod';

const envSchema = z.object({
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  PORT: z.coerce.number().default(3001),
});

export type AppConfig = z.infer<typeof envSchema>;

export function getAppConfig(): AppConfig {
  return envSchema.parse(process.env);
}
