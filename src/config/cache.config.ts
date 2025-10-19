import ms from "ms";

export const cacheConfig = {
	lru: {
		max: 1000,
		ttlInMs: ms("10m"),
		allowStale: true,
	},
} as const;
