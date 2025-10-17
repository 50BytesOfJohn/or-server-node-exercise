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

export async function createOrganization(body: OrganizationModel.CreateBody) {
  const dateFoundedAsDate = new Date(body.dateFounded);

  const result = await db
    .insert(organizationsTable)
    .values({
      name: body.name,
      industry: body.industry,
      dateFounded: dateFoundedAsDate.toISOString(),
    })
    .returning();

  return result[0];
}

export async function updateOrganization(
  id: string,
  body: OrganizationModel.UpdateBody
) {
  return db
    .update(organizationsTable)
    .set({
      name: body.name,
      industry: body.industry,
      dateFounded: body.dateFounded?.toISOString() ?? undefined,
    })
    .where(eq(organizationsTable.id, id));
}

export async function deleteOrganization(id: string) {
  return db.delete(organizationsTable).where(eq(organizationsTable.id, id));
}

export async function getOrganizationById(id: string) {
  return db.query.organizationsTable.findFirst({
    where: eq(organizationsTable.id, id),
  });
}
