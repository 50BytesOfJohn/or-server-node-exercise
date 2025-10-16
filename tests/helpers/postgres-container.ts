import { migrate } from "drizzle-orm/node-postgres/migrator";
import { GenericContainer } from "testcontainers";
import { drizzle } from "drizzle-orm/node-postgres";

const POSTGRES_PASSWORD = "postgres_test_123";
const POSTGRES_USER = "postgres_test";
const POSTGRES_DB = "test_db";

export async function startPostgres() {
  const container = await new GenericContainer("postgres:18")
    .withEnvironment({
      POSTGRES_PASSWORD,
      POSTGRES_USER,
      POSTGRES_DB,
    })
    .withExposedPorts(5432)
    .start();

  const port = container.getMappedPort(5432);
  const host = container.getHost();
  const url = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${host}:${port}/${POSTGRES_DB}`;

  // TODO: Folder path could be improved
  await migrate(drizzle(url), { migrationsFolder: "src/db/migrations" });

  return { container, url };
}
