import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Wind } from "lucide-react";
import { WeatherCard } from "../weather-card";

afterEach(cleanup);

describe("WeatherCard", () => {
  it("renders title, value and unit", () => {
    render(
      <WeatherCard
        title="Wind Speed"
        value="12.5"
        unit="km/h"
        icon={<Wind />}
      />,
    );
    expect(screen.getByText("Wind Speed")).toBeInTheDocument();
    expect(screen.getByText("12.5")).toBeInTheDocument();
    expect(screen.getByText("km/h")).toBeInTheDocument();
  });

  it("renders N/A when value is null", () => {
    render(
      <WeatherCard
        title="Temperature"
        value={null}
        unit="°C"
        icon={<Wind />}
      />,
    );
    expect(screen.getByText("N/A")).toBeInTheDocument();
    expect(screen.queryByText("°C")).not.toBeInTheDocument();
  });

  it("renders icon", () => {
    const { container } = render(
      <WeatherCard
        title="Visibility"
        value="10.0"
        unit="km"
        icon={<Wind data-testid="wind-icon" />}
      />,
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders zero value correctly (not N/A)", () => {
    render(
      <WeatherCard title="Wave Height" value="0.0" unit="m" icon={<Wind />} />,
    );
    expect(screen.getByText("0.0")).toBeInTheDocument();
    expect(screen.queryByText("N/A")).not.toBeInTheDocument();
  });
});
