import { createRoute } from "@hono/zod-openapi";

// Models
import { OrganizationModel } from "./model.js";

export const routes = {
	list: createRoute({
		method: "get",
		path: "/",

		tags: ["Organizations"],

		request: {
			query: OrganizationModel.listQuery,
		},

		responses: {
			200: {
				content: {
					"application/json": {
						schema: OrganizationModel.listResponse,
					},
				},
				description: "Retrieve the organizations",
			},
		},
	}),
	detail: createRoute({
		method: "get",
		path: "/{id}",

		tags: ["Organizations"],

		responses: {
			200: {
				content: {
					"application/json": {
						schema: OrganizationModel.detailResponse,
					},
				},
				description: "Retrieve the organization",
			},
		},
	}),
	create: createRoute({
		method: "post",
		path: "/",

		tags: ["Organizations"],

		request: {
			body: {
				content: {
					"application/json": {
						schema: OrganizationModel.createBody,
					},
				},
			},
		},

		responses: {
			200: {
				content: {
					"application/json": {
						schema: OrganizationModel.createResponse,
					},
				},
				description: "Create the organization",
			},
		},
	}),
	delete: createRoute({
		method: "delete",
		path: "/{id}",

		tags: ["Organizations"],

		responses: {
			200: {
				content: {
					"application/json": {
						schema: OrganizationModel.deleteResponse,
					},
				},
				description: "Delete the organization",
			},
		},
	}),
	update: createRoute({
		method: "put",
		path: "/{id}",

		tags: ["Organizations"],

		request: {
			body: {
				content: {
					"application/json": {
						schema: OrganizationModel.updateBody,
					},
				},
			},
		},

		responses: {
			200: {
				content: {
					"application/json": {
						schema: OrganizationModel.updateResponse,
					},
				},
				description: "Update the organization",
			},
		},
	}),
};
