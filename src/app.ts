import { OpenAPIHono as Hono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { logger } from "hono/logger";

// Controllers
import organizationController from "./modules/organization/controller.js";
import authController from "./modules/auth/controller.js";
import healthController from "./modules/health/controller.js";
import userController from "./modules/user/controller.js";
import { reqResLoggerMiddleware } from "./middleware/req-res-logger.middleware.js";
import { errorHandlerMiddleware } from "./middleware/error-handler.middleware.js";
import { globalRateLimitMiddleware } from "./middleware/global-rate-limit.middleware.js";

export function createApp() {
  const app = new Hono();

  app.use(reqResLoggerMiddleware);
  app.use(globalRateLimitMiddleware);

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
  api.route("/users", userController);

  app.route("/api", api);

  app.onError(errorHandlerMiddleware);

  return app;
}
