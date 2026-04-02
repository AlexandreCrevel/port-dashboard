import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { KpiRow } from "../kpi-row";
import type { KpiMetrics } from "@/types";

vi.mock("@/hooks/use-kpi", () => ({
  useKpi: vi.fn(),
}));

import { useKpi } from "@/hooks/use-kpi";
const mockUseKpi = vi.mocked(useKpi);

describe("KpiRow", () => {
  it("renders three KPI cards with titles", () => {
    mockUseKpi.mockReturnValue({
      data: { vesselsInZone: 12, arrivalsToday: 5, departuresToday: 3 },
      isLoading: false,
    } as ReturnType<typeof useKpi>);

    render(<KpiRow />);

    expect(screen.getByText("Vessels in Zone")).toBeInTheDocument();
    expect(screen.getByText("Arrivals Today")).toBeInTheDocument();
    expect(screen.getByText("Departures Today")).toBeInTheDocument();
  });

  it("displays values from useKpi data", () => {
    const mockData: KpiMetrics = {
      vesselsInZone: 12,
      arrivalsToday: 5,
      departuresToday: 3,
    };
    mockUseKpi.mockReturnValue({
      data: mockData,
      isLoading: false,
    } as ReturnType<typeof useKpi>);

    render(<KpiRow />);

    expect(screen.getAllByText("12").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("5").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("3").length).toBeGreaterThanOrEqual(1);
  });

  it("shows skeletons when loading", () => {
    mockUseKpi.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useKpi>);

    render(<KpiRow />);

    const skeletons = document.querySelectorAll("[data-slot='skeleton']");
    expect(skeletons).toHaveLength(3);
  });

  it("shows em dashes when data is null and not loading", () => {
    mockUseKpi.mockReturnValue({
      data: null,
      isLoading: false,
    } as ReturnType<typeof useKpi>);

    render(<KpiRow />);

    const dashes = screen.getAllByText("—");
    expect(dashes).toHaveLength(3);
  });
});
