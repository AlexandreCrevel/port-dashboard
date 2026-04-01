import { NextResponse } from "next/server";
import { nlqRequestSchema, sqlSafetySchema } from "@/lib/schemas";
import { generateSql } from "@/lib/gemini";
import { executeNlqQuery } from "@/lib/queries";
import { NLQ_SYSTEM_PROMPT } from "@/lib/nlq-prompt";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const parsed = nlqRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query. Must be 3-500 characters." },
        { status: 400 },
      );
    }

    const { sql, explanation } = await generateSql(
      parsed.data.query,
      NLQ_SYSTEM_PROMPT,
    );

    const safetyCheck = sqlSafetySchema.safeParse(sql);
    if (!safetyCheck.success) {
      return NextResponse.json(
        {
          error:
            "I couldn't generate a safe query for that question. Try rephrasing.",
        },
        { status: 422 },
      );
    }

    try {
      const result = await executeNlqQuery(sql);
      return NextResponse.json({ sql, results: result.rows, explanation });
    } catch {
      return NextResponse.json(
        { error: "I didn't understand your question. Try rephrasing." },
        { status: 422 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
