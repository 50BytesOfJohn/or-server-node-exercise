import { sign } from "hono/jwt";
import { beforeAll, describe, expect, test, vi } from "vitest";
import { createApp } from "../../helpers/create-app.js";
import { startPostgres } from "../../helpers/postgres-container.js";
import { startRedis } from "../../helpers/redis-container.js";

const JWT_SECRET = "test_secret";

describe("Organization", () => {
	beforeAll(async () => {
		const { url: postgresUrl } = await startPostgres();
		const { url: redisUrl } = await startRedis();

		vi.stubEnv("DATABASE_URL", postgresUrl);
		vi.stubEnv("REDIS_URL", redisUrl);
		vi.stubEnv("JWT_SECRET", JWT_SECRET);
	});

	test("Organization endpoint should be protected by JWT and return 401 if no token is provided", async () => {
		// Arrange
		const app = await createApp();

		// Act
		const res = await app.request("/api/organizations");

		// Assert
		expect(res.status).toBe(401);
	});

	test("Organizations", async () => {
		// Arrange
		const app = await createApp();
		const accessToken = await sign(
			{
				userId: "test_user_id",
				organizationId: "test_organization_id",
				exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
			},
			JWT_SECRET,
		);

		// Act
		const listRes = await app.request("/api/organizations", {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		// Assert
		expect(listRes.status).toBe(200);
		expect(await listRes.json()).toEqual({ data: [] });

		const createRes = await app.request("/api/organizations", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: "Test Organization",
				industry: "Technology",
				dateFounded: "2021-01-01",
			}),
		});

		expect(createRes.status).toBe(200);

		const createResJson = await createRes.json();
		expect(createResJson.data.id).toBeDefined();
		expect(createResJson.data.name).toBe("Test Organization");
		expect(createResJson.data.industry).toBe("Technology");
		expect(createResJson.data.dateFounded).toBe("2021-01-01");
		expect(createResJson.data.dateCreated).toBeDefined();
		expect(createResJson.data.dateUpdated).toBeDefined();

		const createdOrganizationId = createResJson.data.id;

		const detailRes = await app.request(
			`/api/organizations/${createdOrganizationId}`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);

		expect(detailRes.status).toBe(200);
		expect(await detailRes.json()).toEqual({
			data: {
				id: createdOrganizationId,
				name: "Test Organization",
				industry: "Technology",
				dateFounded: "2021-01-01",
				dateCreated: expect.any(String),
				dateUpdated: expect.any(String),
			},
		});

		const updateRes = await app.request(
			`/api/organizations/${createdOrganizationId}`,
			{
				method: "PUT",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: "Updated Test Organization",
				}),
			},
		);

		expect(updateRes.status).toBe(200);
		expect(await updateRes.json()).toEqual({
			data: {
				id: createdOrganizationId,
				dateCreated: expect.any(String),
				dateUpdated: expect.any(String),
				name: "Updated Test Organization",
				industry: "Technology",
				dateFounded: "2021-01-01",
			},
		});

		const deleteRes = await app.request(
			`/api/organizations/${createdOrganizationId}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);

		expect(deleteRes.status).toBe(200);
		expect(await deleteRes.json()).toEqual({
			data: {
				id: createdOrganizationId,
				dateCreated: expect.any(String),
				dateUpdated: expect.any(String),
				name: "Updated Test Organization",
				industry: "Technology",
				dateFounded: "2021-01-01",
			},
		});

		const detailResAfterDelete = await app.request(
			`/api/organizations/${createdOrganizationId}`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);

		expect(detailResAfterDelete.status).toBe(404);
		expect(await detailResAfterDelete.json()).toEqual({
			code: "not_found",
			message: expect.any(String),
		});
	});
});
