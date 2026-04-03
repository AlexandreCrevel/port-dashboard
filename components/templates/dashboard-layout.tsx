"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { KpiRow } from "@/components/organisms/kpi-row";
import { VesselTypeChart } from "@/components/organisms/vessel-type-chart";
import { TrafficTimeline } from "@/components/organisms/traffic-timeline";
import { WeatherPanel } from "@/components/organisms/weather-panel";
import { NlqSearchBar } from "@/components/molecules/nlq-search-bar";
import { NlqResultsPanel } from "@/components/organisms/nlq-results-panel";
import { useNlq } from "@/hooks/use-nlq";
import { PORT_CONFIG } from "@/lib/constants/port-config";
import { Anchor } from "lucide-react";

const MapContainer = dynamic(
  () =>
    import("@/components/organisms/map-container").then((m) => m.MapContainer),
  { ssr: false },
);

const formatTime = (date: Date): string =>
  date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: PORT_CONFIG.timezone,
  });

export const DashboardLayout = () => {
  const [now, setNow] = useState<Date | null>(null);
  const nlq = useNlq();

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <header className="flex items-center gap-4 px-4 py-2 border-b border-border/50 shrink-0 bg-card/50">
        <div className="flex items-center gap-2 shrink-0">
          <Anchor className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold tracking-tight">
            {PORT_CONFIG.name}
          </h1>
        </div>
        <div className="flex-1 flex justify-center">
          <NlqSearchBar
            onSubmit={(query) => nlq.mutate(query)}
            isLoading={nlq.isPending}
          />
        </div>
        <time
          dateTime={now?.toISOString() ?? ""}
          className="text-sm text-muted-foreground tabular-nums shrink-0"
        >
          {now ? formatTime(now) : ""}
        </time>
      </header>

      <div className="flex-1 flex min-h-0">
        {/* Map — main area */}
        <section aria-label="Map view" className="flex-1 relative min-w-0">
          <MapContainer />
        </section>

        {/* Sidebar */}
        <aside className="w-[340px] shrink-0 border-l border-border/50 flex flex-col min-h-0 overflow-y-auto bg-card/30">
          <div className="p-3 space-y-3">
            <KpiRow />
            <VesselTypeChart />
            <TrafficTimeline />
            <WeatherPanel />
          </div>
        </aside>
      </div>

      {/* Bottom panel — NLQ results */}
      {(nlq.data || nlq.isPending || nlq.error) && (
        <div className="shrink-0 border-t border-border/50 max-h-[300px] overflow-y-auto bg-card/30">
          <div className="p-3">
            <NlqResultsPanel
              data={nlq.data}
              isLoading={nlq.isPending}
              error={nlq.error}
            />
          </div>
        </div>
      )}
    </div>
  );
};
