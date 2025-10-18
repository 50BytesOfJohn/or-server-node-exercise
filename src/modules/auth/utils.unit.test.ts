import { describe, expect, test } from "vitest";
import { generateAccessToken, verifyAccessToken } from "./utils.js";

describe("Auth Utils", () => {
  describe("generateAccessToken", () => {
    test("should generate proper JWT token", async () => {
      // Arrange
      const userId = "usr_1234567890";
      const organizationId = "org_1234567890";

      // Act
      const token = await generateAccessToken(userId, organizationId);

      // Assert
      expect(token).toMatch(/^eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\..+$/);
    });
  });

  describe("verifyAccessToken", () => {
    test("should verify proper JWT token", async () => {
      // Arrange
      const userId = "usr_1234567890";
      const organizationId = "org_1234567890";
      const token = await generateAccessToken(userId, organizationId);

      // Act
      const decoded = await verifyAccessToken(token);

      // Assert
      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(userId);
      expect(decoded.organizationId).toBe(organizationId);
    });

    test("should throw error if token is invalid", async () => {
      // Arrange
      const token = "invalid_token";

      // Act & Assert
      await expect(verifyAccessToken(token)).rejects.toThrowError(
        "invalid JWT token: invalid_token"
      );
    });
  });
});
