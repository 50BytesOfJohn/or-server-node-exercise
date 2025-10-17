import { OpenAPIHono as Hono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";

// Controllers
import organizationController from "./modules/organization/controller.js";

export function createApp() {
  const app = new Hono();

  app.get("/", (c) => {
    return c.text("Hello Hono!");
  });

  app.route("/organizations", organizationController);

  app.doc("/openapi.json", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Server Node Exercise API",
    },
  });

  app.get("/swagger", swaggerUI({ url: "/openapi.json" }));

  return app;
}
