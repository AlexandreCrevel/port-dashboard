import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "@/test/utils/create-wrapper";
import { useSummary } from "../use-summary";

describe("useSummary", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches summary without date param", async () => {
    const mockData = {
      id: 1,
      date: "2024-01-01",
      summary: "Quiet day",
      notableEvents: null,
      generatedAt: "2024-01-01T00:00:00.000Z",
    };
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify(mockData), { status: 200 }),
    );

    const { result } = renderHook(() => useSummary(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith("/api/summary");
  });

  it("fetches summary with specific date", async () => {
    const mockData = {
      id: 2,
      date: "2024-01-02",
      summary: "Busy day",
      notableEvents: null,
      generatedAt: "2024-01-02T00:00:00.000Z",
    };
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify(mockData), { status: 200 }),
    );

    const { result } = renderHook(() => useSummary("2024-01-02"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(global.fetch).toHaveBeenCalledWith("/api/summary?date=2024-01-02");
  });

  it("handles fetch error", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(null, { status: 500 }),
    );

    const { result } = renderHook(() => useSummary(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
