import { createRoute } from "@hono/zod-openapi";

// Models
import { OrderModel } from "./model.js";

export const routes = {
	list: createRoute({
		method: "get",
		path: "/",

		tags: ["Orders"],

		request: {
			query: OrderModel.listQuery,
		},

		responses: {
			200: {
				content: {
					"application/json": {
						schema: OrderModel.listResponse,
					},
				},
				description: "Retrieve the orders",
			},
		},
	}),
	detail: createRoute({
		method: "get",
		path: "/{id}",

		tags: ["Orders"],

		responses: {
			200: {
				content: {
					"application/json": {
						schema: OrderModel.detailResponse,
					},
				},
				description: "Retrieve the order",
			},
		},
	}),
	create: createRoute({
		method: "post",
		path: "/",

		tags: ["Orders"],

		request: {
			body: {
				content: {
					"application/json": {
						schema: OrderModel.createBody,
					},
				},
			},
		},

		responses: {
			200: {
				content: {
					"application/json": {
						schema: OrderModel.createResponse,
					},
				},
				description: "Create the order",
			},
		},
	}),
	delete: createRoute({
		method: "delete",
		path: "/{id}",

		tags: ["Orders"],

		responses: {
			200: {
				content: {
					"application/json": {
						schema: OrderModel.deleteResponse,
					},
				},
				description: "Delete the order",
			},
		},
	}),
	update: createRoute({
		method: "put",
		path: "/{id}",

		tags: ["Orders"],

		request: {
			body: {
				content: {
					"application/json": {
						schema: OrderModel.updateBody,
					},
				},
			},
		},

		responses: {
			200: {
				content: {
					"application/json": {
						schema: OrderModel.updateResponse,
					},
				},
				description: "Update the order",
			},
		},
	}),
};
