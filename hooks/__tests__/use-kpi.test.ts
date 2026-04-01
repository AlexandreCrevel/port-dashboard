import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "@/test/utils/create-wrapper";
import { useKpi } from "../use-kpi";

describe("useKpi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches KPI metrics successfully", async () => {
    const mockData = { vesselsInZone: 5, arrivalsToday: 3, departuresToday: 2 };
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify(mockData), { status: 200 }),
    );

    const { result } = renderHook(() => useKpi(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it("handles fetch error", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(null, { status: 500 }),
    );

    const { result } = renderHook(() => useKpi(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
