import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

afterEach(cleanup);
import { createWrapper } from "@/test/utils/create-wrapper";
import { DashboardLayout } from "../dashboard-layout";

// Mock heavy child components to isolate NLQ integration
vi.mock("next/dynamic", () => ({
  default: () => {
    const MockMap = () => <div data-testid="mock-map">Map</div>;
    MockMap.displayName = "MockMap";
    return MockMap;
  },
}));

vi.mock("@/components/organisms/kpi-row", () => ({
  KpiRow: () => <div data-testid="kpi-row">KPI</div>,
}));

vi.mock("@/components/organisms/vessel-type-chart", () => ({
  VesselTypeChart: () => <div>Chart</div>,
}));

vi.mock("@/components/organisms/traffic-timeline", () => ({
  TrafficTimeline: () => <div>Timeline</div>,
}));

vi.mock("@/components/organisms/weather-panel", () => ({
  WeatherPanel: () => <div>Weather</div>,
}));

vi.mock("@/stores/use-map-store", () => ({
  useMapStore: (selector: (state: Record<string, unknown>) => unknown) =>
    selector({ setHighlightedMmsis: vi.fn() }),
}));

describe("DashboardLayout NLQ integration", () => {
  it("renders NLQ search bar in the header", () => {
    render(<DashboardLayout />, { wrapper: createWrapper() });
    expect(
      screen.getByPlaceholderText("Ask a question about port activity…"),
    ).toBeInTheDocument();
  });

  it("renders suggested query chips", () => {
    render(<DashboardLayout />, { wrapper: createWrapper() });
    expect(
      screen.getByRole("button", { name: "Tankers this week" }),
    ).toBeInTheDocument();
  });

  it("shows results panel after submitting a query", async () => {
    const mockResponse = {
      sql: "SELECT * FROM vessels",
      results: [{ name: "Test", mmsi: "111" }],
      explanation: "Test explanation",
    };
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify(mockResponse), { status: 200 }),
    );

    render(<DashboardLayout />, { wrapper: createWrapper() });
    const input = screen.getByPlaceholderText(
      "Ask a question about port activity…",
    );
    await userEvent.type(input, "show vessels{Enter}");

    expect(await screen.findByText("Test explanation")).toBeInTheDocument();
  });
});
