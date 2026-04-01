import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";

vi.mock("@/lib/queries", () => ({
  getLatestWeather: vi.fn(),
  getWeatherHistory: vi.fn(),
}));

import { getLatestWeather, getWeatherHistory } from "@/lib/queries";

const mockGetLatestWeather = vi.mocked(getLatestWeather);
const mockGetWeatherHistory = vi.mocked(getWeatherHistory);

const createRequest = (url: string) => new Request(url);

describe("GET /api/weather", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses default 24 hours when no ?hours param", async () => {
    mockGetLatestWeather.mockResolvedValueOnce({ rows: [] } as never);
    mockGetWeatherHistory.mockResolvedValueOnce({ rows: [] } as never);

    await GET(createRequest("http://localhost/api/weather"));

    expect(mockGetWeatherHistory).toHaveBeenCalledWith(24);
  });

  it("uses provided ?hours=12 param", async () => {
    mockGetLatestWeather.mockResolvedValueOnce({ rows: [] } as never);
    mockGetWeatherHistory.mockResolvedValueOnce({ rows: [] } as never);

    await GET(createRequest("http://localhost/api/weather?hours=12"));

    expect(mockGetWeatherHistory).toHaveBeenCalledWith(12);
  });

  it("clamps hours to minimum 1", async () => {
    mockGetLatestWeather.mockResolvedValueOnce({ rows: [] } as never);
    mockGetWeatherHistory.mockResolvedValueOnce({ rows: [] } as never);

    await GET(createRequest("http://localhost/api/weather?hours=0"));

    expect(mockGetWeatherHistory).toHaveBeenCalledWith(1);
  });

  it("clamps hours to maximum 720", async () => {
    mockGetLatestWeather.mockResolvedValueOnce({ rows: [] } as never);
    mockGetWeatherHistory.mockResolvedValueOnce({ rows: [] } as never);

    await GET(createRequest("http://localhost/api/weather?hours=999"));

    expect(mockGetWeatherHistory).toHaveBeenCalledWith(720);
  });

  it("returns { current, history } shape", async () => {
    const mockCurrent = { temperature: 22.5, wind_speed: 15 };
    const mockHistory = [
      { temperature: 21.0, wind_speed: 12 },
      { temperature: 22.5, wind_speed: 15 },
    ];
    mockGetLatestWeather.mockResolvedValueOnce({
      rows: [mockCurrent],
    } as never);
    mockGetWeatherHistory.mockResolvedValueOnce({ rows: mockHistory } as never);

    const response = await GET(createRequest("http://localhost/api/weather"));

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ current: mockCurrent, history: mockHistory });
  });

  it("returns current: null when no weather readings exist", async () => {
    mockGetLatestWeather.mockResolvedValueOnce({ rows: [] } as never);
    mockGetWeatherHistory.mockResolvedValueOnce({ rows: [] } as never);

    const response = await GET(createRequest("http://localhost/api/weather"));

    const body = await response.json();
    expect(body).toEqual({ current: null, history: [] });
  });

  it("returns 500 on error", async () => {
    mockGetLatestWeather.mockRejectedValueOnce(
      new Error("DB connection failed"),
    );

    const response = await GET(createRequest("http://localhost/api/weather"));

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body).toEqual({ error: "Failed to fetch weather data" });
  });
});
