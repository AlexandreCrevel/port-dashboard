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
    <Card>
      <CardHeader>
        <CardTitle>Vessel Types</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : chartData.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No vessel data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={256}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={80}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.type} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value ?? 0, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
