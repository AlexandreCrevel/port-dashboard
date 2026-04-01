import { NextResponse } from "next/server";
import { getVesselsInZone } from "@/lib/queries";

export async function GET() {
  try {
    const result = await getVesselsInZone();
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch vessels:", error);
    return NextResponse.json(
      { error: "Failed to fetch vessels" },
      { status: 500 },
    );
  }
}
