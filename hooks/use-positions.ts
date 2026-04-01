"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { POLLING_FALLBACK_MS, SSE_RETRY_MS } from "@/lib/constants";
import type { VesselWithPosition } from "@/types";

export function usePositions() {
  const queryClient = useQueryClient();

  const query = useQuery<VesselWithPosition[]>({
    queryKey: ["positions"],
    queryFn: async () => {
      const res = await fetch("/api/positions");
      if (!res.ok) throw new Error("Failed to fetch positions");
      return res.json();
    },
    refetchInterval: POLLING_FALLBACK_MS,
  });

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout>;

    function connectSSE() {
      eventSource = new EventSource("/api/positions?stream=true");

      eventSource.onmessage = (event) => {
        const newPositions: VesselWithPosition[] = JSON.parse(event.data);
        queryClient.setQueryData<VesselWithPosition[]>(["positions"], (old) => {
          if (!old) return newPositions;
          const map = new Map(old.map((v) => [v.mmsi, v]));
          for (const pos of newPositions) {
            map.set(pos.mmsi, pos);
          }
          return Array.from(map.values());
        });
      };

      eventSource.onerror = () => {
        eventSource?.close();
        reconnectTimeout = setTimeout(connectSSE, SSE_RETRY_MS);
      };
    }

    connectSSE();

    return () => {
      eventSource?.close();
      clearTimeout(reconnectTimeout);
    };
  }, [queryClient]);

  return query;
}
