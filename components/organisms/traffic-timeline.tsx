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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Traffic Timeline</CardTitle>
        <Tabs
          value={timeRange}
          onValueChange={(v) => setTimeRange(v as "24h" | "7d")}
        >
          <TabsList>
            <TabsTrigger value="24h">24h</TabsTrigger>
            <TabsTrigger value="7d">7d</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : !data || data.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No timeline data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={256}>
            <LineChart
              data={data}
              margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={tickFormatter}
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                labelFormatter={(label) =>
                  new Date(String(label)).toLocaleString()
                }
                formatter={(value) => [value ?? 0, "Vessels"]}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
