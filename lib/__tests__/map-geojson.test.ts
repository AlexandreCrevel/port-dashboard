import { describe, expect, it, vi } from "vitest";
import type { VesselWithPosition } from "@/types";

vi.mock("@/lib/vessel-category", () => ({
  getVesselColor: (type: string | null) =>
    type === "Cargo" ? "#3b82f6" : "#9ca3af",
}));

import { vesselsToGeoJSON } from "@/lib/map-geojson";

const mockVessel = (
  overrides: Partial<VesselWithPosition> = {},
): VesselWithPosition => ({
  mmsi: "123456789",
  name: "Test Ship",
  vesselType: "Cargo",
  flag: "FR",
  length: 100,
  width: 20,
  destination: "Le Havre",
  firstSeen: new Date("2026-01-01"),
  lastSeen: new Date("2026-01-02"),
  longitude: 0.1079,
  latitude: 49.4944,
  speed: 12.5,
  heading: 245,
  course: 240,
  positionTimestamp: new Date("2026-01-02"),
  ...overrides,
});

describe("vesselsToGeoJSON", () => {
  it("returns empty FeatureCollection for empty array", () => {
    const result = vesselsToGeoJSON([], []);

    expect(result).toEqual({
      type: "FeatureCollection",
      features: [],
    });
  });

  it("produces correct Point feature with properties for a single vessel", () => {
    const vessel = mockVessel();
    const result = vesselsToGeoJSON([vessel], []);

    expect(result.features).toHaveLength(1);

    const feature = result.features[0];
    expect(feature.type).toBe("Feature");
    expect(feature.geometry).toEqual({
      type: "Point",
      coordinates: [0.1079, 49.4944],
    });
    expect(feature.properties).toEqual({
      mmsi: "123456789",
      name: "Test Ship",
      vesselType: "Cargo",
      color: "#3b82f6",
      speed: 12.5,
      heading: 245,
      isHighlighted: false,
    });
  });

  it("sets isHighlighted to true when mmsi is in highlightedMmsis", () => {
    const vessel = mockVessel({ mmsi: "999888777" });
    const result = vesselsToGeoJSON([vessel], ["999888777"]);

    expect(result.features[0].properties?.isHighlighted).toBe(true);
  });

  it("produces correct number of features for multiple vessels", () => {
    const vessels = [
      mockVessel({ mmsi: "111111111" }),
      mockVessel({ mmsi: "222222222" }),
      mockVessel({ mmsi: "333333333" }),
    ];
    const result = vesselsToGeoJSON(vessels, []);

    expect(result.features).toHaveLength(3);
  });
});
