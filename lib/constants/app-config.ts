import { env } from "@/lib/env";

export const SSE_RETRY_MS = 3000;
export const POLLING_FALLBACK_MS = 30_000;
export const NLQ_TIMEOUT_MS = 5000;
export const DATA_RETENTION_DAYS = 90;

export const WEATHER_API = {
  forecast: "https://api.open-meteo.com/v1/forecast",
  marine: "https://marine-api.open-meteo.com/v1/marine",
} as const;

export const AIS_WEBSOCKET_URL = env.AIS_WEBSOCKET_URL;
