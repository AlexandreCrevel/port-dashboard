export interface Vessel {
  mmsi: string;
  name: string | null;
  vesselType: string | null;
  flag: string | null;
  length: number | null;
  width: number | null;
  destination: string | null;
  firstSeen: Date;
  lastSeen: Date;
}

export interface Position {
  id: number;
  mmsi: string;
  longitude: number;
  latitude: number;
  speed: number | null;
  heading: number | null;
  course: number | null;
  timestamp: Date;
}

export interface VesselWithPosition extends Vessel {
  longitude: number;
  latitude: number;
  speed: number | null;
  heading: number | null;
  course: number | null;
  positionTimestamp: Date;
}

export interface WeatherReading {
  id: number;
  timestamp: Date;
  windSpeed: number | null;
  windDirection: number | null;
  waveHeight: number | null;
  visibility: number | null;
  temperature: number | null;
}

export interface DailySummary {
  id: number;
  date: string;
  summary: string;
  notableEvents: NotableEvent[] | null;
  generatedAt: Date;
}

export interface NotableEvent {
  title: string;
  description: string;
  type: 'arrival' | 'departure' | 'weather' | 'traffic' | 'other';
}

export interface NlqRequest {
  query: string;
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
