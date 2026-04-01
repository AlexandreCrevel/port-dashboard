"use client";

import { useQuery } from "@tanstack/react-query";
import type { WeatherReading } from "@/types";

interface WeatherResponse {
  current: WeatherReading | null;
  history: WeatherReading[];
}

export function useWeather(hours: number = 24) {
  return useQuery<WeatherResponse>({
    queryKey: ["weather", hours],
    queryFn: async () => {
      const res = await fetch(`/api/weather?hours=${hours}`);
      if (!res.ok) throw new Error("Failed to fetch weather");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}
