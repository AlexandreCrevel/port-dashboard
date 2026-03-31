// Mock env vars before any module that imports lib/env.ts
process.env.DATABASE_URL = "postgresql://localhost:5432/test";
process.env.DATABASE_URL_READONLY = "postgresql://localhost:5432/test";
process.env.AISSTREAM_API_KEY = "test-key";
process.env.GEMINI_API_KEY = "test-key";
process.env.AIS_WEBSOCKET_URL = "ws://localhost:9999";

import "@testing-library/jest-dom/vitest";
