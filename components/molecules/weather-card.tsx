import type { ReactNode } from "react";

interface WeatherCardProps {
  title: string;
  value: string | null;
  unit: string;
  icon: ReactNode;
}

export const WeatherCard = ({ title, value, unit, icon }: WeatherCardProps) => {
  return (
    <div className="rounded-lg border border-border/50 bg-background/50 p-2.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        <span className="text-muted-foreground/50">{icon}</span>
      </div>
      <p className="text-lg font-semibold tabular-nums">
        {value !== null ? (
          <>
            {value}
            <span className="ml-0.5 text-xs font-normal text-muted-foreground">
              {unit}
            </span>
          </>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </p>
    </div>
  );
};
