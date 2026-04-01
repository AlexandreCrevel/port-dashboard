import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "@/test/utils/create-wrapper";
import { useVessels } from "../use-vessels";

describe("useVessels", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches vessels successfully", async () => {
    const mockData = [{ mmsi: "123456789", name: "Test Vessel" }];
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify(mockData), { status: 200 }),
    );

    const { result } = renderHook(() => useVessels(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it("handles fetch error", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(null, { status: 500 }),
    );

    const { result } = renderHook(() => useVessels(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
