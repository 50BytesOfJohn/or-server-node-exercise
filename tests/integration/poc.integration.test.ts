import { beforeAll, describe, expect, test, vi } from "vitest";

import { createApp } from "../../src/app.js";
import { startPostgres } from "../../tests/helpers/postgres-container.js";

describe("Example", () => {
  beforeAll(async () => {
    const { url } = await startPostgres();
    vi.stubEnv("DATABASE_URL", url);
  });

  test("GET /", async () => {
    const app = createApp();
    const res = await app.request("/");

    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Hello Hono!");
  });
});
