import bcrypt from "bcrypt";
import { decode, sign, verify } from "hono/jwt";
import ms from "ms";
import { env } from "../../env.js";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
	return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string) {
	return await bcrypt.compare(password, hash);
}

export async function generateAccessToken(
	userId: string,
	organizationId: string,
) {
	return await sign(
		{
			userId,
			organizationId,
			exp: Math.floor(Date.now() / 1000) + Math.floor(ms("5m") / 1000),
		},
		env.JWT_SECRET,
	);
}

export async function generateRefreshToken(userId: string) {
	return await sign(
		{
			userId,
			exp: Math.floor(Date.now() / 1000) + Math.floor(ms("30d") / 1000),
		},
		env.JWT_SECRET,
	);
}

export async function verifyAccessToken(token: string) {
	return await verify(token, env.JWT_SECRET);
}

export async function verifyRefreshToken(token: string) {
	const payload = await verify(token, env.JWT_SECRET);
	return payload as { userId: string };
}
