import ms from "ms";

export const cacheConfig = {
  lru: {
    max: 1000,
    ttlInMs: ms("5m"),
    allowStale: true,
  },
} as const;
