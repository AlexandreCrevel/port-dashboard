"use client";

import { useEffect } from "react";
import { AlertCircle, ChevronDown, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useMapStore } from "@/stores/use-map-store";
import type { NlqResponse } from "@/types";

interface NlqResultsPanelProps {
  data: NlqResponse | undefined;
  isLoading: boolean;
  error: Error | null;
}

const extractMmsis = (results: Record<string, unknown>[]): string[] =>
  results.map((r) => r.mmsi).filter((v): v is string => typeof v === "string");

export const NlqResultsPanel = ({
  data,
  isLoading,
  error,
}: NlqResultsPanelProps) => {
  const setHighlightedMmsis = useMapStore((s) => s.setHighlightedMmsis);

  useEffect(() => {
    if (data?.results) {
      setHighlightedMmsis(extractMmsis(data.results));
    } else {
      setHighlightedMmsis([]);
    }
  }, [data, setHighlightedMmsis]);

  if (!data && !isLoading && !error) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Database className="h-4 w-4" />
          Query Results
          {data && (
            <span className="text-sm font-normal text-muted-foreground">
              — {data.results.length} results
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && <LoadingState />}
        {error && <ErrorState message={error.message} />}
        {data && <ResultsContent data={data} />}
      </CardContent>
    </Card>
  );
};

const LoadingState = () => (
  <div className="space-y-2">
    <p className="text-sm text-muted-foreground">Querying port data…</p>
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-20 w-full" />
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="flex items-start gap-2 text-sm text-destructive">
    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
    <p>{message}</p>
  </div>
);

const ResultsContent = ({ data }: { data: NlqResponse }) => {
  const columns = data.results.length > 0 ? Object.keys(data.results[0]) : [];

  return (
    <>
      <p className="text-sm">{data.explanation}</p>
      {columns.length > 0 && (
        <ResultsTable columns={columns} rows={data.results} />
      )}
      <SqlBlock sql={data.sql} />
    </>
  );
};

const ResultsTable = ({
  columns,
  rows,
}: {
  columns: string[];
  rows: Record<string, unknown>[];
}) => (
  <div className="overflow-x-auto rounded border">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b bg-muted/50">
          {columns.map((col) => (
            <th key={col} className="px-3 py-2 text-left font-medium">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b last:border-0">
            {columns.map((col) => (
              <td key={col} className="px-3 py-2">
                {String(row[col] ?? "")}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const SqlBlock = ({ sql }: { sql: string }) => (
  <Collapsible>
    <CollapsibleTrigger asChild>
      <Button
        variant="ghost"
        size="sm"
        className="gap-1 text-xs"
        aria-label="Show SQL"
      >
        <ChevronDown className="h-3 w-3" />
        SQL
      </Button>
    </CollapsibleTrigger>
    <CollapsibleContent>
      <pre className="mt-1 rounded bg-muted p-3 text-xs overflow-x-auto">
        <code>{sql}</code>
      </pre>
    </CollapsibleContent>
  </Collapsible>
);
