import { desc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { organizationsTable } from "../../db/schema.js";
import { OrganizationModel } from "./model.js";

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
  body: OrganizationModel.OrganizationInsert
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
  body: OrganizationModel.OrganizationUpdate
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
  return await db.query.organizationsTable.findFirst({
    where: eq(organizationsTable.id, id),
  });
}
