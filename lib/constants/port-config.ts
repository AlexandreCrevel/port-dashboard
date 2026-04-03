export const PORT_CONFIG = {
  name: "Le Havre",
  slug: "le-havre",
  timezone: "Europe/Paris",
  center: {
    latitude: 49.4944,
    longitude: 0.1079,
  },
  mapDefaults: {
    zoom: 12,
    minZoom: 8,
    maxZoom: 18,
  },
  boundingBox: {
    min: { latitude: 49.4, longitude: -0.15 },
    max: { latitude: 49.55, longitude: 0.4 },
  },
  geofence: [
    [0.04, 49.46],
    [0.18, 49.46],
    [0.18, 49.52],
    [0.04, 49.52],
    [0.04, 49.46],
  ] as const,
  weather: {
    latitude: 49.49,
    longitude: 0.11,
  },
  positionStalenessHours: 6,
} as const;

export type PortConfig = typeof PORT_CONFIG;
