import pMemoize from "p-memoize";
import { cacheAdapter } from "../../cache.js";
import { cacheConfig } from "../../config/cache.config.js";
import * as repository from "./repository.js";

export namespace OrderCache {
	const keys = {
		getById: (id: string) => `order:${id}`,
	};

	export const getById = pMemoize(repository.getOrderById, {
		cache: cacheAdapter,
		maxAge: cacheConfig.lru.ttlInMs,
		cacheKey: ([id]) => keys.getById(id),
	});

	export const invalidateById = (id: string) => {
		cacheAdapter.delete(keys.getById(id));
	};
}
