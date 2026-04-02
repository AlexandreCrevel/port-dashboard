import { describe, expect, it } from "vitest";
import {
  formatDimensions,
  formatSpeed,
  formatHeading,
  formatTimestamp,
} from "@/lib/format-vessel";

describe("formatDimensions", () => {
  it("formats length and width", () => {
    expect(formatDimensions(100, 20)).toBe("100m × 20m");
  });

  it("returns N/A when length is null", () => {
    expect(formatDimensions(null, 20)).toBe("N/A");
  });

  it("returns N/A when width is null", () => {
    expect(formatDimensions(100, null)).toBe("N/A");
  });

  it("returns N/A when both are null", () => {
    expect(formatDimensions(null, null)).toBe("N/A");
  });
});

describe("formatSpeed", () => {
  it("formats a positive speed", () => {
    expect(formatSpeed(12.5)).toBe("12.5 kn");
  });

  it("formats zero speed", () => {
    expect(formatSpeed(0)).toBe("0 kn");
  });

  it("returns N/A for null", () => {
    expect(formatSpeed(null)).toBe("N/A");
  });
});

describe("formatHeading", () => {
  it("formats a heading in degrees", () => {
    expect(formatHeading(245)).toBe("245°");
  });

  it("formats zero heading", () => {
    expect(formatHeading(0)).toBe("0°");
  });

  it("returns N/A for null", () => {
    expect(formatHeading(null)).toBe("N/A");
  });
});

describe("formatTimestamp", () => {
  it("returns a fr-FR formatted string with Europe/Paris timezone", () => {
    const date = new Date("2025-06-15T14:30:00Z");
    const result = formatTimestamp(date);

    expect(result).toContain("15");
    expect(result).toContain("06");
    expect(result).toContain("2025");
    expect(result).toContain("16:30");
  });
});
