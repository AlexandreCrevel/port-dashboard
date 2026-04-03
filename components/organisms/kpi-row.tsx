"use client";

import { Ship, ArrowDown, ArrowUp } from "lucide-react";
import { KpiCard } from "@/components/molecules/kpi-card";
import { useKpi } from "@/hooks/use-kpi";

export const KpiRow = () => {
  const { data, isLoading } = useKpi();

  return (
    <div className="grid grid-cols-3 gap-2">
      <KpiCard
        title="In Zone"
        value={data?.vesselsInZone ?? null}
        icon={<Ship className="h-4 w-4" />}
        isLoading={isLoading}
      />
      <KpiCard
        title="Arrivals"
        value={data?.arrivalsToday ?? null}
        icon={<ArrowDown className="h-4 w-4" />}
        isLoading={isLoading}
      />
      <KpiCard
        title="Departures"
        value={data?.departuresToday ?? null}
        icon={<ArrowUp className="h-4 w-4" />}
        isLoading={isLoading}
      />
    </div>
  );
};
