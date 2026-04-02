import { NextResponse } from "next/server";
import { getTrafficTimeline } from "@/lib/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hours = parseInt(searchParams.get("hours") ?? "24", 10);

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
