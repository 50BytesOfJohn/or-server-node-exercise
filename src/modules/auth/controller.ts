import { OpenAPIHono as Hono } from "@hono/zod-openapi";
import { routes } from "./routes.js";
import * as service from "./service.js";

const app = new Hono();

app.openapi(routes.signIn, async (c) => {
	const body = c.req.valid("json");
	const response = await service.signIn(body);

	return c.json(response);
});

app.openapi(routes.signUp, async (c) => {
	const body = c.req.valid("json");
	await service.signUp(body);

	return c.json({}, 201);
});

app.openapi(routes.refreshAccessToken, async (c) => {
	const body = c.req.valid("json");
	const response = await service.refreshAccessToken(body);

	return c.json(response);
});

export default app;
