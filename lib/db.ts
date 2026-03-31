import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

const readonlyPool = new Pool({
  connectionString: process.env.DATABASE_URL_READONLY,
  statement_timeout: 5000,
});

export const dbReadonly = drizzle(readonlyPool);
