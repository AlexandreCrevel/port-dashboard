"use client";

import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface KpiCardProps {
  title: string;
  value: number | null;
  icon: ReactNode;
  isLoading: boolean;
}

export const KpiCard = ({ title, value, icon, isLoading }: KpiCardProps) => {
  return (
    <Card className="flex-1 bg-card/50">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-muted-foreground">
            {title}
          </span>
          <span className="text-muted-foreground/60">{icon}</span>
        </div>
        {isLoading ? (
          <Skeleton className="h-6 w-16" />
        ) : (
          <p className="text-2xl font-bold tabular-nums">
            {value !== null ? value.toLocaleString() : "—"}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
