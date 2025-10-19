import { eq, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { usersTable } from "../../db/schema.js";

export async function userExistsByEmail(email: string): Promise<boolean> {
	const row = await db
		.select({ one: sql`1` })
		.from(usersTable)
		.where(eq(usersTable.email, email))
		.limit(1);

	return row.length > 0;
}

export async function getUserByEmail(email: string) {
	return db.query.usersTable.findFirst({
		where: (users, { eq }) => eq(users.email, email),
	});
}
