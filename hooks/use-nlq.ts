"use client";

import { useMutation } from "@tanstack/react-query";
import type { NlqResponse } from "@/types";

export function useNlq() {
  return useMutation<NlqResponse, Error, string>({
    mutationFn: async (query: string) => {
      const res = await fetch("/api/nlq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "NLQ request failed");
      }
      return res.json();
    },
  });
}
