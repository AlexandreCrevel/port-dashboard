import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface GenerateSqlResult {
  sql: string;
  explanation: string;
}

export const generateSql = async (
  userQuery: string,
  systemPrompt: string,
): Promise<GenerateSqlResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: userQuery,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0,
    },
  });

  const text: string = response.text ?? "";

  const sqlMatch = text.match(/```sql\n([\s\S]*?)```/);

  if (!sqlMatch) {
    return { sql: text, explanation: "" };
  }

  const sql = sqlMatch[1].trim();
  const explanation = text.replace(/```sql\n[\s\S]*?```/, "").trim();

  return { sql, explanation };
};
