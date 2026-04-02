import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeatherCardProps {
  title: string;
  value: string | null;
  unit: string;
  icon: ReactNode;
}

export const WeatherCard = ({ title, value, unit, icon }: WeatherCardProps) => {
  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <span className="text-muted-foreground">{icon}</span>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">
          {value !== null ? (
            <>
              {value}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                {unit}
              </span>
            </>
          ) : (
            "N/A"
          )}
        </p>
      </CardContent>
    </Card>
  );
};
