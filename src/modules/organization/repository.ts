import { desc, eq } from "drizzle-orm";
import ms from "ms";
import { db } from "../../db/index.js";
import { organizationsTable } from "../../db/schema.js";
import { logger } from "../../lib/logger.js";
import type { OrganizationModel } from "./model.js";

export async function listOrganizations(query: OrganizationModel.ListQuery) {
	const { page, limit } = query;

	const offset = (page - 1) * limit;

	return db.query.organizationsTable.findMany({
		limit: limit,
		offset: offset,
		orderBy: [desc(organizationsTable.dateCreated)],
	});
}

export async function createOrganization(
	body: OrganizationModel.OrganizationInsert,
) {
	const [result] = await db
		.insert(organizationsTable)
		.values({
			name: body.name,
			industry: body.industry,
			dateFounded: body.dateFounded,
		})
		.returning();

	return result;
}

export async function updateOrganization(
	id: string,
	body: OrganizationModel.OrganizationUpdate,
) {
	const [result] = await db
		.update(organizationsTable)
		.set({
			name: body.name,
			industry: body.industry,
			dateFounded: body.dateFounded,
			dateUpdated: new Date(),
		})
		.where(eq(organizationsTable.id, id))
		.returning();

	return result;
}

export async function deleteOrganization(id: string) {
	const [result] = await db
		.delete(organizationsTable)
		.where(eq(organizationsTable.id, id))
		.returning();

	return result;
}

export async function getOrganizationById(id: string) {
	logger.debug(
		{ event: "getOrganizationById", layer: "repository", id },
		"Getting organization by id",
	);

	// Sleep for 5 seconds to demonstrate caching
	await new Promise((resolve) => setTimeout(resolve, ms("5s")));

	return db.query.organizationsTable.findFirst({
		where: eq(organizationsTable.id, id),
	});
}
