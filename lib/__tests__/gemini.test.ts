import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGenerateContent = vi.fn();

vi.mock("@google/genai", () => {
  return {
    GoogleGenAI: class {
      models = { generateContent: mockGenerateContent };
    },
  };
});

// Import after mock is set up
const { generateSql } = await import("../gemini");

describe("generateSql", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("extracts SQL from markdown code fence", async () => {
    const sqlContent = "SELECT * FROM vessels WHERE vessel_type = 'Tanker'";
    const explanation = "Shows all tankers in the database.";

    mockGenerateContent.mockResolvedValueOnce({
      text: `\`\`\`sql\n${sqlContent}\n\`\`\`\n${explanation}`,
    });

    const result = await generateSql("show me tankers", "system prompt");

    expect(result.sql).toBe(sqlContent);
  });

  it("extracts explanation text outside code fence", async () => {
    const sqlContent = "SELECT * FROM vessels WHERE vessel_type = 'Tanker'";
    const explanation = "Shows all tankers in the database.";

    mockGenerateContent.mockResolvedValueOnce({
      text: `\`\`\`sql\n${sqlContent}\n\`\`\`\n${explanation}`,
    });

    const result = await generateSql("show me tankers", "system prompt");

    expect(result.explanation).toBe(explanation);
  });

  it("uses entire response as SQL when no code fence is found", async () => {
    const rawSql = "SELECT * FROM vessels LIMIT 10";

    mockGenerateContent.mockResolvedValueOnce({
      text: rawSql,
    });

    const result = await generateSql("show me vessels", "system prompt");

    expect(result.sql).toBe(rawSql);
    expect(result.explanation).toBe("");
  });

  it("calls generateContent with correct model and config", async () => {
    mockGenerateContent.mockResolvedValueOnce({
      text: "SELECT 1",
    });

    await generateSql("test query", "test system prompt");

    expect(mockGenerateContent).toHaveBeenCalledWith({
      model: "gemini-2.0-flash",
      contents: "test query",
      config: {
        systemInstruction: "test system prompt",
        temperature: 0,
      },
    });
  });
});
