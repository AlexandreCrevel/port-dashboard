import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

afterEach(cleanup);
import { VesselTypeChart } from "../vessel-type-chart";
import type { VesselWithPosition } from "@/types";

vi.mock("@/hooks/use-positions", () => ({
  usePositions: vi.fn(),
}));

import { usePositions } from "@/hooks/use-positions";
const mockUsePositions = vi.mocked(usePositions);

// Recharts uses ResizeObserver — stub it for jsdom
vi.mock("recharts", async (importOriginal) => {
  const original = await importOriginal<typeof import("recharts")>();
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
  };
});

function makeVessel(vesselType: string | null): VesselWithPosition {
  return {
    mmsi: "123456789",
    name: "Test Vessel",
    vesselType,
    flag: null,
    length: null,
    width: null,
    destination: null,
    firstSeen: new Date(),
    lastSeen: new Date(),
    longitude: 0,
    latitude: 0,
    speed: null,
    heading: null,
    course: null,
    positionTimestamp: new Date(),
  };
}

describe("VesselTypeChart", () => {
  it("shows skeleton when loading", () => {
    mockUsePositions.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof usePositions>);

    render(<VesselTypeChart />);

    const skeleton = document.querySelector("[data-slot='skeleton']");
    expect(skeleton).toBeInTheDocument();
  });

  it("renders chart with vessel data", () => {
    const vessels = [
      makeVessel("Cargo"),
      makeVessel("Cargo"),
      makeVessel("Tanker"),
    ];

    mockUsePositions.mockReturnValue({
      data: vessels,
      isLoading: false,
    } as ReturnType<typeof usePositions>);

    render(<VesselTypeChart />);

    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    expect(screen.getByText("Vessel Types")).toBeInTheDocument();
  });

  it("maps null vesselType to Other", () => {
    const vessels = [makeVessel(null), makeVessel(null), makeVessel("Cargo")];

    mockUsePositions.mockReturnValue({
      data: vessels,
      isLoading: false,
    } as ReturnType<typeof usePositions>);

    render(<VesselTypeChart />);

    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });

  it("shows empty state message when data is empty", () => {
    mockUsePositions.mockReturnValue({
      data: [],
      isLoading: false,
    } as ReturnType<typeof usePositions>);

    render(<VesselTypeChart />);

    expect(screen.getByText("No vessel data available")).toBeInTheDocument();
  });
});
