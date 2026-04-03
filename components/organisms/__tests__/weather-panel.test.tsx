import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import type { WeatherReading } from "@/types";

afterEach(cleanup);

vi.mock("@/hooks/use-weather", () => ({
  useWeather: vi.fn(),
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

import { useWeather } from "@/hooks/use-weather";
import { WeatherPanel } from "../weather-panel";

const mockUseWeather = vi.mocked(useWeather);

const mockCurrent: WeatherReading = {
  id: 1,
  timestamp: new Date("2024-01-01T12:00:00Z"),
  windSpeed: 25.3,
  windDirection: 180,
  waveHeight: 1.5,
  visibility: 8.2,
  temperature: 18.7,
};

const mockHistory: WeatherReading[] = [
  {
    id: 1,
    timestamp: new Date("2024-01-01T00:00:00Z"),
    windSpeed: 20,
    windDirection: 160,
    waveHeight: 1.2,
    visibility: 9,
    temperature: 16,
  },
  {
    id: 2,
    timestamp: new Date("2024-01-01T06:00:00Z"),
    windSpeed: 22,
    windDirection: 170,
    waveHeight: 1.4,
    visibility: 8.5,
    temperature: 17.5,
  },
];

describe("WeatherPanel", () => {
  it("shows skeletons when loading", () => {
    mockUseWeather.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as unknown as ReturnType<typeof useWeather>);

    const { container } = render(<WeatherPanel />);

    const skeletons = container.querySelectorAll("[data-slot='skeleton']");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders 4 weather cards with current data", () => {
    mockUseWeather.mockReturnValue({
      data: { current: mockCurrent, history: mockHistory },
      isLoading: false,
    } as unknown as ReturnType<typeof useWeather>);

    render(<WeatherPanel />);

    expect(screen.getByText("Wind")).toBeInTheDocument();
    expect(screen.getByText("Waves")).toBeInTheDocument();
    expect(screen.getByText("Visibility")).toBeInTheDocument();
    expect(screen.getByText("Temp")).toBeInTheDocument();
  });

  it("renders current values with correct formatting", () => {
    mockUseWeather.mockReturnValue({
      data: { current: mockCurrent, history: [] },
      isLoading: false,
    } as unknown as ReturnType<typeof useWeather>);

    render(<WeatherPanel />);

    expect(screen.getByText("25.3")).toBeInTheDocument();
    expect(screen.getByText("1.5")).toBeInTheDocument();
    expect(screen.getByText("8.2")).toBeInTheDocument();
    expect(screen.getByText("18.7")).toBeInTheDocument();
  });

  it("shows N/A for null metric values", () => {
    mockUseWeather.mockReturnValue({
      data: {
        current: {
          ...mockCurrent,
          windSpeed: null,
          temperature: null,
        },
        history: [],
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useWeather>);

    render(<WeatherPanel />);

    const naElements = screen.getAllByText("—");
    expect(naElements).toHaveLength(2);
  });

  it("renders chart when history data is available", () => {
    mockUseWeather.mockReturnValue({
      data: { current: mockCurrent, history: mockHistory },
      isLoading: false,
    } as unknown as ReturnType<typeof useWeather>);

    render(<WeatherPanel />);

    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });

  it("shows empty state when history is empty", () => {
    mockUseWeather.mockReturnValue({
      data: { current: mockCurrent, history: [] },
      isLoading: false,
    } as unknown as ReturnType<typeof useWeather>);

    render(<WeatherPanel />);

    expect(screen.getByText("No trend data")).toBeInTheDocument();
  });

  it("shows N/A cards when current is null", () => {
    mockUseWeather.mockReturnValue({
      data: { current: null, history: [] },
      isLoading: false,
    } as unknown as ReturnType<typeof useWeather>);

    render(<WeatherPanel />);

    const naElements = screen.getAllByText("—");
    expect(naElements).toHaveLength(4);
  });

  it("calls useWeather with 24 hours", () => {
    mockUseWeather.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as unknown as ReturnType<typeof useWeather>);

    render(<WeatherPanel />);

    expect(mockUseWeather).toHaveBeenCalledWith(24);
  });

  it("renders panel title", () => {
    mockUseWeather.mockReturnValue({
      data: undefined,
      isLoading: false,
    } as unknown as ReturnType<typeof useWeather>);

    render(<WeatherPanel />);

    expect(screen.getByText("Weather")).toBeInTheDocument();
  });
});
