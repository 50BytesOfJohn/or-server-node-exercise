import { LRUCache } from "lru-cache";
import { cacheConfig } from "./config/cache.config.js";

const store = new LRUCache<string, any>(cacheConfig.lru);

export const cacheAdapter = {
  has: (key: string) => store.has(key),
  get: (key: string) => store.get(key),
  set: (key: string, val: any) => {
    store.set(key, val);
  },
  delete: (key: string) => store.delete(key),
  clear: () => store.clear(),
};
