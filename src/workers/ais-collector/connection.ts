import WebSocket from "ws";
import { parseAisMessage, isPositionReport, isStaticData } from "./parser.js";
import {
  upsertVesselFromPosition,
  upsertVesselFromStatic,
  insertPosition,
} from "./db-operations.js";

const AIS_WS_URL = "wss://stream.aisstream.io/v0/stream";
const RECONNECT_DELAY_MS = 5000;

const BOUNDING_BOX = {
  min: { latitude: 49.4, longitude: -0.15 },
  max: { latitude: 49.55, longitude: 0.4 },
};

export function connect() {
  console.log("[AIS] Connecting to AISstream...");
  const ws = new WebSocket(AIS_WS_URL);

  ws.on("open", () => {
    console.log("[AIS] Connected. Sending subscription...");
    ws.send(
      JSON.stringify({
        APIKey: process.env.AISSTREAM_API_KEY,
        BoundingBoxes: [
          [
            [BOUNDING_BOX.min.latitude, BOUNDING_BOX.min.longitude],
            [BOUNDING_BOX.max.latitude, BOUNDING_BOX.max.longitude],
          ],
        ],
        FilterMessageTypes: ["PositionReport", "ShipStaticData"],
      }),
    );
  });

  ws.on("message", async (data: Buffer) => {
    const parsed = parseAisMessage(data.toString());
    if (!parsed) return;

    try {
      if (isPositionReport(parsed)) {
        await upsertVesselFromPosition(
          parsed.mmsi,
          parsed.shipName,
          parsed.timestamp,
        );
        await insertPosition(parsed);
      } else if (isStaticData(parsed)) {
        await upsertVesselFromStatic(parsed);
      }
    } catch (err) {
      console.error("[AIS] DB write error:", err);
    }
  });

  ws.on("error", (err) => console.error("[AIS] WebSocket error:", err.message));
  ws.on("close", (code) => {
    console.log(
      `[AIS] Closed (${code}). Reconnecting in ${RECONNECT_DELAY_MS}ms...`,
    );
    setTimeout(connect, RECONNECT_DELAY_MS);
  });
}
