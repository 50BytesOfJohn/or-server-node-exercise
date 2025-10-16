import { pgEnum, pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

// TODO: Add schema

export const usersTable = table("users", {
  id: t.uuid("id").primaryKey().defaultRandom(),
});
