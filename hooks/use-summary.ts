"use client";

import { useQuery } from "@tanstack/react-query";
import type { DailySummary } from "@/types";

export function useSummary(date?: string) {
  return useQuery<DailySummary | null>({
    queryKey: ["summary", date],
    queryFn: async () => {
      const url = date ? `/api/summary?date=${date}` : "/api/summary";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch summary");
      return res.json();
    },
  });
}
