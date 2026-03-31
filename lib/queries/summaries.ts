import { db } from '../db';
import { dailySummaries } from '../schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

const DateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

export async function getLatestSummary() {
  return db.select().from(dailySummaries).orderBy(desc(dailySummaries.date)).limit(1);
}

export async function getSummaryByDate(dateStr: string) {
  const validDate = DateSchema.parse(dateStr);
  return db.select().from(dailySummaries).where(eq(dailySummaries.date, validDate));
}
