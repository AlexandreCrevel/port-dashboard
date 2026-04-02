import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createMockMap } from "@/test/mocks/maplibre-gl";

const mockMapInstance = createMockMap();

const { MockMapClass } = vi.hoisted(() => {
  const MockMapClass = vi.fn().mockImplementation(function () {
    return {};
  });
  return { MockMapClass };
});

vi.mock("maplibre-gl", () => ({
  default: { Map: MockMapClass },
  Map: MockMapClass,
}));

vi.mock("@/lib/constants", () => ({
  PORT_CONFIG: {
    center: { latitude: 49.4944, longitude: 0.1079 },
    mapDefaults: { zoom: 12, minZoom: 8, maxZoom: 18 },
    boundingBox: {
      min: { latitude: 49.4, longitude: -0.15 },
      max: { latitude: 49.55, longitude: 0.4 },
    },
  },
}));

const mockStyle = { version: 8, sources: {}, layers: [] };

import { useMap } from "@/hooks/use-map";
import { Map as MapConstructor } from "maplibre-gl";

describe("useMap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    MockMapClass.mockImplementation(function () {
      return mockMapInstance;
    });
    Object.keys(mockMapInstance._listeners).forEach((key) => {
      delete mockMapInstance._listeners[key];
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ ...mockStyle }),
      }),
    );
  });

  it("fetches style and initializes map", async () => {
    const containerRef = { current: document.createElement("div") };
    renderHook(() => useMap(containerRef));

    await waitFor(() => {
      expect(MapConstructor).toHaveBeenCalledWith(
        expect.objectContaining({
          container: containerRef.current,
          center: [0.1079, 49.4944],
          zoom: 12,
        }),
      );
    });
  });

  it("adds projection to style if missing", async () => {
    const containerRef = { current: document.createElement("div") };
    renderHook(() => useMap(containerRef));

    await waitFor(() => {
      expect(MapConstructor).toHaveBeenCalled();
    });

    const styleArg = MockMapClass.mock.calls[0][0].style;
    expect(styleArg.projection).toEqual({ type: "mercator" });
  });

  it("sets isLoaded to true after load event", async () => {
    const containerRef = { current: document.createElement("div") };
    const { result } = renderHook(() => useMap(containerRef));

    await waitFor(() => {
      expect(MapConstructor).toHaveBeenCalled();
    });

    expect(result.current.isLoaded).toBe(false);

    await waitFor(() => {
      mockMapInstance._simulateLoad();
      expect(result.current.isLoaded).toBe(true);
    });
  });

  it("does not initialize if container is null", async () => {
    const containerRef = { current: null };
    renderHook(() => useMap(containerRef));

    await new Promise((r) => setTimeout(r, 50));
    expect(fetch).not.toHaveBeenCalled();
    expect(MapConstructor).not.toHaveBeenCalled();
  });
});
