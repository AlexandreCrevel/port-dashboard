import { dbReadonly } from '../db';
import { sql } from 'drizzle-orm';

export async function executeNlqQuery(sqlQuery: string) {
  return dbReadonly.execute(sql.raw(sqlQuery));
}
