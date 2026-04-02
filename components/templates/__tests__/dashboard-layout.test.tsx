import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
afterEach(cleanup);

vi.mock("@/hooks/use-nlq", () => ({
  useNlq: () => ({
    mutate: vi.fn(),
    isPending: false,
    data: undefined,
    error: null,
  }),
}));

vi.mock("@/components/molecules/nlq-search-bar", () => ({
  NlqSearchBar: () => <div data-testid="nlq-search-bar">NLQ</div>,
}));

vi.mock("@/components/organisms/nlq-results-panel", () => ({
  NlqResultsPanel: () => <div data-testid="nlq-results-panel">Results</div>,
}));

vi.mock("next/dynamic", () => ({
  default: (_loader: unknown, _opts: unknown) => {
    const MockMapContainer = () => <div data-testid="map-container">Map</div>;
    MockMapContainer.displayName = "MockMapContainer";
    return MockMapContainer;
  },
}));

vi.mock("@/components/organisms/kpi-row", () => ({
  KpiRow: () => <div data-testid="kpi-row">KpiRow</div>,
}));

vi.mock("@/components/organisms/vessel-type-chart", () => ({
  VesselTypeChart: () => (
    <div data-testid="vessel-type-chart">VesselTypeChart</div>
  ),
}));

vi.mock("@/components/organisms/traffic-timeline", () => ({
  TrafficTimeline: () => (
    <div data-testid="traffic-timeline">TrafficTimeline</div>
  ),
}));

vi.mock("@/components/organisms/weather-panel", () => ({
  WeatherPanel: () => <div data-testid="weather-panel">WeatherPanel</div>,
}));

import { DashboardLayout } from "../dashboard-layout";

describe("DashboardLayout", () => {
  it("renders the port name in the header", () => {
    render(<DashboardLayout />);
    expect(screen.getByText("Le Havre")).toBeInTheDocument();
  });

  it("renders the map container", () => {
    render(<DashboardLayout />);
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
  });

  it("renders the KPI row", () => {
    render(<DashboardLayout />);
    expect(screen.getByTestId("kpi-row")).toBeInTheDocument();
  });

  it("renders the vessel type chart", () => {
    render(<DashboardLayout />);
    expect(screen.getByTestId("vessel-type-chart")).toBeInTheDocument();
  });

  it("renders the traffic timeline", () => {
    render(<DashboardLayout />);
    expect(screen.getByTestId("traffic-timeline")).toBeInTheDocument();
  });

  it("renders the weather panel", () => {
    render(<DashboardLayout />);
    expect(screen.getByTestId("weather-panel")).toBeInTheDocument();
  });

  it("renders the daily summary placeholder", () => {
    render(<DashboardLayout />);
    expect(screen.getByText(/daily summary/i)).toBeInTheDocument();
  });

  it("renders a header element", () => {
    render(<DashboardLayout />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders a main element", () => {
    render(<DashboardLayout />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders map section with correct aria-label", () => {
    render(<DashboardLayout />);
    expect(
      screen.getByRole("region", { name: /map view/i }),
    ).toBeInTheDocument();
  });
});
