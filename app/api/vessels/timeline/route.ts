import { NextResponse } from "next/server";
import { getTrafficTimeline } from "@/lib/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = parseInt(searchParams.get("hours") ?? "24", 10);
  const hours =
    Number.isNaN(parsed) || parsed <= 0 ? 24 : Math.min(parsed, 168);

  try {
    const data = await getTrafficTimeline(hours);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch timeline:", error);
    return NextResponse.json(
      { error: "Failed to fetch timeline" },
      { status: 500 },
    );
  }
}
