import { db } from "../db";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { PORT_CONFIG } from "../constants";
import type { VesselWithPosition } from "@/types";

const TimestampSchema = z.string().datetime({ offset: true });

interface VesselRow {
  mmsi: string;
  name: string;
  vessel_type: string | null;
  flag: string | null;
  length: number | null;
  width: number | null;
  destination: string | null;
  first_seen: string;
  last_seen: string;
  longitude: number;
  latitude: number;
  speed: number | null;
  heading: number | null;
  course: number | null;
  position_timestamp: string;
}

export function mapVesselRow(row: Record<string, unknown>): VesselWithPosition {
  const r = row as unknown as VesselRow;
  return {
    mmsi: r.mmsi,
    name: r.name,
    vesselType: r.vessel_type,
    flag: r.flag,
    length: r.length,
    width: r.width,
    destination: r.destination,
    firstSeen: new Date(r.first_seen),
    lastSeen: new Date(r.last_seen),
    longitude: r.longitude,
    latitude: r.latitude,
    speed: r.speed,
    heading: r.heading,
    course: r.course,
    positionTimestamp: new Date(r.position_timestamp),
  };
}

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
  const hours = PORT_CONFIG.positionStalenessHours;
  return db.execute(
    sql`${VESSELS_IN_ZONE_BASE} AND p.timestamp > NOW() - (${hours} * INTERVAL '1 hour') ORDER BY v.mmsi, p.timestamp DESC`,
  );
}

export async function getPositionsSince(since: string) {
  const validSince = TimestampSchema.parse(since);
  return db.execute(
    sql`${VESSELS_IN_ZONE_BASE} AND p.timestamp > ${validSince}::timestamptz ORDER BY v.mmsi, p.timestamp DESC`,
  );
}

export async function getTrafficTimeline(hours: number = 24) {
  return db.execute(sql`
    SELECT date_trunc('hour', p.timestamp) AS timestamp, COUNT(DISTINCT p.mmsi) AS count
    FROM positions p
    WHERE p.timestamp > NOW() - (${hours} * INTERVAL '1 hour')
    GROUP BY date_trunc('hour', p.timestamp)
    ORDER BY timestamp
  `);
}
