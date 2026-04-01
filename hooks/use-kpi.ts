"use client";

import { useQuery } from "@tanstack/react-query";
import type { KpiMetrics } from "@/types";

export function useKpi() {
  return useQuery<KpiMetrics | null>({
    queryKey: ["kpi"],
    queryFn: async () => {
      const res = await fetch("/api/kpi");
      if (!res.ok) throw new Error("Failed to fetch KPI metrics");
      return res.json();
    },
  });
}
