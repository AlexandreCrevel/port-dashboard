import { vi } from "vitest";

const createMockSource = () => ({
  setData: vi.fn(),
});

export const createMockMap = () => {
  const listeners: Record<string, Array<(...args: unknown[]) => void>> = {};
  const sources: Record<string, ReturnType<typeof createMockSource>> = {};

  const map = {
    on: vi.fn((event: string, layerOrCb: unknown, maybeCb?: unknown) => {
      const cb = (typeof maybeCb === "function" ? maybeCb : layerOrCb) as (
        ...args: unknown[]
      ) => void;
      const key =
        typeof maybeCb === "function" ? `${event}:${String(layerOrCb)}` : event;
      if (!listeners[key]) listeners[key] = [];
      listeners[key].push(cb);
      return map;
    }),
    off: vi.fn(),
    remove: vi.fn(),
    addSource: vi.fn((id: string, _config: unknown) => {
      sources[id] = createMockSource();
    }),
    addLayer: vi.fn(),
    getSource: vi.fn((id: string) => sources[id] ?? createMockSource()),
    getCanvas: vi.fn(() => ({ style: { cursor: "" } })),
    resize: vi.fn(),
    /** Simulate the map "load" event firing */
    _simulateLoad: () => {
      listeners["load"]?.forEach((cb) => cb());
    },
    _listeners: listeners,
  };

  return map;
};
