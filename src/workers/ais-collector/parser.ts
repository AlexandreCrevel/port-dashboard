import { z } from "zod";

const metadataSchema = z.object({
  MMSI: z.number(),
  ShipName: z.string().optional(),
  time_utc: z.string(),
});

const positionReportSchema = z.object({
  Sog: z.number(),
  Cog: z.number(),
  TrueHeading: z.number(),
  Longitude: z.number(),
  Latitude: z.number(),
});

const dimensionSchema = z.object({
  A: z.number(),
  B: z.number(),
  C: z.number(),
  D: z.number(),
});

const shipStaticDataSchema = z.object({
  Name: z.string(),
  Type: z.number(),
  CallSign: z.string().optional(),
  ImoNumber: z.number().optional(),
  Destination: z.string().optional(),
  Dimension: dimensionSchema.optional(),
});

const aisMessageSchema = z.object({
  MessageType: z.string(),
  MetaData: metadataSchema,
  Message: z.record(z.unknown()),
});

export interface ParsedPosition {
  mmsi: string;
  shipName: string | null;
  longitude: number;
  latitude: number;
  speed: number;
  heading: number | null;
  course: number;
  timestamp: Date;
}

export interface ParsedStaticData {
  mmsi: string;
  name: string;
  vesselType: number;
  callSign: string | null;
  imoNumber: number | null;
  destination: string | null;
  length: number | null;
  width: number | null;
  timestamp: Date;
}

export function parseAisMessage(
  raw: string,
): ParsedPosition | ParsedStaticData | null {
  try {
    const data = JSON.parse(raw);
    const parsed = aisMessageSchema.parse(data);

    if (parsed.MessageType === "PositionReport") {
      const report = positionReportSchema.parse(parsed.Message.PositionReport);
      return {
        mmsi: String(parsed.MetaData.MMSI),
        shipName: parsed.MetaData.ShipName?.trim() || null,
        longitude: report.Longitude,
        latitude: report.Latitude,
        speed: report.Sog / 10,
        heading: report.TrueHeading === 511 ? null : report.TrueHeading,
        course: report.Cog / 10,
        timestamp: new Date(parsed.MetaData.time_utc),
      };
    }

    if (parsed.MessageType === "ShipStaticData") {
      const staticData = shipStaticDataSchema.parse(
        parsed.Message.ShipStaticData,
      );
      const dim = staticData.Dimension;
      return {
        mmsi: String(parsed.MetaData.MMSI),
        name: staticData.Name.trim(),
        vesselType: staticData.Type,
        callSign: staticData.CallSign?.trim() || null,
        imoNumber: staticData.ImoNumber || null,
        destination:
          staticData.Destination?.trim().replace(/@+/g, "").trim() || null,
        length: dim ? dim.A + dim.B : null,
        width: dim ? dim.C + dim.D : null,
        timestamp: new Date(parsed.MetaData.time_utc),
      };
    }

    return null;
  } catch {
    return null;
  }
}

export function isPositionReport(
  msg: ParsedPosition | ParsedStaticData,
): msg is ParsedPosition {
  return "longitude" in msg && "speed" in msg;
}

export function isStaticData(
  msg: ParsedPosition | ParsedStaticData,
): msg is ParsedStaticData {
  return "vesselType" in msg;
}
