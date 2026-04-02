import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
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

import { useMap } from "@/hooks/use-map";
import { Map as MapConstructor } from "maplibre-gl";

describe("useMap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    MockMapClass.mockImplementation(function () {
      return mockMapInstance;
    });
    // Clear listeners so _simulateLoad works fresh
    Object.keys(mockMapInstance._listeners).forEach((key) => {
      delete mockMapInstance._listeners[key];
    });
  });

  it("initializes map with correct options", () => {
    const containerRef = { current: document.createElement("div") };
    renderHook(() => useMap(containerRef));

    expect(MapConstructor).toHaveBeenCalledWith(
      expect.objectContaining({
        container: containerRef.current,
        style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
        center: [0.1079, 49.4944],
        zoom: 12,
        minZoom: 8,
        maxZoom: 18,
      }),
    );
  });

  it("sets isLoaded to true after load event", () => {
    const containerRef = { current: document.createElement("div") };
    const { result } = renderHook(() => useMap(containerRef));

    expect(result.current.isLoaded).toBe(false);

    act(() => {
      mockMapInstance._simulateLoad();
    });

    expect(result.current.isLoaded).toBe(true);
  });

  it("calls map.remove on unmount", () => {
    const containerRef = { current: document.createElement("div") };
    const { unmount } = renderHook(() => useMap(containerRef));

    unmount();

    expect(mockMapInstance.remove).toHaveBeenCalled();
  });

  it("does not initialize if container is null", () => {
    const containerRef = { current: null };
    renderHook(() => useMap(containerRef));

    expect(MapConstructor).not.toHaveBeenCalled();
  });
});
