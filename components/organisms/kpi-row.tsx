"use client";

import { Ship, ArrowDown, ArrowUp } from "lucide-react";
import { KpiCard } from "@/components/molecules/kpi-card";
import { useKpi } from "@/hooks/use-kpi";

export const KpiRow = () => {
  const { data, isLoading } = useKpi();

  return (
    <div className="flex gap-4">
      <KpiCard
        title="Vessels in Zone"
        value={data?.vesselsInZone ?? null}
        icon={<Ship className="h-5 w-5" />}
        isLoading={isLoading}
      />
      <KpiCard
        title="Arrivals Today"
        value={data?.arrivalsToday ?? null}
        icon={<ArrowDown className="h-5 w-5" />}
        isLoading={isLoading}
      />
      <KpiCard
        title="Departures Today"
        value={data?.departuresToday ?? null}
        icon={<ArrowUp className="h-5 w-5" />}
        isLoading={isLoading}
      />
    </div>
  );
};
