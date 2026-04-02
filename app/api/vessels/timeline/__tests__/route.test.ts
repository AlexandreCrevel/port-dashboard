import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";

vi.mock("@/lib/queries", () => ({
  getTrafficTimeline: vi.fn(),
}));

import { getTrafficTimeline } from "@/lib/queries";

const mockGetTrafficTimeline = vi.mocked(getTrafficTimeline);

function makeRequest(search = "") {
  return new Request(`http://localhost/api/vessels/timeline${search}`);
}

describe("GET /api/vessels/timeline", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with timeline data on success", async () => {
    const mockData = [
      { hour: "2024-01-01T00:00:00Z", vessel_count: 5 },
      { hour: "2024-01-01T01:00:00Z", vessel_count: 8 },
    ];
    mockGetTrafficTimeline.mockResolvedValueOnce(mockData as never);

    const response = await GET(makeRequest());

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(mockData);
  });

  it("defaults to 24 hours when no hours param provided", async () => {
    mockGetTrafficTimeline.mockResolvedValueOnce([] as never);

    await GET(makeRequest());

    expect(mockGetTrafficTimeline).toHaveBeenCalledWith(24);
  });

  it("uses provided hours param", async () => {
    mockGetTrafficTimeline.mockResolvedValueOnce([] as never);

    await GET(makeRequest("?hours=168"));

    expect(mockGetTrafficTimeline).toHaveBeenCalledWith(168);
  });

  it("returns 500 with error message on failure", async () => {
    mockGetTrafficTimeline.mockRejectedValueOnce(
      new Error("DB connection failed"),
    );

    const response = await GET(makeRequest());

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body).toEqual({ error: "Failed to fetch timeline" });
  });
});
