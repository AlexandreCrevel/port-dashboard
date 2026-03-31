import { z } from 'zod';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { NLQ_TIMEOUT_MS } from '@/lib/constants';

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  DATABASE_URL_READONLY: z.string().url(),
});

type Env = z.infer<typeof EnvSchema>;

function getEnv(): Env {
  const result = EnvSchema.safeParse(process.env as Record<string, string | undefined>);
  if (!result.success) {
    throw new Error(`Invalid environment variables: ${result.error.message}`);
  }
  return result.data;
}

const env = getEnv();

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool);

const readonlyPool = new Pool({
  connectionString: env.DATABASE_URL_READONLY,
  statement_timeout: NLQ_TIMEOUT_MS,
});

export const dbReadonly = drizzle(readonlyPool);
