import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import type { TrafficDataPoint } from "@/types";

afterEach(cleanup);

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

vi.mock("@/stores/use-filter-store", () => ({
  useFilterStore: vi.fn(),
}));

vi.mock("recharts", async (importOriginal) => {
  const original = await importOriginal<typeof import("recharts")>();
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
  };
});

vi.mock("@/components/ui/tabs", () => ({
  Tabs: ({
    children,
    value,
    onValueChange,
  }: {
    children: React.ReactNode;
    value: string;
    onValueChange: (v: string) => void;
  }) => (
    <div
      data-testid="tabs"
      data-value={value}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        const tabValue = target.getAttribute("data-tab-value");
        if (tabValue) onValueChange(tabValue);
      }}
    >
      {children}
    </div>
  ),
  TabsList: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tabs-list">{children}</div>
  ),
  TabsTrigger: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => (
    <button data-testid={`tab-${value}`} data-tab-value={value}>
      {children}
    </button>
  ),
}));

import { useQuery } from "@tanstack/react-query";
import { useFilterStore } from "@/stores/use-filter-store";
import { TrafficTimeline } from "../traffic-timeline";

const mockUseQuery = vi.mocked(useQuery);
const mockUseFilterStore = vi.mocked(useFilterStore);

function mockStore(timeRange: "24h" | "7d" = "24h", setTimeRange = vi.fn()) {
  mockUseFilterStore.mockImplementation((selector) => {
    const state = {
      timeRange,
      setTimeRange,
      vesselTypes: [],
      toggleVesselType: vi.fn(),
      resetFilters: vi.fn(),
    };
    return selector(state);
  });
}

const mockData: TrafficDataPoint[] = [
  { timestamp: "2024-01-01T00:00:00Z", count: 5 },
  { timestamp: "2024-01-01T01:00:00Z", count: 8 },
  { timestamp: "2024-01-01T02:00:00Z", count: 3 },
];

describe("TrafficTimeline", () => {
  it("shows skeleton when loading", () => {
    mockStore();
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useQuery>);

    render(<TrafficTimeline />);

    const skeleton = document.querySelector("[data-slot='skeleton']");
    expect(skeleton).toBeInTheDocument();
  });

  it("renders chart with timeline data", () => {
    mockStore();
    mockUseQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<TrafficTimeline />);

    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    expect(screen.getByText("Traffic Timeline")).toBeInTheDocument();
  });

  it("shows empty state when data is empty", () => {
    mockStore();
    mockUseQuery.mockReturnValue({
      data: [],
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<TrafficTimeline />);

    expect(screen.getByText("No timeline data available")).toBeInTheDocument();
  });

  it("renders toggle tabs with correct active value", () => {
    mockStore("7d");
    mockUseQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<TrafficTimeline />);

    expect(screen.getByText("24h")).toBeInTheDocument();
    expect(screen.getByText("7d")).toBeInTheDocument();
  });

  it("calls setTimeRange when tab is clicked", () => {
    const setTimeRange = vi.fn();
    mockStore("24h", setTimeRange);
    mockUseQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<TrafficTimeline />);

    fireEvent.click(screen.getByTestId("tab-7d"));

    expect(setTimeRange).toHaveBeenCalledWith("7d");
  });

  it("uses 168 hours for 7d range query", () => {
    mockStore("7d");
    mockUseQuery.mockReturnValue({
      data: [],
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<TrafficTimeline />);

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["traffic-timeline", 168],
      }),
    );
  });

  it("uses 24 hours for 24h range query", () => {
    mockStore("24h");
    mockUseQuery.mockReturnValue({
      data: [],
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<TrafficTimeline />);

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["traffic-timeline", 24],
      }),
    );
  });
});
