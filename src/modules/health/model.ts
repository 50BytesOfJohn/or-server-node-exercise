import { z } from "@hono/zod-openapi";

export namespace HealthModel {
	// ===============================
	// INPUT
	// ===============================

	// ===============================
	// PUBLIC
	// ===============================

	// ===============================
	// RESPONSE
	// ===============================

	export const healthResponse = z.object({
		status: z.string().openapi({
			example: "ok",
			description: "The status of the health check",
		}),
	});

	export type HealthResponse = z.infer<typeof healthResponse>;

	export const readinessResponse = z.object({
		database: z.string().openapi({
			example: "ok",
			description: "The status of the database connection",
		}),
		redis: z.string().openapi({
			example: "ok",
			description: "The status of the redis connection",
		}),
	});

	export type ReadinessResponse = z.infer<typeof readinessResponse>;

	// ===============================
	// INTERNAL
	// ===============================
}
