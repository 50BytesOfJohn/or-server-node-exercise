import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

export async function startPostgres() {
	const container = await new PostgreSqlContainer("postgres:18").start();
	const url = container.getConnectionUri();

	// TODO: Folder path could be improved
	await migrate(drizzle(url), { migrationsFolder: "src/db/migrations" });

	return { container, url };
}
