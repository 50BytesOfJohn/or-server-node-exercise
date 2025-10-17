import { createRoute } from "@hono/zod-openapi";

// Models
import { AuthModel } from "./model.js";

export const routes = {
  signIn: createRoute({
    method: "post",
    path: "/sign-in",

    tags: ["Auth"],

    request: {
      body: {
        content: {
          "application/json": {
            schema: AuthModel.signInBody,
          },
        },
      },
    },

    responses: {
      200: {
        content: {
          "application/json": {
            schema: AuthModel.signInResponse,
          },
        },
        description: "Sign in the user",
      },
    },
  }),
  signUp: createRoute({
    method: "post",
    path: "/sign-up",

    tags: ["Auth"],

    request: {
      body: {
        content: {
          "application/json": {
            schema: AuthModel.signUpBody,
          },
        },
      },
    },

    responses: {
      201: {
        description:
          "Sign up the user. After sign up, the user needs to sign in to get the access token.",
      },
    },
  }),
  refreshAccessToken: createRoute({
    method: "post",
    path: "/refresh-access-token",

    tags: ["Auth"],

    request: {
      body: {
        content: {
          "application/json": {
            schema: AuthModel.refreshAccessTokenBody,
          },
        },
      },
    },

    responses: {
      200: {
        content: {
          "application/json": {
            schema: AuthModel.refreshAccessTokenResponse,
          },
        },
        description: "Refresh the access token",
      },
    },
  }),
};
