import { z } from "@hono/zod-openapi";
import type { usersTable } from "../../db/schema.js";

export namespace AuthModel {
	// ===============================
	// INPUT
	// ===============================
	export const signInBody = z.object({
		email: z.email().openapi({
			example: "test@example.com",
			description: "User's email",
		}),
		password: z.string().min(8).max(255).openapi({
			example: "password1234",
			description: "User's password",
		}),
	});

	export type SignInBody = z.infer<typeof signInBody>;

	export const signUpBody = z.object({
		firstName: z.string().min(1).max(255).openapi({
			example: "John",
			description: "User's first name",
		}),

		lastName: z.string().min(1).max(255).openapi({
			example: "Doe",
			description: "User's last name",
		}),

		organizationId: z.string().openapi({
			example: "org_1234567890",
			description: "The organization the user belongs to",
		}),

		email: z.email().openapi({
			example: "test@example.com",
			description: "User's email",
		}),

		password: z.string().min(8).max(255).openapi({
			example: "password1234",
			description: "User's password",
		}),
	});

	export type SignUpBody = z.infer<typeof signUpBody>;

	export const refreshAccessTokenBody = z.object({
		refreshToken: z.string().openapi({
			example: "refresh_token_1234567890",
			description: "The refresh token to use to refresh the access token",
		}),
	});

	export type RefreshAccessTokenBody = z.infer<typeof refreshAccessTokenBody>;

	// ===============================
	// PUBLIC
	// ===============================

	// ===============================
	// RESPONSE
	// ===============================
	export const signInResponse = z.object({
		accessToken: z.string().openapi({
			example: "access_token_1234567890",
			description: "The access token to use to access the API",
		}),
		refreshToken: z.string().openapi({
			example: "refresh_token_1234567890",
			description: "The refresh token to use to refresh the access token",
		}),
	});

	export type SignInResponse = z.infer<typeof signInResponse>;

	export const refreshAccessTokenResponse = z.object({
		accessToken: z.string().openapi({
			example: "access_token_1234567890",
			description: "The access token to use to access the API",
		}),
		refreshToken: z.string().openapi({
			example: "refresh_token_1234567890",
			description: "The new refresh token to use to refresh the access token",
		}),
	});

	export type RefreshAccessTokenResponse = z.infer<
		typeof refreshAccessTokenResponse
	>;

	// ===============================
	// INTERNAL
	// ===============================
}
