import ModernError from "modern-errors";

// Plugins
import modernErrorsSerialize from "modern-errors-serialize";

export const BaseError = ModernError.subclass("BaseError", {
  props: {
    statusCode: 500,
    response: {
      code: "something_went_wrong",
      message: "Something went wrong",
    },
    responseHeaders: {},
  },
  plugins: [modernErrorsSerialize],
});

export const UnknownError = BaseError.subclass("UnknownError");
export const SomethingWentWrongError = BaseError.subclass(
  "SomethingWentWrongError"
);

export const UnauthorizedError = BaseError.subclass("UnauthorizedError", {
  props: {
    statusCode: 401,
    response: {
      code: "unauthorized",
      message: "Unauthorized",
    },
  },
});

export const ForbiddenError = BaseError.subclass("ForbiddenError", {
  props: {
    statusCode: 403,
    response: {
      code: "forbidden",
      message: "Forbidden",
    },
  },
});

export const NotFoundError = BaseError.subclass("NotFoundError", {
  props: {
    statusCode: 404,
    response: {
      code: "not_found",
      message: "Not found",
    },
  },
});

export const DatabaseError = BaseError.subclass("DatabaseError");

export const RateLimitExceededError = BaseError.subclass(
  "RateLimitExceededError",
  {
    props: {
      statusCode: 429,
      response: {
        code: "rate_limit_exceeded",
        message: "Rate limit exceeded",
      },
    },
  }
);
