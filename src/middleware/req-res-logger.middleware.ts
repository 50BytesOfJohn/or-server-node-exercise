import type { MiddlewareHandler } from "hono";
import { logger } from "../lib/logger.js";

export const reqResLoggerMiddleware: MiddlewareHandler = async (c, next) => {
  const redact = new Set(["authorization", "cookie", "set-cookie"]);

  const toObj = (h: Headers) => {
    const out: Record<string, string> = {};
    for (const [k, v] of h)
      out[k] = redact.has(k.toLowerCase()) ? "[REDACTED]" : v;
    return out;
  };

  logger.debug({
    type: "request",
    method: c.req.method,
    path: c.req.path,
    headers: toObj(c.req.raw.headers),
  });

  await next();

  logger.debug({
    type: "response",
    method: c.req.method,
    path: c.req.path,
    status: c.res.status,
    headers: toObj(c.res.headers),
  });
};
