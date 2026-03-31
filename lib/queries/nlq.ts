import { sqlSafetySchema } from '../schemas';
import { dbReadonly } from '../db';
import { sql } from 'drizzle-orm';

export async function executeNlqQuery(sqlQuery: string) {
  const validatedQuery = sqlSafetySchema.parse(sqlQuery);
  return dbReadonly.execute(sql.raw(validatedQuery));
}
