"use client";

import { useQuery } from "@tanstack/react-query";
import type { VesselWithPosition } from "@/types";

export function useVessels() {
  return useQuery<VesselWithPosition[]>({
    queryKey: ["vessels"],
    queryFn: async () => {
      const res = await fetch("/api/vessels");
      if (!res.ok) throw new Error("Failed to fetch vessels");
      return res.json();
    },
  });
}
