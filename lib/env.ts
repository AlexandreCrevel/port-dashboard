import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  DATABASE_URL_READONLY: z.string().min(1).optional(),
  AISSTREAM_API_KEY: z.string().min(1),
  GEMINI_API_KEY: z.string().min(1),
  AIS_WEBSOCKET_URL: z
    .string()
    .url()
    .default("wss://stream.aisstream.io/v0/stream"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

export const env = EnvSchema.parse(process.env);
export type Env = z.infer<typeof EnvSchema>;
