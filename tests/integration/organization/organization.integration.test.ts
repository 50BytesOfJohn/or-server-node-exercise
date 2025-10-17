import { beforeAll, describe, expect, test, vi } from "vitest";

import { sign } from "hono/jwt";

import { startPostgres } from "../../helpers/postgres-container.js";
import { createApp } from "../../helpers/create-app.js";

const JWT_SECRET = "test_secret";

describe.sequential("Organization", () => {
  beforeAll(async () => {
    const { url } = await startPostgres();

    vi.stubEnv("DATABASE_URL", url);
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

  test("Organization endpoint should return empty list if no organizations are created", async () => {
    // Arrange
    const app = await createApp();
    const accessToken = await sign(
      {
        userId: "test_user_id",
        organizationId: "test_organization_id",
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
      },
      JWT_SECRET
    );

    // Act
    const res = await app.request("/api/organizations", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Assert
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ data: [] });
  });

  test("Organization endpoint should create an organization", async () => {
    // Arrange
    const app = await createApp();
    const accessToken = await sign(
      {
        userId: "test_user_id",
        organizationId: "test_organization_id",
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
      },
      JWT_SECRET
    );

    const organizationData = {
      name: "Test Organization",
      industry: "Technology",
      dateFounded: "2021-01-01",
    };

    // Act
    const res = await app.request("/api/organizations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(organizationData),
    });

    // Assert
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      data: {
        id: expect.any(String),
        name: "Test Organization",
        industry: "Technology",
        dateFounded: "2021-01-01",
        dateCreated: expect.any(String),
        dateUpdated: expect.any(String),
      },
    });
  });

  test("Organization endpoint should retrieve an organization", async () => {
    // Arrange
    const app = await createApp();
    const accessToken = await sign(
      {
        userId: "test_user_id",
        organizationId: "test_organization_id",
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
      },
      JWT_SECRET
    );

    // First create an organization to retrieve
    const organizationData = {
      name: "Test Organization",
      industry: "Technology",
      dateFounded: "2021-01-01",
    };

    const createRes = await app.request("/api/organizations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(organizationData),
    });

    const createResult = await createRes.json();
    const organizationId = createResult.data.id;

    // Act
    const res = await app.request(`/api/organizations/${organizationId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Assert
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      data: {
        id: organizationId,
        name: createResult.data.name,
        industry: createResult.data.industry,
        dateFounded: createResult.data.dateFounded,
        dateCreated: createResult.data.dateCreated,
        dateUpdated: createResult.data.dateUpdated,
      },
    });
  });
});
