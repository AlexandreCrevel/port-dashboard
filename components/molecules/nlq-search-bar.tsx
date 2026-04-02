"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
        <Input
          placeholder="Ask a question about port activity…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-[280px] lg:w-[360px] h-8 text-sm bg-background/50"
        />
        <Button
          type="submit"
          size="icon-sm"
          variant="secondary"
          aria-label="Search"
          disabled={!query.trim() || isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Search className="h-3.5 w-3.5" />
          )}
        </Button>
      </form>
      <div className="flex gap-1 flex-wrap justify-center">
        {SUGGESTED_QUERIES.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => setQuery(suggestion)}
            className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors cursor-pointer"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
