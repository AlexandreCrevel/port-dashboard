import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";

vi.mock("@/lib/queries", () => ({
  getVesselsInZone: vi.fn(),
  mapVesselRow: vi.fn((row: Record<string, unknown>) => row),
}));

import { getVesselsInZone } from "@/lib/queries";

const mockGetVesselsInZone = vi.mocked(getVesselsInZone);

describe("GET /api/vessels", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with vessel rows on success", async () => {
    const mockRows = [
      { mmsi: "123456789", name: "TEST VESSEL", vessel_type: "cargo" },
      { mmsi: "987654321", name: "OTHER SHIP", vessel_type: "tanker" },
    ];
    mockGetVesselsInZone.mockResolvedValueOnce({ rows: mockRows } as never);

    const response = await GET();

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(mockRows);
  });

  it("returns 500 with error message on failure", async () => {
    mockGetVesselsInZone.mockRejectedValueOnce(
      new Error("DB connection failed"),
    );

    const response = await GET();

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body).toEqual({ error: "Failed to fetch vessels" });
  });
});
