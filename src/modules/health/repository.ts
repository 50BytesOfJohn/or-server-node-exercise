import { sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { usersTable } from "../../db/schema.js";

export async function queryDatabase() {
	await db.select({ one: sql`1` }).from(usersTable).limit(1);
}
