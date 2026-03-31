import WebSocket from "ws";
import { parseAisMessage, isPositionReport, isStaticData } from "./parser.js";
import {
  upsertVesselFromPosition,
  upsertVesselFromStatic,
  insertPosition,
} from "./db-operations.js";

const AIS_WS_URL = "wss://stream.aisstream.io/v0/stream";
const INITIAL_RECONNECT_DELAY_MS = 1000;
const MAX_RECONNECT_DELAY_MS = 60000;

const BOUNDING_BOX = {
  min: { latitude: 49.4, longitude: -0.15 },
  max: { latitude: 49.55, longitude: 0.4 },
};

let currentWs: WebSocket | null = null;
let reconnectDelay = INITIAL_RECONNECT_DELAY_MS;
let shuttingDown = false;

export function connect(apiKey: string) {
  if (shuttingDown) return;

  console.log("[AIS] Connecting to AISstream...");
  const ws = new WebSocket(AIS_WS_URL);
  currentWs = ws;

  ws.on("open", () => {
    console.log("[AIS] Connected. Sending subscription...");
    reconnectDelay = INITIAL_RECONNECT_DELAY_MS;
    ws.send(
      JSON.stringify({
        APIKey: apiKey,
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
    currentWs = null;
    if (shuttingDown) return;

    console.log(
      `[AIS] Closed (${code}). Reconnecting in ${reconnectDelay}ms...`,
    );
    setTimeout(() => connect(apiKey), reconnectDelay);
    reconnectDelay = Math.min(reconnectDelay * 2, MAX_RECONNECT_DELAY_MS);
  });
}

export function disconnect() {
  shuttingDown = true;
  if (currentWs) {
    currentWs.close();
    currentWs = null;
  }
}
