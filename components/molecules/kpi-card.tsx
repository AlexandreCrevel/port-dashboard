"use client";

import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface KpiCardProps {
  title: string;
  value: number | null;
  icon: ReactNode;
  isLoading: boolean;
}

export const KpiCard = ({ title, value, icon, isLoading }: KpiCardProps) => {
  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <span className="text-muted-foreground">{icon}</span>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <p className="text-3xl font-bold">
            {value !== null ? value.toLocaleString() : "—"}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
