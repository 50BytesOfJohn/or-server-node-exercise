import { drizzle } from "drizzle-orm/node-postgres";
import ms from "ms";
import { Pool } from "pg";
import { env } from "../env.js";
import { logger } from "../lib/logger.js";
import * as schema from "./schema.js";

const pool = new Pool({
	connectionString: env.DATABASE_URL,
	// max: Number(env.PG_POOL_MAX ?? 15),
	// min: Number(env.PG_POOL_MIN ?? 0),
	idleTimeoutMillis: ms("30s"),
	connectionTimeoutMillis: ms("2s"),
	// maxLifetimeSeconds: Number(env.PG_POOL_MAX_LIFETIME ?? 600),
});

// Log database pool state changes
pool.on("connect", (client) => {
	logger.info({ event: "pool_connect" }, "Database client connected to pool");
});

pool.on("acquire", (client) => {
	logger.info(
		{
			event: "pool_acquire",
			totalCount: pool.totalCount,
			idleCount: pool.idleCount,
			waitingCount: pool.waitingCount,
		},
		"Database client acquired from pool",
	);
});

pool.on("remove", (client) => {
	logger.info(
		{
			event: "pool_remove",
			totalCount: pool.totalCount,
			idleCount: pool.idleCount,
			waitingCount: pool.waitingCount,
		},
		"Database client removed from pool",
	);
});

pool.on("error", (err) => {
	logger.error({ event: "pool_error", err }, "Database pool idle client error");
});

logger.info(
	{
		event: "pool_initialized",
		config: {
			idleTimeoutMillis: ms("30s"),
			connectionTimeoutMillis: ms("2s"),
		},
	},
	"Database connection pool initialized",
);

export const db = drizzle(pool, { schema, casing: "snake_case" });
