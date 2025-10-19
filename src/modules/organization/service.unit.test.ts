import { afterEach, describe, expect, test, vi } from "vitest";
import { getOrganization } from "./service.js";
import { OrganizationCache } from "./cache.js";

describe("Organization Service", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("getOrganization", () => {
		test("throws NotFound error if organization is not found in DB", async () => {
			// Arrange
			const spy = vi.spyOn(OrganizationCache, "getById");

			spy.mockResolvedValueOnce(undefined);

			// Act
			const promise = getOrganization("1");

			// Assert
			await expect(promise).rejects.toThrow("Organization not found");
		});
	});
});
