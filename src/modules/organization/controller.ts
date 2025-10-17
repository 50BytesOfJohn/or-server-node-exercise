import { OpenAPIHono as Hono } from "@hono/zod-openapi";

import * as service from "./service.js";
import { routes } from "./routes.js";

const app = new Hono();

app.openapi(routes.list, async (c) => {
  const query = c.req.valid("query");
  const response = await service.listOrganizations(query);

  return c.json(response);
});

app.openapi(routes.detail, async (c) => {
  const response = await service.getOrganization(c.req.param("id"));

  return c.json(response);
});

app.openapi(routes.create, async (c) => {
  const body = c.req.valid("json");
  const response = await service.createOrganization(body);

  return c.json(response);
});

app.openapi(routes.update, async (c) => {
  const body = c.req.valid("json");

  const response = await service.updateOrganization(c.req.param("id"), body);

  return c.json(response);
});

app.openapi(routes.delete, async (c) => {
  const response = await service.deleteOrganization(c.req.param("id"));

  return c.json(response);
});

export default app;
