import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";

vi.mock("@/lib/gemini", () => ({
  generateSql: vi.fn(),
}));

vi.mock("@/lib/queries", () => ({
  executeNlqQuery: vi.fn(),
}));

import { generateSql } from "@/lib/gemini";
import { executeNlqQuery } from "@/lib/queries";

const mockGenerateSql = vi.mocked(generateSql);
const mockExecuteNlqQuery = vi.mocked(executeNlqQuery);

const createRequest = (body: unknown) =>
  new Request("http://localhost/api/nlq", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

describe("POST /api/nlq", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with sql, results, and explanation on valid request", async () => {
    const mockRows = [{ name: "CMA CGM LIBRA", vessel_type: "Tanker" }];
    const mockSql = "SELECT name FROM vessels WHERE vessel_type = 'Tanker'";
    const mockExplanation = "Shows all tankers.";

    mockGenerateSql.mockResolvedValueOnce({
      sql: mockSql,
      explanation: mockExplanation,
    });
    mockExecuteNlqQuery.mockResolvedValueOnce({ rows: mockRows } as never);

    const response = await POST(
      createRequest({ query: "show me all tankers" }),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({
      sql: mockSql,
      results: mockRows,
      explanation: mockExplanation,
    });
  });

  it("returns 400 when query is too short", async () => {
    const response = await POST(createRequest({ query: "hi" }));

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toEqual({ error: "Invalid query. Must be 3-500 characters." });
    expect(mockGenerateSql).not.toHaveBeenCalled();
  });

  it("returns 422 when generateSql returns unsafe SQL", async () => {
    mockGenerateSql.mockResolvedValueOnce({
      sql: "DROP TABLE vessels",
      explanation: "Drops the table.",
    });

    const response = await POST(createRequest({ query: "delete all vessels" }));

    expect(response.status).toBe(422);
    const body = await response.json();
    expect(body).toEqual({
      error:
        "I couldn't generate a safe query for that question. Try rephrasing.",
    });
    expect(mockExecuteNlqQuery).not.toHaveBeenCalled();
  });

  it("returns 422 when executeNlqQuery throws", async () => {
    mockGenerateSql.mockResolvedValueOnce({
      sql: "SELECT * FROM vessels",
      explanation: "Shows all vessels.",
    });
    mockExecuteNlqQuery.mockRejectedValueOnce(new Error("DB error"));

    const response = await POST(createRequest({ query: "show all vessels" }));

    expect(response.status).toBe(422);
    const body = await response.json();
    expect(body).toEqual({
      error: "I didn't understand your question. Try rephrasing.",
    });
  });

  it("returns 500 when generateSql throws", async () => {
    mockGenerateSql.mockRejectedValueOnce(new Error("Gemini API unavailable"));

    const response = await POST(createRequest({ query: "show all tankers" }));

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body).toEqual({ error: "Internal server error" });
  });
});
