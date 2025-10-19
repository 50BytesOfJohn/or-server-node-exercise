import { OpenAPIHono as Hono } from "@hono/zod-openapi";
import { routes } from "./routes.js";
import * as service from "./service.js";

const app = new Hono();

app.openapi(routes.health, async (c) => {
	const response = await service.health();

	return c.json(response);
});

app.openapi(routes.readiness, async (c) => {
	const response = await service.readiness();

	return c.json(response);
});

export default app;
