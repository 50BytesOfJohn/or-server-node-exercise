import { db } from "../../db/index.js";
import { usersTable } from "../../db/schema.js";
import type { UserModel } from "./model.js";

export async function getUserById(id: string) {
  return db.query.usersTable.findFirst({
    where: (users, { eq }) => eq(users.id, id),
  });
}

export async function createUser(user: UserModel.UserInsert) {
  const result = await db.insert(usersTable).values(user).returning();

  return result[0];
}
