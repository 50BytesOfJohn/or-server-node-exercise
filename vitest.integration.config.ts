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
