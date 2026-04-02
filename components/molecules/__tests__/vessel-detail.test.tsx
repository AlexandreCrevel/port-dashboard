import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { VesselDetail } from "../vessel-detail";
import type { VesselWithPosition } from "@/types";

const mockSelectVessel = vi.fn();

vi.mock("@/stores/use-map-store", () => ({
  useMapStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      selectedVesselMmsi: mockMmsi,
      selectVessel: mockSelectVessel,
    }),
}));

vi.mock("@/hooks/use-positions", () => ({
  usePositions: () => ({ data: mockVessels }),
}));

vi.mock("@/lib/vessel-category", () => ({
  getVesselColor: () => "#ff0000",
}));

vi.mock("@/lib/format-vessel", () => ({
  formatDimensions: () => "120m x 20m",
  formatSpeed: () => "12.5 kn",
  formatHeading: () => "180deg",
  formatTimestamp: () => "01/01/2026 12:00:00",
}));

let mockMmsi: string | null = null;
let mockVessels: VesselWithPosition[] = [];

const baseVessel: VesselWithPosition = {
  mmsi: "123456789",
  name: "Test Vessel",
  vesselType: "Cargo",
  flag: "FR",
  length: 120,
  width: 20,
  destination: "Marseille",
  firstSeen: new Date("2026-01-01"),
  lastSeen: new Date("2026-01-02"),
  longitude: 5.3,
  latitude: 43.3,
  speed: 12.5,
  heading: 180,
  course: 175,
  positionTimestamp: new Date("2026-01-02"),
};

beforeEach(() => {
  mockMmsi = null;
  mockVessels = [];
  mockSelectVessel.mockReset();
});

describe("VesselDetail", () => {
  it("does not render content when no vessel is selected", () => {
    render(<VesselDetail />);
    expect(screen.queryByText("MMSI: null")).not.toBeInTheDocument();
  });

  it("renders vessel name and MMSI when selected", () => {
    mockMmsi = "123456789";
    mockVessels = [baseVessel];
    render(<VesselDetail />);
    expect(screen.getAllByText("Test Vessel").length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText("MMSI: 123456789").length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("renders type badge with vessel type", () => {
    mockMmsi = "123456789";
    mockVessels = [baseVessel];
    render(<VesselDetail />);
    expect(screen.getAllByText("Cargo").length).toBeGreaterThanOrEqual(1);
  });

  it("renders Unknown Vessel when name is null", () => {
    mockMmsi = "123456789";
    mockVessels = [{ ...baseVessel, name: null }];
    render(<VesselDetail />);
    expect(screen.getAllByText("Unknown Vessel").length).toBeGreaterThanOrEqual(
      1,
    );
  });

  it("renders formatted dimensions, speed, and heading", () => {
    mockMmsi = "123456789";
    mockVessels = [baseVessel];
    render(<VesselDetail />);
    expect(screen.getAllByText("120m x 20m").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("12.5 kn").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("180deg").length).toBeGreaterThanOrEqual(2);
  });

  it("calls selectVessel(null) when sheet closes", () => {
    mockMmsi = "123456789";
    mockVessels = [baseVessel];
    render(<VesselDetail />);
    const closeButtons = screen.getAllByRole("button", { name: /close/i });
    closeButtons[closeButtons.length - 1].click();
    expect(mockSelectVessel).toHaveBeenCalledWith(null);
  });
});
