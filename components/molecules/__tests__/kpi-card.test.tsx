import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Ship } from "lucide-react";
import { KpiCard } from "../kpi-card";

describe("KpiCard", () => {
  it("renders title and value when not loading", () => {
    render(
      <KpiCard
        title="Vessels in Zone"
        value={42}
        icon={<Ship />}
        isLoading={false}
      />,
    );
    expect(screen.getByText("Vessels in Zone")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders skeleton when loading", () => {
    const { container } = render(
      <KpiCard
        title="Arrivals Today"
        value={null}
        icon={<Ship />}
        isLoading={true}
      />,
    );
    expect(screen.getByText("Arrivals Today")).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='skeleton']"),
    ).toBeInTheDocument();
    expect(container.querySelector("p.text-3xl")).not.toBeInTheDocument();
  });

  it("renders em dash when value is null and not loading", () => {
    render(
      <KpiCard
        title="Departures Today"
        value={null}
        icon={<Ship />}
        isLoading={false}
      />,
    );
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("formats large numbers with toLocaleString", () => {
    render(
      <KpiCard
        title="Vessels in Zone"
        value={1000}
        icon={<Ship />}
        isLoading={false}
      />,
    );
    // toLocaleString may format as "1,000" or "1 000" depending on locale
    const valueEl = screen.getByText(/1.000/);
    expect(valueEl).toBeInTheDocument();
  });

  it("renders zero value correctly", () => {
    render(
      <KpiCard
        title="Departures Today"
        value={0}
        icon={<Ship />}
        isLoading={false}
      />,
    );
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
