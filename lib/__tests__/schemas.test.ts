import { describe, it, expect } from "vitest";
import {
  sqlSafetySchema,
  positionSchema,
  nlqRequestSchema,
  vesselSchema,
  weatherReadingSchema,
} from "../schemas";

describe("sqlSafetySchema", () => {
  it("accepts valid SELECT queries", () => {
    expect(sqlSafetySchema.safeParse("SELECT * FROM vessels").success).toBe(
      true,
    );
    expect(
      sqlSafetySchema.safeParse(
        "SELECT name FROM vessels WHERE mmsi = '123456789'",
      ).success,
    ).toBe(true);
  });

  it("rejects INSERT statements", () => {
    expect(
      sqlSafetySchema.safeParse("INSERT INTO vessels VALUES (1)").success,
    ).toBe(false);
  });

  it("rejects DROP statements", () => {
    expect(sqlSafetySchema.safeParse("DROP TABLE vessels").success).toBe(false);
  });

  it("rejects multiple statements", () => {
    expect(
      sqlSafetySchema.safeParse("SELECT 1; DROP TABLE vessels").success,
    ).toBe(false);
  });

  it("rejects semicolon followed by SQL comment (injection via comment masking)", () => {
    expect(
      sqlSafetySchema.safeParse("SELECT 1; -- DROP TABLE vessels").success,
    ).toBe(false);
  });
});

describe("positionSchema", () => {
  it("validates correct position data", () => {
    const result = positionSchema.safeParse({
      mmsi: "123456789",
      longitude: 0.11,
      latitude: 49.49,
      speed: 12.5,
      heading: 180,
      course: 175,
      timestamp: "2026-03-30T12:00:00Z",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid MMSI", () => {
    const result = positionSchema.safeParse({
      mmsi: "12345",
      longitude: 0.11,
      latitude: 49.49,
      speed: null,
      heading: null,
      course: null,
      timestamp: new Date(),
    });
    expect(result.success).toBe(false);
  });
});

describe("vesselSchema", () => {
  it("validates a complete valid vessel", () => {
    const result = vesselSchema.safeParse({
      mmsi: "123456789",
      name: "CMA CGM LIBRA",
      vesselType: "Cargo",
      flag: "FR",
      length: 294,
      width: 32,
      destination: "LE HAVRE",
      firstSeen: "2026-01-01T00:00:00Z",
      lastSeen: "2026-03-30T12:00:00Z",
    });
    expect(result.success).toBe(true);
  });

  it("accepts nullable fields as null", () => {
    const result = vesselSchema.safeParse({
      mmsi: "987654321",
      name: null,
      vesselType: null,
      flag: null,
      length: null,
      width: null,
      destination: null,
      firstSeen: new Date(),
      lastSeen: new Date(),
    });
    expect(result.success).toBe(true);
  });

  it("rejects MMSI that is not 9 digits", () => {
    const result = vesselSchema.safeParse({
      mmsi: "1234",
      name: null,
      vesselType: null,
      flag: null,
      length: null,
      width: null,
      destination: null,
      firstSeen: new Date(),
      lastSeen: new Date(),
    });
    expect(result.success).toBe(false);
  });
});

describe("weatherReadingSchema", () => {
  it("validates a complete weather reading", () => {
    const result = weatherReadingSchema.safeParse({
      timestamp: "2026-03-30T12:00:00Z",
      windSpeed: 15.2,
      windDirection: 270,
      waveHeight: 1.5,
      visibility: 10,
      temperature: 14.3,
    });
    expect(result.success).toBe(true);
  });

  it("accepts all nullable fields as null", () => {
    const result = weatherReadingSchema.safeParse({
      timestamp: new Date(),
      windSpeed: null,
      windDirection: null,
      waveHeight: null,
      visibility: null,
      temperature: null,
    });
    expect(result.success).toBe(true);
  });
});

describe("nlqRequestSchema", () => {
  it("rejects queries shorter than 3 characters", () => {
    expect(nlqRequestSchema.safeParse({ query: "ab" }).success).toBe(false);
  });

  it("accepts valid queries", () => {
    expect(
      nlqRequestSchema.safeParse({ query: "Show me all tankers" }).success,
    ).toBe(true);
  });
});
