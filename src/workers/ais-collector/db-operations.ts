import { Pool } from "pg";
import type { ParsedPosition, ParsedStaticData } from "./parser.js";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export function getVesselCategory(typeCode: number): string {
  if (typeCode >= 70 && typeCode <= 79) return "Cargo";
  if (typeCode >= 80 && typeCode <= 89) return "Tanker";
  if (typeCode >= 60 && typeCode <= 69) return "Passenger";
  if (typeCode === 30) return "Fishing";
  if (typeCode === 52) return "Tug";
  if (typeCode >= 40 && typeCode <= 49) return "High Speed Craft";
  return "Other";
}

export async function upsertVesselFromPosition(
  mmsi: string,
  shipName: string | null,
  timestamp: Date,
) {
  await pool.query(
    `INSERT INTO vessels (mmsi, name, first_seen, last_seen) VALUES ($1, $2, $3, $3)
     ON CONFLICT (mmsi) DO UPDATE SET
       name = COALESCE(EXCLUDED.name, vessels.name),
       last_seen = GREATEST(EXCLUDED.last_seen, vessels.last_seen)`,
    [mmsi, shipName, timestamp],
  );
}

export async function upsertVesselFromStatic(data: ParsedStaticData) {
  const typeCategory = getVesselCategory(data.vesselType);
  await pool.query(
    `INSERT INTO vessels (mmsi, name, vessel_type, destination, length, width, first_seen, last_seen)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
     ON CONFLICT (mmsi) DO UPDATE SET
       name = COALESCE(EXCLUDED.name, vessels.name),
       vessel_type = COALESCE(EXCLUDED.vessel_type, vessels.vessel_type),
       destination = COALESCE(EXCLUDED.destination, vessels.destination),
       length = COALESCE(EXCLUDED.length, vessels.length),
       width = COALESCE(EXCLUDED.width, vessels.width),
       last_seen = GREATEST(EXCLUDED.last_seen, vessels.last_seen)`,
    [
      data.mmsi,
      data.name,
      typeCategory,
      data.destination,
      data.length,
      data.width,
      data.timestamp,
    ],
  );
}

export async function insertPosition(data: ParsedPosition) {
  await pool.query(
    `INSERT INTO positions (mmsi, position, speed, heading, course, timestamp)
     VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4, $5, $6, $7)`,
    [
      data.mmsi,
      data.longitude,
      data.latitude,
      data.speed,
      data.heading,
      data.course,
      data.timestamp,
    ],
  );
}
