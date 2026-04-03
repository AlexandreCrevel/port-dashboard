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
    <Card className="bg-card/50">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-sm">Weather</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-2 space-y-2">
        {isLoading ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
            <Skeleton className="h-[120px] w-full" />
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
              <WeatherCard
                title="Wind"
                value={formatReading(current?.windSpeed ?? null)}
                unit="km/h"
                icon={<Wind className="h-3.5 w-3.5" />}
              />
              <WeatherCard
                title="Waves"
                value={formatReading(current?.waveHeight ?? null)}
                unit="m"
                icon={<Waves className="h-3.5 w-3.5" />}
              />
              <WeatherCard
                title="Visibility"
                value={formatReading(current?.visibility ?? null)}
                unit="km"
                icon={<Eye className="h-3.5 w-3.5" />}
              />
              <WeatherCard
                title="Temp"
                value={formatReading(current?.temperature ?? null)}
                unit="°C"
                icon={<Thermometer className="h-3.5 w-3.5" />}
              />
            </div>

            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart
                  data={chartData}
                  margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
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
                    tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                    interval="preserveStartEnd"
                    stroke="hsl(var(--border))"
                  />
                  <YAxis
                    tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                    stroke="hsl(var(--border))"
                  />
                  <Tooltip
                    labelFormatter={(label) =>
                      new Date(String(label)).toLocaleString()
                    }
                    formatter={(value) => [`${value ?? 0} °C`, "Temp"]}
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      fontSize: "11px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    stroke="hsl(var(--primary))"
                    strokeWidth={1.5}
                    fill="url(#tempGradient)"
                    dot={false}
                    activeDot={{ r: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[120px] items-center justify-center text-xs text-muted-foreground">
                No trend data
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
