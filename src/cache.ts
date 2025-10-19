import { LRUCache } from "lru-cache";
import { cacheConfig } from "./config/cache.config.js";
import { env } from "./env.js";

const IS_DISABLED = env.DISABLE_CACHE;

const store = new LRUCache<string, any>(cacheConfig.lru);

export const cacheAdapter = {
	has: (key: string) => (IS_DISABLED ? false : store.has(key)),
	get: (key: string) => (IS_DISABLED ? undefined : store.get(key)),
	set: (key: string, val: any) => {
		if (IS_DISABLED) return;
		store.set(key, val);
	},
	delete: (key: string) => store.delete(key),
	clear: () => store.clear(),
};
