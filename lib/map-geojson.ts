import type { FeatureCollection } from "geojson";
import type { VesselWithPosition } from "@/types";
import { getVesselColor } from "@/lib/vessel-category";

export const vesselsToGeoJSON = (
  vessels: VesselWithPosition[],
  highlightedMmsis: string[],
): FeatureCollection => ({
  type: "FeatureCollection",
  features: vessels.map((vessel) => ({
    type: "Feature" as const,
    geometry: {
      type: "Point" as const,
      coordinates: [vessel.longitude, vessel.latitude],
    },
    properties: {
      mmsi: vessel.mmsi,
      name: vessel.name ?? "Unknown",
      vesselType: vessel.vesselType ?? "Other",
      color: getVesselColor(vessel.vesselType),
      speed: vessel.speed,
      heading: vessel.heading,
      isHighlighted: highlightedMmsis.includes(vessel.mmsi),
    },
  })),
});
