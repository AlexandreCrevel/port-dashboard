import { z } from 'zod';

export const vesselSchema = z.object({
  mmsi: z.string().regex(/^\d{9}$/, 'MMSI must be 9 digits'),
  name: z.string().nullable(),
  vesselType: z.string().nullable(),
  flag: z.string().nullable(),
  length: z.number().nullable(),
  width: z.number().nullable(),
  destination: z.string().nullable(),
  firstSeen: z.coerce.date(),
  lastSeen: z.coerce.date(),
});

export const positionSchema = z.object({
  mmsi: z.string().regex(/^\d{9}$/),
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90),
  speed: z.number().min(0).nullable(),
  heading: z.number().min(0).max(360).nullable(),
  course: z.number().min(0).max(360).nullable(),
  timestamp: z.coerce.date(),
});

export const nlqRequestSchema = z.object({
  query: z.string().min(3).max(500),
});

export const weatherReadingSchema = z.object({
  timestamp: z.coerce.date(),
  windSpeed: z.number().nullable(),
  windDirection: z.number().nullable(),
  waveHeight: z.number().nullable(),
  visibility: z.number().nullable(),
  temperature: z.number().nullable(),
});

export const sqlSafetySchema = z
  .string()
  .refine((sql) => /^SELECT\s/i.test(sql.trim()), 'Only SELECT queries allowed')
  .refine(
    (sql) => !/\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|GRANT|REVOKE)\b/i.test(sql),
    'DDL/DML statements not allowed',
  )
  .refine((sql) => !/;\s*\S/.test(sql), 'Multiple statements not allowed');
