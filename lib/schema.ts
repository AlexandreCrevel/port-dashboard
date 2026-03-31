import {
  pgTable,
  text,
  real,
  bigserial,
  serial,
  timestamp,
  date,
  jsonb,
  index,
  customType,
} from 'drizzle-orm/pg-core';

const geometry = customType<{
  data: { longitude: number; latitude: number };
  driverData: string;
}>({
  dataType() {
    return 'GEOMETRY(Point, 4326)';
  },
  toDriver(value) {
    return `SRID=4326;POINT(${value.longitude} ${value.latitude})`;
  },
  fromDriver(value: string) {
    const match = value.match(/([-\d.]+)\s+([-\d.]+)/);
    if (!match) return { longitude: 0, latitude: 0 };
    return { longitude: parseFloat(match[1]), latitude: parseFloat(match[2]) };
  },
});

export const vessels = pgTable('vessels', {
  mmsi: text('mmsi').primaryKey(),
  name: text('name'),
  vesselType: text('vessel_type'),
  flag: text('flag'),
  length: real('length'),
  width: real('width'),
  destination: text('destination'),
  firstSeen: timestamp('first_seen', { withTimezone: true }).notNull(),
  lastSeen: timestamp('last_seen', { withTimezone: true }).notNull(),
});

export const positions = pgTable(
  'positions',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    mmsi: text('mmsi')
      .notNull()
      .references(() => vessels.mmsi),
    position: geometry('position').notNull(),
    speed: real('speed'),
    heading: real('heading'),
    course: real('course'),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_positions_timestamp').on(table.timestamp),
    index('idx_positions_mmsi').on(table.mmsi),
    index('idx_positions_geo').using('gist', table.position),
  ],
);

export const weatherReadings = pgTable(
  'weather_readings',
  {
    id: serial('id').primaryKey(),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    windSpeed: real('wind_speed'),
    windDirection: real('wind_direction'),
    waveHeight: real('wave_height'),
    visibility: real('visibility'),
    temperature: real('temperature'),
    rawData: jsonb('raw_data'),
  },
  (table) => [index('idx_weather_timestamp').on(table.timestamp)],
);

export const dailySummaries = pgTable('daily_summaries', {
  id: serial('id').primaryKey(),
  date: date('date').unique().notNull(),
  summary: text('summary').notNull(),
  notableEvents: jsonb('notable_events').$type<
    Array<{
      title: string;
      description: string;
      type: string;
    }>
  >(),
  generatedAt: timestamp('generated_at', { withTimezone: true }).defaultNow(),
});
