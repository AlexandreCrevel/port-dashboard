import { describe, it, expect } from "vitest";
import { parseAisMessage, isPositionReport, isStaticData } from "./parser";

const POSITION_MSG = JSON.stringify({
  MessageType: "PositionReport",
  MetaData: {
    MMSI: 123456789,
    ShipName: "TEST VESSEL",
    time_utc: "2026-03-30T12:00:00Z",
  },
  Message: {
    PositionReport: {
      Sog: 125,
      Cog: 1800,
      TrueHeading: 180,
      Longitude: 0.11,
      Latitude: 49.49,
    },
  },
});

const STATIC_MSG = JSON.stringify({
  MessageType: "ShipStaticData",
  MetaData: { MMSI: 123456789, time_utc: "2026-03-30T12:00:00Z" },
  Message: {
    ShipStaticData: {
      Name: "TEST VESSEL",
      Type: 70,
      Destination: "ANTWERP@@@@",
      Dimension: { A: 100, B: 50, C: 15, D: 15 },
    },
  },
});

describe("parseAisMessage", () => {
  it("parses a PositionReport", () => {
    const result = parseAisMessage(POSITION_MSG);
    expect(result).not.toBeNull();
    expect(isPositionReport(result!)).toBe(true);
    if (isPositionReport(result!)) {
      expect(result.mmsi).toBe("123456789");
      expect(result.speed).toBe(12.5);
      expect(result.heading).toBe(180);
      expect(result.course).toBe(180);
    }
  });

  it("parses ShipStaticData", () => {
    const result = parseAisMessage(STATIC_MSG);
    expect(result).not.toBeNull();
    expect(isStaticData(result!)).toBe(true);
    if (isStaticData(result!)) {
      expect(result.name).toBe("TEST VESSEL");
      expect(result.destination).toBe("ANTWERP");
      expect(result.length).toBe(150);
      expect(result.width).toBe(30);
    }
  });

  it("handles heading 511 as null", () => {
    const msg = JSON.parse(POSITION_MSG);
    msg.Message.PositionReport.TrueHeading = 511;
    const result = parseAisMessage(JSON.stringify(msg));
    if (result && isPositionReport(result)) {
      expect(result.heading).toBeNull();
    }
  });

  it("returns null for malformed JSON", () => {
    expect(parseAisMessage("not json")).toBeNull();
  });

  it("returns null for unsupported message types", () => {
    const msg = JSON.stringify({
      MessageType: "BaseStationReport",
      MetaData: { MMSI: 1, time_utc: "" },
      Message: {},
    });
    expect(parseAisMessage(msg)).toBeNull();
  });
});
