import ms from "ms";

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema.js";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.PG_POOL_MAX ?? 15),
  min: Number(process.env.PG_POOL_MIN ?? 0),
  idleTimeoutMillis: ms("30s"),
  connectionTimeoutMillis: ms("2s"),
  maxLifetimeSeconds: Number(process.env.PG_POOL_MAX_LIFETIME ?? 600),
  ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : undefined,
});

pool.on("error", (err) => {
  console.error("PG pool idle client error:", err);
});

export const db = drizzle(pool, { schema, casing: "snake_case" });
