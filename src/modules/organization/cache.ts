import pMemoize from "p-memoize";
import { cacheAdapter } from "../../cache.js";
import { cacheConfig } from "../../config/cache.config.js";
import * as repository from "./repository.js";

export namespace OrganizationCache {
	const keys = {
		getById: (id: string) => `organization:${id}`,
	};

	export const getById = pMemoize(repository.getOrganizationById, {
		cache: cacheAdapter,
		maxAge: cacheConfig.lru.ttlInMs,
		cacheKey: ([id]) => keys.getById(id),
	});

	export const invalidateById = (id: string) => {
		cacheAdapter.delete(keys.getById(id));
	};
}
