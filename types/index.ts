import type { z } from "zod";
import type {
  vesselSchema,
  positionSchema,
  weatherReadingSchema,
  nlqRequestSchema,
} from "@/lib/schemas";

// Derived from Zod schemas — single source of truth
export type Vessel = z.infer<typeof vesselSchema>;
export type NlqRequest = z.infer<typeof nlqRequestSchema>;

// Extend schema types with DB-specific fields (id generated server-side)
export interface Position extends z.infer<typeof positionSchema> {
  id: number;
}

export interface WeatherReading extends z.infer<typeof weatherReadingSchema> {
  id: number;
}

// Composite types without a direct Zod schema equivalent
export interface VesselWithPosition extends Vessel {
  longitude: number;
  latitude: number;
  speed: number | null;
  heading: number | null;
  course: number | null;
  positionTimestamp: Date;
}

export interface NotableEvent {
  title: string;
  description: string;
  type: "arrival" | "departure" | "weather" | "traffic" | "other";
}

export interface DailySummary {
  id: number;
  date: string;
  summary: string;
  notableEvents: NotableEvent[] | null;
  generatedAt: Date;
}

export interface NlqResponse {
  sql: string;
  results: Record<string, unknown>[];
  explanation: string;
}

export interface KpiMetrics {
  vesselsInZone: number;
  arrivalsToday: number;
  departuresToday: number;
}

export interface VesselTypeDistribution {
  type: string;
  count: number;
  color: string;
}

export interface TrafficDataPoint {
  timestamp: string;
  count: number;
}
