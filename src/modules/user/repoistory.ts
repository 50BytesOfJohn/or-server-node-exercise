import { desc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { usersTable } from "../../db/schema.js";
import type { UserModel } from "./model.js";

export async function listUsers(query: UserModel.ListQuery) {
  const { page, limit } = query;

  const offset = (page - 1) * limit;

  return db.query.usersTable.findMany({
    limit: limit,
    offset: offset,
    orderBy: [desc(usersTable.dateCreated)],
  });
}

export async function getUserById(id: string) {
  return await db.query.usersTable.findFirst({
    where: (users, { eq }) => eq(users.id, id),
  });
}

export async function createUser(user: UserModel.UserInsert) {
  const [result] = await db.insert(usersTable).values(user).returning();

  return result;
}

export async function updateUser(id: string, body: UserModel.UserUpdate) {
  const [result] = await db
    .update(usersTable)
    .set({
      ...body,
      dateUpdated: new Date(),
    })
    .where(eq(usersTable.id, id))
    .returning();

  return result;
}

export async function deleteUser(id: string) {
  const [result] = await db
    .delete(usersTable)
    .where(eq(usersTable.id, id))
    .returning();

  return result;
}
