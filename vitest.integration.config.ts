import ms from "ms";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/integration/**/*.integration.test.ts"],
    globals: true,
    environment: "node",

    // TODO: If needed we can add setup
    // setupFiles: ["./tests/setup/integration.setup.ts"],

    /**
     * Integration tests are slower, also considering the container startup time.
     * Here we increase the timeout to 1 minute to handle this.
     */
    testTimeout: ms("1m"),
    hookTimeout: ms("1m"),
  },
});
