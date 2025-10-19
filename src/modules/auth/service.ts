import { createUser, getUserById } from "../user/repoistory.js";
import { AccountExistsError } from "./errors.js";
import type { AuthModel } from "./model.js";
import * as repository from "./repository.js";
import {
	generateAccessToken,
	generateRefreshToken,
	hashPassword,
	verifyPassword,
	verifyRefreshToken,
} from "./utils.js";

export async function signIn(body: AuthModel.SignInBody) {
	/**
	 * Check if user exists
	 */
	const user = await repository.getUserByEmail(body.email);

	if (!user) {
		// TODO: Add error handling
		throw new Error("User not found");
	}

	const isPasswordValid = await verifyPassword(body.password, user.password);

	if (!isPasswordValid) {
		// TODO: Add error handling
		throw new Error("Invalid password");
	}

	const [accessToken, refreshToken] = await Promise.all([
		generateAccessToken(user.id, user.organizationId),
		generateRefreshToken(user.id),
	]);

	return {
		accessToken,
		refreshToken,
	};
}

export async function signUp(body: AuthModel.SignUpBody): Promise<void> {
	const doesUserExists = await repository.userExistsByEmail(body.email);

	if (doesUserExists) {
		throw new AccountExistsError("Account already exists");
	}

	const hashedPassword = await hashPassword(body.password);

	await createUser({
		email: body.email,
		password: hashedPassword,
		firstName: body.firstName,
		lastName: body.lastName,
		organizationId: body.organizationId,
	});
}

export async function refreshAccessToken(
	body: AuthModel.RefreshAccessTokenBody,
) {
	const decoded = await verifyRefreshToken(body.refreshToken);

	if (!decoded) {
		// TODO: Add error handling
		throw new Error("Invalid refresh token");
	}

	const user = await getUserById(decoded.userId);

	if (!user) {
		// TODO: Add error handling
		throw new Error("User not found");
	}

	const [accessToken, refreshToken] = await Promise.all([
		generateAccessToken(user.id, user.organizationId),
		generateRefreshToken(user.id),
	]);

	return {
		accessToken,
		refreshToken,
	};
}
