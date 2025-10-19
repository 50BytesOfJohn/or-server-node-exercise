import type { HealthModel } from "./model.js";

import * as repository from "./repository.js";

export async function health(): Promise<HealthModel.HealthResponse> {
	return {
		status: "ok",
	};
}

export async function readiness(): Promise<HealthModel.ReadinessResponse> {
	const databaseStatus = await repository
		.queryDatabase()
		.then(() => "ok")
		.catch(() => "error");

	return {
		database: databaseStatus,
		redis: "ok",
	};
}
