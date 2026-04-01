import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";

vi.mock("@/lib/queries", () => ({
  getLatestSummary: vi.fn(),
  getSummaryByDate: vi.fn(),
}));

import { getLatestSummary, getSummaryByDate } from "@/lib/queries";

const mockGetLatestSummary = vi.mocked(getLatestSummary);
const mockGetSummaryByDate = vi.mocked(getSummaryByDate);

describe("GET /api/summary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls getLatestSummary and returns first row when no date param", async () => {
    const summaryRow = {
      date: "2026-03-31",
      content: "All quiet in the port.",
    };
    mockGetLatestSummary.mockResolvedValueOnce([summaryRow] as never);

    const request = new Request("http://localhost/api/summary");
    const response = await GET(request);

    expect(mockGetLatestSummary).toHaveBeenCalledOnce();
    expect(mockGetSummaryByDate).not.toHaveBeenCalled();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(summaryRow);
  });

  it("calls getSummaryByDate with the date param when ?date is provided", async () => {
    const summaryRow = { date: "2026-03-30", content: "Heavy traffic." };
    mockGetSummaryByDate.mockResolvedValueOnce([summaryRow] as never);

    const request = new Request("http://localhost/api/summary?date=2026-03-30");
    const response = await GET(request);

    expect(mockGetSummaryByDate).toHaveBeenCalledWith("2026-03-30");
    expect(mockGetLatestSummary).not.toHaveBeenCalled();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(summaryRow);
  });

  it("returns null when query returns no rows", async () => {
    mockGetLatestSummary.mockResolvedValueOnce([] as never);

    const request = new Request("http://localhost/api/summary");
    const response = await GET(request);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toBeNull();
  });

  it("returns 500 on error", async () => {
    mockGetLatestSummary.mockRejectedValueOnce(
      new Error("DB connection failed"),
    );

    const request = new Request("http://localhost/api/summary");
    const response = await GET(request);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body).toEqual({ error: "Failed to fetch summary" });
  });
});
