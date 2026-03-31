import { describe, it, expect } from "vitest";
import { getVesselCategory } from "./db-operations";

describe("getVesselCategory", () => {
  it("maps cargo codes (70-79) to Cargo", () => {
    expect(getVesselCategory(70)).toBe("Cargo");
    expect(getVesselCategory(75)).toBe("Cargo");
  });

  it("maps tanker codes (80-89) to Tanker", () => {
    expect(getVesselCategory(80)).toBe("Tanker");
  });

  it("maps passenger codes (60-69) to Passenger", () => {
    expect(getVesselCategory(60)).toBe("Passenger");
  });

  it("maps fishing code 30 to Fishing", () => {
    expect(getVesselCategory(30)).toBe("Fishing");
  });

  it("maps unknown codes to Other", () => {
    expect(getVesselCategory(99)).toBe("Other");
    expect(getVesselCategory(0)).toBe("Other");
  });
});
