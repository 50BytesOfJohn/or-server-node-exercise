import type { MiddlewareHandler } from "hono";
import ms from "ms";

const CACHE_TIME = "10 minutes";

export const cacheControl: MiddlewareHandler = async (c, next) => {
  await next();
  if (c.req.method === "GET" && c.res.ok) {
    c.header("Cache-Control", `public, max-age=${ms(CACHE_TIME) / 1000}`);
  }
};
