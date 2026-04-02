"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { KpiRow } from "@/components/organisms/kpi-row";
import { VesselTypeChart } from "@/components/organisms/vessel-type-chart";
import { TrafficTimeline } from "@/components/organisms/traffic-timeline";
import { WeatherPanel } from "@/components/organisms/weather-panel";
import { PORT_CONFIG } from "@/lib/constants/port-config";
import { NlqSearchBar } from "@/components/molecules/nlq-search-bar";
import { NlqResultsPanel } from "@/components/organisms/nlq-results-panel";
import { useNlq } from "@/hooks/use-nlq";

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
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const nlq = useNlq();

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b shrink-0">
        <h1 className="text-xl font-semibold tracking-tight">
          {PORT_CONFIG.name}
        </h1>
        <NlqSearchBar
          onSubmit={(query) => nlq.mutate(query)}
          isLoading={nlq.isPending}
        />
        <time
          dateTime={now?.toISOString() ?? ""}
          className="text-sm text-muted-foreground tabular-nums"
        >
          {now ? formatTime(now) : ""}
        </time>
      </header>

      {/* Main grid */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 min-h-0">
        {/* Map — 2/3 width, spans full height on lg */}
        <section
          aria-label="Map view"
          className="relative col-span-1 lg:col-span-2 lg:row-span-4 rounded-lg overflow-hidden border min-h-[300px]"
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

        {/* Bottom panel: NLQ results or Phase 8 placeholder */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          {nlq.data || nlq.isPending || nlq.error ? (
            <NlqResultsPanel
              data={nlq.data}
              isLoading={nlq.isPending}
              error={nlq.error}
            />
          ) : (
            <div className="rounded-lg border p-4 text-sm text-muted-foreground">
              Daily Summary — coming in Phase 8
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
