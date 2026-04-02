"use client";

import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFilterStore } from "@/stores/use-filter-store";

const TrafficDataPointSchema = z.object({
  timestamp: z.string(),
  count: z.coerce.number(),
});
const TrafficTimelineSchema = z.array(TrafficDataPointSchema);

const TIME_RANGE_HOURS: Record<"24h" | "7d", number> = {
  "24h": 24,
  "7d": 168,
};

function formatHour(value: string): string {
  const date = new Date(value);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDayHour(value: string): string {
  const date = new Date(value);
  return date.toLocaleString([], { weekday: "short", hour: "2-digit" });
}

export const TrafficTimeline = () => {
  const timeRange = useFilterStore((s) => s.timeRange);
  const setTimeRange = useFilterStore((s) => s.setTimeRange);
  const hours = TIME_RANGE_HOURS[timeRange];

  const { data, isLoading } = useQuery({
    queryKey: ["traffic-timeline", hours],
    queryFn: async () => {
      const res = await fetch(`/api/vessels/timeline?hours=${hours}`);
      if (!res.ok) throw new Error("Failed to fetch timeline");
      return TrafficTimelineSchema.parse(await res.json());
    },
    refetchInterval: 60_000,
  });

  const tickFormatter = timeRange === "24h" ? formatHour : formatDayHour;

  return (
    <Card className="bg-card/50">
      <CardHeader className="flex flex-row items-center justify-between p-3 pb-0">
        <CardTitle className="text-sm">Traffic</CardTitle>
        <Tabs
          value={timeRange}
          onValueChange={(v) => setTimeRange(v as "24h" | "7d")}
        >
          <TabsList className="h-7">
            <TabsTrigger value="24h" className="text-xs px-2 h-5">
              24h
            </TabsTrigger>
            <TabsTrigger value="7d" className="text-xs px-2 h-5">
              7d
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        {isLoading ? (
          <Skeleton className="h-[160px] w-full" />
        ) : !data || data.length === 0 ? (
          <div className="flex h-[160px] items-center justify-center text-xs text-muted-foreground">
            No timeline data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <LineChart
              data={data}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                strokeOpacity={0.4}
              />
              <XAxis
                dataKey="timestamp"
                tickFormatter={tickFormatter}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                interval="preserveStartEnd"
                stroke="hsl(var(--border))"
              />
              <YAxis
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                allowDecimals={false}
                stroke="hsl(var(--border))"
              />
              <Tooltip
                labelFormatter={(label) =>
                  new Date(String(label)).toLocaleString()
                }
                formatter={(value) => [value ?? 0, "Vessels"]}
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
