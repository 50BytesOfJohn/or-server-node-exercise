import { createRoute } from "@hono/zod-openapi";

// Models
import { UserModel } from "./model.js";

export const routes = {
	list: createRoute({
		method: "get",
		path: "/",

		tags: ["Users"],

		request: {
			query: UserModel.listQuery,
		},

		responses: {
			200: {
				content: {
					"application/json": {
						schema: UserModel.listResponse,
					},
				},
				description: "Retrieve the users",
			},
		},
	}),
	detail: createRoute({
		method: "get",
		path: "/{id}",

		tags: ["Users"],

		responses: {
			200: {
				content: {
					"application/json": {
						schema: UserModel.detailResponse,
					},
				},
				description: "Retrieve the user",
			},
		},
	}),
	create: createRoute({
		method: "post",
		path: "/",

		tags: ["Users"],

		request: {
			body: {
				content: {
					"application/json": {
						schema: UserModel.createBody,
					},
				},
			},
		},

		responses: {
			200: {
				content: {
					"application/json": {
						schema: UserModel.createResponse,
					},
				},
				description: "Create the user",
			},
		},
	}),
	delete: createRoute({
		method: "delete",
		path: "/{id}",

		tags: ["Users"],

		responses: {
			200: {
				content: {
					"application/json": {
						schema: UserModel.deleteResponse,
					},
				},
				description: "Delete the user",
			},
		},
	}),
	update: createRoute({
		method: "put",
		path: "/{id}",

		tags: ["Users"],

		request: {
			body: {
				content: {
					"application/json": {
						schema: UserModel.updateBody,
					},
				},
			},
		},

		responses: {
			200: {
				content: {
					"application/json": {
						schema: UserModel.updateResponse,
					},
				},
				description: "Update the user",
			},
		},
	}),
};
