import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.unit.test.ts"],
    globals: true,
    environment: "node",
    env: {
      NODE_ENV: "test",
      DISABLE_CACHE: "true",
      DISABLE_RATE_LIMIT: "true",
      DATABASE_URL: "postgresql://1:1@localhost:5432/DUMMY",
      REDIS_URL: "redis://redis:6379",
      JWT_SECRET: "test",
      LOG_LEVEL: "debug",
    },
  },
});
