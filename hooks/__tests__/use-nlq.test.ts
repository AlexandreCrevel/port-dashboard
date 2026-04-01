import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { createWrapper } from "@/test/utils/create-wrapper";
import { useNlq } from "../use-nlq";

describe("useNlq", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("executes NLQ mutation successfully", async () => {
    const mockData = {
      sql: "SELECT * FROM vessels",
      results: [],
      explanation: "All vessels",
    };
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify(mockData), { status: 200 }),
    );

    const { result } = renderHook(() => useNlq(), { wrapper: createWrapper() });

    act(() => {
      result.current.mutate("show all vessels");
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith("/api/nlq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "show all vessels" }),
    });
  });

  it("handles error response from server", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "Invalid query" }), { status: 400 }),
    );

    const { result } = renderHook(() => useNlq(), { wrapper: createWrapper() });

    act(() => {
      result.current.mutate("bad query");
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as Error).message).toBe("Invalid query");
  });

  it("handles error response without error field", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({}), { status: 500 }),
    );

    const { result } = renderHook(() => useNlq(), { wrapper: createWrapper() });

    act(() => {
      result.current.mutate("bad query");
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as Error).message).toBe("NLQ request failed");
  });
});
