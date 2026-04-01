import { NextResponse } from "next/server";
import { getKpiMetrics } from "@/lib/queries";

export async function GET() {
  try {
    const result = await getKpiMetrics();
    return NextResponse.json(result.rows[0] ?? null);
  } catch (error) {
    console.error("Failed to fetch KPI metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch KPI metrics" },
      { status: 500 },
    );
  }
}
