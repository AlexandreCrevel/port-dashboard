import { describe, it, expect } from "vitest";
import {
  VESSEL_TYPE_COLORS,
  VESSEL_TYPE_CATEGORIES,
  VESSEL_TYPES,
} from "../constants";

describe("VESSEL_TYPE_CATEGORIES", () => {
  it("has a color for every category", () => {
    for (const category of Object.keys(VESSEL_TYPE_CATEGORIES)) {
      expect(VESSEL_TYPE_COLORS).toHaveProperty(category);
    }
  });
});

describe("VESSEL_TYPES", () => {
  it("returns undefined for unmapped codes (no silent type coercion)", () => {
    expect(VESSEL_TYPES[71]).toBeUndefined();
    expect(VESSEL_TYPES[999]).toBeUndefined();
  });

  it("sub-type codes in VESSEL_TYPE_CATEGORIES are not individually in VESSEL_TYPES", () => {
    // Codes 71-79 are sub-categories of Cargo, not mapped in VESSEL_TYPES
    const cargoCodes = VESSEL_TYPE_CATEGORIES.Cargo.filter(
      (code) => code !== 70,
    );
    for (const code of cargoCodes) {
      expect(VESSEL_TYPES[code]).toBeUndefined();
    }
  });

  it("returns the label for mapped codes", () => {
    expect(VESSEL_TYPES[70]).toBe("Cargo");
    expect(VESSEL_TYPES[52]).toBe("Tug");
    expect(VESSEL_TYPES[80]).toBe("Tanker");
  });
});
