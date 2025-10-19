import type { MiddlewareHandler } from "hono";
import { logger } from "../lib/logger.js";

export const reqResLoggerMiddleware: MiddlewareHandler = async (c, next) => {
	logger.debug({
		type: "request",
		method: c.req.method,
		path: c.req.path,
		headers: Object.fromEntries(c.req.raw.headers),
	});

	await next();

	logger.debug({
		type: "response",
		method: c.req.method,
		path: c.req.path,
		status: c.res.status,
		headers: Object.fromEntries(c.res.headers),
	});
};
