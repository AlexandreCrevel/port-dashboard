"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePositions } from "@/hooks/use-positions";
import { VESSEL_TYPE_COLORS } from "@/lib/constants/vessel-types";
import type { VesselTypeDistribution } from "@/types";

function aggregateByVesselType(
  vessels: { vesselType: string | null }[],
): VesselTypeDistribution[] {
  const counts = new Map<string, number>();

  for (const vessel of vessels) {
    const raw = vessel.vesselType;
    const type = raw !== null && raw in VESSEL_TYPE_COLORS ? raw : "Other";
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([type, count]) => ({
      type,
      count,
      color: VESSEL_TYPE_COLORS[type] ?? VESSEL_TYPE_COLORS["Other"],
    }))
    .sort((a, b) => b.count - a.count);
}

export const VesselTypeChart = () => {
  const { data, isLoading } = usePositions();
  const chartData = data ? aggregateByVesselType(data) : [];

  return (
    <Card className="bg-card/50">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-sm">Vessel Types</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        {isLoading ? (
          <Skeleton className="h-[180px] w-full" />
        ) : chartData.length === 0 ? (
          <div className="flex h-[180px] items-center justify-center text-xs text-muted-foreground">
            No vessel data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={60}
                strokeWidth={1}
                stroke="hsl(var(--border))"
              >
                {chartData.map((entry) => (
                  <Cell key={entry.type} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [value ?? 0, name]}
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
