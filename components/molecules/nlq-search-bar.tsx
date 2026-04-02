"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SUGGESTED_QUERIES = [
  "Tankers this week",
  "Vessels faster than 15 knots",
  "Largest ships in port",
  "Cargo vessels heading to Antwerp",
] as const;

interface NlqSearchBarProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

export const NlqSearchBar = ({ onSubmit, isLoading }: NlqSearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          placeholder="Ask a question about port activity…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-[300px] lg:w-[400px]"
        />
        <Button
          type="submit"
          size="icon-sm"
          aria-label="Search"
          disabled={!query.trim() || isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </form>
      <div className="flex gap-1.5 flex-wrap justify-center">
        {SUGGESTED_QUERIES.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => setQuery(suggestion)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Badge variant="outline" className="font-normal text-xs">
              {suggestion}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
};
