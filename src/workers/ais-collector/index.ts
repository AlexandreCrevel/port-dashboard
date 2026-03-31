import { env } from "./env.js";
import { connect, disconnect } from "./connection.js";
import { closePool } from "./db-operations.js";

console.log("[AIS] Worker started.");
connect(env.AISSTREAM_API_KEY);

async function shutdown(signal: string) {
  console.log(`[AIS] Received ${signal}. Shutting down...`);
  disconnect();
  await closePool();
  console.log("[AIS] Shutdown complete.");
  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
