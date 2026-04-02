"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { KpiRow } from "@/components/organisms/kpi-row";
import { VesselTypeChart } from "@/components/organisms/vessel-type-chart";
import { TrafficTimeline } from "@/components/organisms/traffic-timeline";
import { WeatherPanel } from "@/components/organisms/weather-panel";
import { PORT_CONFIG } from "@/lib/constants/port-config";

const MapContainer = dynamic(
  () =>
    import("@/components/organisms/map-container").then((m) => m.MapContainer),
  { ssr: false },
);

const formatTime = (date: Date): string =>
  date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: PORT_CONFIG.timezone,
  });

export const DashboardLayout = () => {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    setCurrentTime(formatTime(new Date()));
    const interval = setInterval(() => {
      setCurrentTime(formatTime(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b shrink-0">
        <h1 className="text-xl font-semibold tracking-tight">
          {PORT_CONFIG.name}
        </h1>
        {/* Phase 7: NLQ search bar goes here */}
        <time
          dateTime={new Date().toISOString()}
          className="text-sm text-muted-foreground tabular-nums"
        >
          {currentTime}
        </time>
      </header>

      {/* Main grid */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 min-h-0">
        {/* Map — 2/3 width, spans full height on lg */}
        <section
          aria-label="Map view"
          className="relative col-span-1 md:col-span-1 lg:col-span-2 lg:row-span-4 rounded-lg overflow-hidden border min-h-[300px]"
        >
          <MapContainer />
        </section>

        {/* Right sidebar — stacked panels */}
        <div className="col-span-1 flex flex-col gap-4 min-h-0 overflow-y-auto">
          <section aria-label="KPI metrics">
            <KpiRow />
          </section>

          <section
            aria-label="Vessel type distribution"
            className="flex-1 min-h-[200px]"
          >
            <VesselTypeChart />
          </section>

          <section
            aria-label="Traffic timeline"
            className="flex-1 min-h-[200px]"
          >
            <TrafficTimeline />
          </section>

          <section aria-label="Weather" className="flex-1 min-h-[200px]">
            <WeatherPanel />
          </section>
        </div>

        {/* Daily Summary — full width, Phase 8 placeholder */}
        {/* TODO Phase 8: replace with <DailySummaryPanel /> */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 rounded-lg border p-4 text-sm text-muted-foreground">
          Daily Summary — coming in Phase 8
        </div>
      </main>
    </div>
  );
};
