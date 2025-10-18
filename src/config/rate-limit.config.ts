import ms from "ms";
import type { IRateLimiterRedisOptions } from "rate-limiter-flexible";

export const rateLimitConfig = {
  global: {
    points: 2,
    duration: ms("10s") / 1000,
  } satisfies Omit<IRateLimiterRedisOptions, "storeClient" | "useRedisPackage">,
} as const;
