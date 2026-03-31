import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  AISSTREAM_API_KEY: z.string().min(1, "AISSTREAM_API_KEY is required"),
});

export const env = EnvSchema.parse(process.env);
