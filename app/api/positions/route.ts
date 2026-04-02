import { NextResponse } from "next/server";
import {
  getVesselsInZone,
  getPositionsSince,
  mapVesselRow,
} from "@/lib/queries";
import { SSE_POLL_INTERVAL_MS } from "@/lib/constants";

export const runtime = "nodejs";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const isStreaming = searchParams.get("stream") === "true";

  if (!isStreaming) {
    try {
      const result = await getVesselsInZone();
      return NextResponse.json(result.rows.map(mapVesselRow));
    } catch (error) {
      console.error("Failed to fetch positions:", error);
      return NextResponse.json(
        { error: "Failed to fetch positions" },
        { status: 500 },
      );
    }
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let lastTimestamp = new Date().toISOString();

      const interval = setInterval(async () => {
        try {
          const result = await getPositionsSince(lastTimestamp);
          if (result.rows.length > 0) {
            lastTimestamp = new Date().toISOString();
            const mapped = result.rows.map(mapVesselRow);
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(mapped)}\n\n`),
            );
          }
        } catch {
          clearInterval(interval);
        }
      }, SSE_POLL_INTERVAL_MS);

      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
