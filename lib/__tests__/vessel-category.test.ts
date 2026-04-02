import { describe, expect, it } from "vitest";
import { getVesselColor } from "@/lib/vessel-category";
import { VESSEL_TYPE_COLORS } from "@/lib/constants";

describe("getVesselColor", () => {
  it.each(Object.entries(VESSEL_TYPE_COLORS))(
    "returns %s color (%s)",
    (category, expectedColor) => {
      expect(getVesselColor(category)).toBe(expectedColor);
    },
  );

  it("returns Other color for null input", () => {
    expect(getVesselColor(null)).toBe("#6b7280");
  });

  it("returns Other color for unknown vessel type", () => {
    expect(getVesselColor("Unknown")).toBe("#6b7280");
  });

  it("returns Other color for empty string", () => {
    expect(getVesselColor("")).toBe("#6b7280");
  });
});
