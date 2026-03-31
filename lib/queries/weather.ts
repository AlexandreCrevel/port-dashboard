import { db } from '../db';
import { weatherReadings } from '../schema';
import { desc, gte, sql } from 'drizzle-orm';

export async function getLatestWeather() {
  return db.select().from(weatherReadings).orderBy(desc(weatherReadings.timestamp)).limit(1);
}

export async function getWeatherHistory(hours: number = 24) {
  return db
    .select()
    .from(weatherReadings)
    .where(gte(weatherReadings.timestamp, sql`NOW() - INTERVAL '${sql.raw(String(hours))} hours'`))
    .orderBy(weatherReadings.timestamp);
}
