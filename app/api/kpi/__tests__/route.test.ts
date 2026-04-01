import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";

vi.mock("@/lib/queries", () => ({
  getKpiMetrics: vi.fn(),
}));

import { getKpiMetrics } from "@/lib/queries";

const mockGetKpiMetrics = vi.mocked(getKpiMetrics);

describe("GET /api/kpi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with KPI data on success", async () => {
    const kpiRow = {
      vessels_in_zone: 5,
      arrivals_today: 2,
      departures_today: 1,
    };
    mockGetKpiMetrics.mockResolvedValueOnce({ rows: [kpiRow] } as never);

    const response = await GET();

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(kpiRow);
  });

  it("returns null when query returns no rows", async () => {
    mockGetKpiMetrics.mockResolvedValueOnce({ rows: [] } as never);

    const response = await GET();

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toBeNull();
  });

  it("returns 500 on error", async () => {
    mockGetKpiMetrics.mockRejectedValueOnce(new Error("DB connection failed"));

    const response = await GET();

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body).toEqual({ error: "Failed to fetch KPI metrics" });
  });
});
