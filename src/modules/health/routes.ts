import { createRoute } from "@hono/zod-openapi";

// Models
import { HealthModel } from "./model.js";

export const routes = {
  health: createRoute({
    method: "get",
    path: "/health",

    tags: ["Health"],

    responses: {
      200: {
        content: {
          "application/json": {
            schema: HealthModel.healthResponse,
          },
        },
        description: "Health check",
      },
    },
  }),
  readiness: createRoute({
    method: "get",
    path: "/readiness",

    tags: ["Health"],

    responses: {
      200: {
        description: "Readiness check",
        content: {
          "application/json": {
            schema: HealthModel.readinessResponse,
          },
        },
      },
    },
  }),
};
