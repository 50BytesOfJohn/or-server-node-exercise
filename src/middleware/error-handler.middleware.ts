import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { BaseError, UnauthorizedError, UnknownError } from "../errors/index.js";
import { logger } from "../lib/logger.js";

export const errorHandlerMiddleware: ErrorHandler = async (error) => {
	const normalizedError =
		error instanceof BaseError
			? error
			: // A small hack for handling Hono JWT middleware 401 error
				error instanceof HTTPException && error.status === 401
				? new UnauthorizedError("Unauthorized", { cause: error })
				: new UnknownError("Unhandled error", { cause: error });

	logger.error({
		type: "error",
		error: {
			content: BaseError.serialize(normalizedError),
		},
	});

	const response = Response.json(
		{
			code: normalizedError.response.code,
			message: normalizedError.response.message,
		},
		{
			status: normalizedError.statusCode,
			headers: normalizedError.responseHeaders,
		},
	);

	return response;
};
