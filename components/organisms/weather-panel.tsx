"use client";

import { Wind, Waves, Eye, Thermometer } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WeatherCard } from "@/components/molecules/weather-card";
import { useWeather } from "@/hooks/use-weather";
import type { WeatherReading } from "@/types";

function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatReading(
  value: number | null,
  decimals: number = 1,
): string | null {
  if (value === null) return null;
  return value.toFixed(decimals);
}

interface ChartDataPoint {
  timestamp: string;
  temperature: number | null;
}

function toChartData(history: WeatherReading[]): ChartDataPoint[] {
  return history.map((r) => ({
    timestamp: new Date(r.timestamp).toISOString(),
    temperature: r.temperature,
  }));
}

export const WeatherPanel = () => {
  const { data, isLoading } = useWeather(24);

  const current = data?.current ?? null;
  const chartData = data?.history ? toChartData(data.history) : [];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Weather Conditions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            <Skeleton className="h-40 w-full" />
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <WeatherCard
                title="Wind Speed"
                value={formatReading(current?.windSpeed ?? null)}
                unit="km/h"
                icon={<Wind className="h-4 w-4" />}
              />
              <WeatherCard
                title="Wave Height"
                value={formatReading(current?.waveHeight ?? null)}
                unit="m"
                icon={<Waves className="h-4 w-4" />}
              />
              <WeatherCard
                title="Visibility"
                value={formatReading(current?.visibility ?? null)}
                unit="km"
                icon={<Eye className="h-4 w-4" />}
              />
              <WeatherCard
                title="Temperature"
                value={formatReading(current?.temperature ?? null)}
                unit="°C"
                icon={<Thermometer className="h-4 w-4" />}
              />
            </div>

            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart
                  data={chartData}
                  margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="tempGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={formatTime}
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    labelFormatter={(label: string) =>
                      new Date(label).toLocaleString()
                    }
                    formatter={(value: number) => [
                      `${value} °C`,
                      "Temperature",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#tempGradient)"
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                No trend data available
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
