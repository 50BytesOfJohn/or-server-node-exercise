import type { MiddlewareHandler } from "hono";
import { env } from "../env.js";

import { RateLimiterRedis, RateLimiterRes } from "rate-limiter-flexible";
import { redis } from "../lib/redis.js";
import { getConnInfo } from "@hono/node-server/conninfo";
import { RateLimitExceededError, UnknownError } from "../errors/index.js";
import { rateLimitConfig } from "../config/rate-limit.config.js";
import { logger } from "../lib/logger.js";

const globalRateLimiter = new RateLimiterRedis({
  storeClient: redis,
  useRedisPackage: true,
  points: rateLimitConfig.global.points,
  duration: rateLimitConfig.global.duration,
});

export const globalRateLimitMiddleware: MiddlewareHandler = async (c, next) => {
  if (env.DISABLE_RATE_LIMIT) return next();

  const connectionInfo = getConnInfo(c);

  const ipAddress = connectionInfo.remote.address;
  const userAgent = c.req.header("User-Agent");

  const rateLimitId = ipAddress ?? userAgent ?? "unknown";

  try {
    await globalRateLimiter.consume(rateLimitId, 1);
    return next();
  } catch (rateLimiterError) {
    if (rateLimiterError instanceof RateLimiterRes) {
      logger.debug({
        type: "rate_limit_exceeded",
        rateLimitId,
        rateLimitError: rateLimiterError,
      });

      throw new RateLimitExceededError("Rate limit exceeded", {
        cause: rateLimiterError,
        props: {
          responseHeaders: {
            "Retry-After": rateLimiterError.msBeforeNext / 1000,
            "X-RateLimit-Limit": rateLimitConfig.global.points,
            "X-RateLimit-Remaining": rateLimiterError.remainingPoints,
            "X-RateLimit-Reset": Math.ceil(
              (Date.now() + rateLimiterError.msBeforeNext) / 1000
            ),
          },
        },
      });
    }

    /**
     * Eventually we can pass the request based on the decision
     */
    throw new UnknownError("Unknown error", { cause: rateLimiterError });
  }
};
