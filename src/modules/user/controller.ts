import { OpenAPIHono as Hono } from "@hono/zod-openapi";

import * as service from "./service.js";

import { routes } from "./routes.js";
import { jwt } from "hono/jwt";
import { env } from "../../env.js";

const app = new Hono();

app.use("*", jwt({ secret: env.JWT_SECRET }));

app.openapi(routes.list, async (c) => {
  const query = c.req.valid("query");
  const response = await service.listUsers(query);

  return c.json(response);
});

app.openapi(routes.detail, async (c) => {
  const response = await service.getUser(c.req.param("id"));

  return c.json(response);
});

app.openapi(routes.create, async (c) => {
  const body = c.req.valid("json");
  const response = await service.createUser(body);

  return c.json(response);
});

app.openapi(routes.update, async (c) => {
  const body = c.req.valid("json");

  const response = await service.updateUser(c.req.param("id"), body);

  return c.json(response);
});

app.openapi(routes.delete, async (c) => {
  const response = await service.deleteUser(c.req.param("id"));

  return c.json(response);
});

export default app;
