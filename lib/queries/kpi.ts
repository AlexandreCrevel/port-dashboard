import { db } from "../db";
import { sql } from "drizzle-orm";
import { PORT_CONFIG } from "../constants";

const BBOX = PORT_CONFIG.boundingBox;
const STALENESS_HOURS = PORT_CONFIG.positionStalenessHours;

export async function getKpiMetrics() {
  return db.execute(sql`
    SELECT
      (SELECT COUNT(DISTINCT mmsi) FROM positions
        WHERE timestamp > NOW() - (${STALENESS_HOURS} * INTERVAL '1 hour')
        AND ST_Within(position, ST_MakeEnvelope(${BBOX.min.longitude}, ${BBOX.min.latitude}, ${BBOX.max.longitude}, ${BBOX.max.latitude}, 4326))
      ) as vessels_in_zone,
      (SELECT COUNT(DISTINCT mmsi) FROM vessels WHERE first_seen::date = CURRENT_DATE) as arrivals_today,
      (SELECT COUNT(DISTINCT mmsi) FROM vessels WHERE last_seen::date = CURRENT_DATE AND last_seen < NOW() - INTERVAL '1 hour') as departures_today
  `);
}
