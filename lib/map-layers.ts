import type { LayerSpecification } from "maplibre-gl";
import { PORT_CONFIG } from "@/lib/constants";

// -- Vessel layers --

export const VESSEL_CIRCLE_LAYER: LayerSpecification = {
  id: "vessel-circles",
  type: "circle",
  source: "vessels",
  paint: {
    "circle-radius": ["case", ["get", "isHighlighted"], 10, 6],
    "circle-color": ["get", "color"],
    "circle-stroke-width": ["case", ["get", "isHighlighted"], 3, 1],
    "circle-stroke-color": [
      "case",
      ["get", "isHighlighted"],
      "#fbbf24",
      "#ffffff",
    ],
    "circle-opacity": 0.9,
  },
};

export const VESSEL_LABEL_LAYER: LayerSpecification = {
  id: "vessel-labels",
  type: "symbol",
  source: "vessels",
  layout: {
    "text-field": ["get", "name"],
    "text-size": 11,
    "text-offset": [0, 1.5],
    "text-anchor": "top",
    "text-optional": true,
  },
  paint: {
    "text-color": "#e5e7eb",
    "text-halo-color": "#111827",
    "text-halo-width": 1.5,
  },
};

// -- Geofence layers --

export const GEOFENCE_FILL_LAYER: LayerSpecification = {
  id: "geofence-fill",
  type: "fill",
  source: "geofence",
  paint: {
    "fill-color": "#3b82f6",
    "fill-opacity": 0.08,
  },
};

export const GEOFENCE_LINE_LAYER: LayerSpecification = {
  id: "geofence-line",
  type: "line",
  source: "geofence",
  paint: {
    "line-color": "#3b82f6",
    "line-width": 2,
    "line-dasharray": [4, 2],
  },
};

// -- Geofence GeoJSON source data --

interface GeofenceFeature {
  type: "Feature";
  properties: Record<string, never>;
  geometry: {
    type: "Polygon";
    coordinates: [number, number][][];
  };
}

export const geofenceGeoJSON = (): GeofenceFeature => ({
  type: "Feature",
  properties: {},
  geometry: {
    type: "Polygon",
    coordinates: [PORT_CONFIG.geofence.map(([lng, lat]) => [lng, lat])],
  },
});
