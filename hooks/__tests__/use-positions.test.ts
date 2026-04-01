import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "@/test/utils/create-wrapper";
import { usePositions } from "../use-positions";

class MockEventSource {
  url: string;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: (() => void) | null = null;
  close = vi.fn();
  constructor(url: string) {
    this.url = url;
  }
}

describe("usePositions", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal("EventSource", MockEventSource);
  });

  it("fetches initial positions via HTTP", async () => {
    const mockData = [
      {
        mmsi: "123456789",
        name: "Test Vessel",
        latitude: 49.5,
        longitude: 0.1,
        speed: 5,
        heading: 90,
        course: 90,
        positionTimestamp: "2024-01-01T00:00:00.000Z",
      },
    ];
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify(mockData), { status: 200 }),
    );

    const { result } = renderHook(() => usePositions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith("/api/positions");
  });

  it("creates EventSource with SSE URL", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 }),
    );

    const instances: MockEventSource[] = [];
    vi.stubGlobal(
      "EventSource",
      class extends MockEventSource {
        constructor(url: string) {
          super(url);
          instances.push(this);
        }
      },
    );

    renderHook(() => usePositions(), { wrapper: createWrapper() });

    await waitFor(() => expect(instances.length).toBeGreaterThan(0));
    expect(instances[0].url).toBe("/api/positions?stream=true");
  });

  it("closes EventSource on unmount", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 }),
    );

    const closeMock = vi.fn();
    vi.stubGlobal(
      "EventSource",
      class extends MockEventSource {
        close = closeMock;
      },
    );

    const { unmount } = renderHook(() => usePositions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(closeMock).not.toHaveBeenCalled());
    unmount();
    expect(closeMock).toHaveBeenCalledOnce();
  });

  it("handles HTTP fetch error", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(null, { status: 500 }),
    );

    const { result } = renderHook(() => usePositions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
