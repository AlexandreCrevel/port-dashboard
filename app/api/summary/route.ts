import { NextResponse } from "next/server";
import { getLatestSummary, getSummaryByDate } from "@/lib/queries";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    const result = date
      ? await getSummaryByDate(date)
      : await getLatestSummary();

    return NextResponse.json(result[0] ?? null);
  } catch (error) {
    console.error("Failed to fetch summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch summary" },
      { status: 500 },
    );
  }
}
