import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, runtime } from "../route";

vi.mock("@/lib/queries", () => ({
  getVesselsInZone: vi.fn(),
  getPositionsSince: vi.fn(),
}));

import { getVesselsInZone, getPositionsSince } from "@/lib/queries";

const mockGetVesselsInZone = vi.mocked(getVesselsInZone);
const mockGetPositionsSince = vi.mocked(getPositionsSince);

describe("GET /api/positions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports runtime as nodejs", () => {
    expect(runtime).toBe("nodejs");
  });

  describe("non-streaming mode", () => {
    it("returns 200 with vessel rows on success", async () => {
      const mockRows = [
        {
          mmsi: "123456789",
          name: "TEST VESSEL",
          latitude: 48.5,
          longitude: -4.5,
        },
        {
          mmsi: "987654321",
          name: "OTHER SHIP",
          latitude: 48.6,
          longitude: -4.6,
        },
      ];
      mockGetVesselsInZone.mockResolvedValueOnce({ rows: mockRows } as never);

      const request = new Request("http://localhost/api/positions");
      const response = await GET(request);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toEqual(mockRows);
    });

    it("returns 200 with vessel rows when stream param is not 'true'", async () => {
      const mockRows = [{ mmsi: "111111111", name: "VESSEL A" }];
      mockGetVesselsInZone.mockResolvedValueOnce({ rows: mockRows } as never);

      const request = new Request(
        "http://localhost/api/positions?stream=false",
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toEqual(mockRows);
    });

    it("returns 500 with error message on failure", async () => {
      mockGetVesselsInZone.mockRejectedValueOnce(
        new Error("DB connection failed"),
      );

      const request = new Request("http://localhost/api/positions");
      const response = await GET(request);

      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body).toEqual({ error: "Failed to fetch positions" });
    });
  });

  describe("streaming mode", () => {
    it("returns response with SSE headers when stream=true", async () => {
      mockGetPositionsSince.mockResolvedValue({ rows: [] } as never);

      const request = new Request("http://localhost/api/positions?stream=true");
      const response = await GET(request);

      expect(response.headers.get("Content-Type")).toBe("text/event-stream");
      expect(response.headers.get("Cache-Control")).toBe("no-cache");
      expect(response.headers.get("Connection")).toBe("keep-alive");
    });

    it("returns a streaming Response (not NextResponse) for SSE", async () => {
      mockGetPositionsSince.mockResolvedValue({ rows: [] } as never);

      const request = new Request("http://localhost/api/positions?stream=true");
      const response = await GET(request);

      expect(response.body).not.toBeNull();
    });
  });
});
