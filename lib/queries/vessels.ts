import { db } from '../db';
import { sql } from 'drizzle-orm';
import { z } from 'zod';
import { PORT_CONFIG } from '../constants';

const TimestampSchema = z.string().datetime({ offset: true });

const BBOX = PORT_CONFIG.boundingBox;

const VESSELS_IN_ZONE_BASE = sql`
  SELECT DISTINCT ON (v.mmsi)
    v.mmsi, v.name, v.vessel_type, v.flag, v.length, v.width, v.destination,
    v.first_seen, v.last_seen,
    ST_X(p.position) as longitude, ST_Y(p.position) as latitude,
    p.speed, p.heading, p.course, p.timestamp as position_timestamp
  FROM vessels v
  INNER JOIN positions p ON v.mmsi = p.mmsi
  WHERE ST_Within(
    p.position,
    ST_MakeEnvelope(${BBOX.min.longitude}, ${BBOX.min.latitude}, ${BBOX.max.longitude}, ${BBOX.max.latitude}, 4326)
  )
`;

export async function getVesselsInZone() {
  return db.execute(sql`${VESSELS_IN_ZONE_BASE} AND p.timestamp > NOW() - INTERVAL '1 hour' ORDER BY v.mmsi, p.timestamp DESC`);
}

export async function getPositionsSince(since: string) {
  const validSince = TimestampSchema.parse(since);
  return db.execute(sql`${VESSELS_IN_ZONE_BASE} AND p.timestamp > ${validSince}::timestamptz ORDER BY v.mmsi, p.timestamp DESC`);
}

export async function getTrafficTimeline(hours: number = 24) {
  return db.execute(sql`
    SELECT date_trunc('hour', p.timestamp) as hour, COUNT(DISTINCT p.mmsi) as vessel_count
    FROM positions p
    WHERE p.timestamp > NOW() - INTERVAL '${sql.raw(String(hours))} hours'
    GROUP BY date_trunc('hour', p.timestamp)
    ORDER BY hour
  `);
}
