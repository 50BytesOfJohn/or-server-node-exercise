import { BaseError } from "../../errors/index.js";

export const AccountExistsError = BaseError.subclass("AccountExistsError", {
  props: {
    statusCode: 400,
    response: {
      code: "account_exists",
      message: "Account with this email already exists",
    },
  },
});
