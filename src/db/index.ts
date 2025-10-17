import ms from "ms";

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema.js";
import { env } from "../env.js";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  // max: Number(env.PG_POOL_MAX ?? 15),
  // min: Number(env.PG_POOL_MIN ?? 0),
  idleTimeoutMillis: ms("30s"),
  connectionTimeoutMillis: ms("2s"),
  // maxLifetimeSeconds: Number(env.PG_POOL_MAX_LIFETIME ?? 600),
});

pool.on("error", (err) => {
  console.error("PG pool idle client error:", err);
});

export const db = drizzle(pool, { schema, casing: "snake_case" });
