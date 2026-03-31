import { db } from '../db';
import { dailySummaries } from '../schema';
import { eq, desc } from 'drizzle-orm';

export async function getLatestSummary() {
  return db.select().from(dailySummaries).orderBy(desc(dailySummaries.date)).limit(1);
}

export async function getSummaryByDate(dateStr: string) {
  return db.select().from(dailySummaries).where(eq(dailySummaries.date, dateStr));
}
