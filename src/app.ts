import { OpenAPIHono as Hono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";

// Controllers
import organizationController from "./modules/organization/controller.js";
import authController from "./modules/auth/controller.js";
import healthController from "./modules/health/controller.js";

export function createApp() {
  const app = new Hono();

  // APP
  app.doc("/openapi.json", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Server Node Exercise API",
    },
  });

  app.get("/swagger", swaggerUI({ url: "/openapi.json" }));

  app.route("/", healthController);

  // API
  const api = new Hono();

  api.route("/auth", authController);
  api.route("/organizations", organizationController);

  app.route("/api", api);

  return app;
}
