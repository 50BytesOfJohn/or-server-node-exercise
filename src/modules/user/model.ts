import { z } from "@hono/zod-openapi";
import type { organizationsTable, usersTable } from "../../db/schema.js";

export namespace UserModel {
  // ===============================
  // INPUT
  // ===============================

  // ===============================
  // PUBLIC
  // ===============================

  // ===============================
  // RESPONSE
  // ===============================

  // ===============================
  // INTERNAL
  // ===============================
  export type UserInsert = typeof usersTable.$inferInsert;

  export type UserUpdate = Omit<
    UserInsert,
    "id" | "dateCreated" | "dateUpdated"
  >;
}
