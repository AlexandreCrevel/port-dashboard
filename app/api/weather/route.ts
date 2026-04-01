import { NextResponse } from "next/server";
import { getLatestWeather, getWeatherHistory } from "@/lib/queries";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hoursParam = searchParams.get("hours");
    const parsed = parseInt(hoursParam ?? "24", 10);
    const hours = Math.min(
      Math.max(Number.isNaN(parsed) ? 24 : parsed, 1),
      720,
    );

    const [latestResult, historyResult] = await Promise.all([
      getLatestWeather(),
      getWeatherHistory(hours),
    ]);

    return NextResponse.json({
      current: latestResult[0] ?? null,
      history: historyResult,
    });
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 },
    );
  }
}
