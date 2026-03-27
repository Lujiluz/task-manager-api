import dotenv from 'dotenv';
import { z } from 'zod';

// Skip .env loading in test environment so unit tests can manipulate process.env freely
if (process.env.NODE_ENV !== 'test') {
  dotenv.config();
}

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(
    `Invalid environment variables:\n${parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('\n')}`
  );
}

export const config = {
  port: parsed.data.PORT,
  nodeEnv: parsed.data.NODE_ENV,
  databaseUrl: parsed.data.DATABASE_URL,
} as const;
