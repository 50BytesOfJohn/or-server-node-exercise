import { z } from "@hono/zod-openapi";
import type { ordersTable } from "../../db/schema.js";
import { OrganizationModel } from "../organization/model.js";
import { UserModel } from "../user/model.js";

export namespace OrderModel {
	// ===============================
	// INPUT
	// ===============================
	export const listQuery = z.object({
		page: z
			.string()
			.default("1")
			.openapi({
				example: 1,
				default: 1,
				description: "The page number to retrieve. First page is 1.",
			})
			.transform((val) => parseInt(val, 10))
			.pipe(z.number().int().positive()),

		limit: z
			.string()
			.default("10")
			.openapi({
				example: 10,
				default: 10,
				description: "The number of items per page",
			})
			.transform((val) => parseInt(val, 10))
			.pipe(z.number().int().min(1).max(20)),

		userId: z.string().optional().openapi({
			example: "usr_ujp9HKOcQtk-Xt9jnJLc5",
			description: "Filter orders by user ID",
		}),

		organizationId: z.string().optional().openapi({
			example: "org_ujp9HKOcQtk-Xt9jnJLc5",
			description: "Filter orders by organization ID",
		}),
	});

	export type ListQuery = z.infer<typeof listQuery>;

	export const createBody = z.object({
		totalAmount: z.number().positive().openapi({
			example: 99.99,
			description: "The total amount of the order",
		}),

		userId: z.string().openapi({
			example: "usr_ujp9HKOcQtk-Xt9jnJLc5",
			description: "The ID of the user placing the order",
		}),

		organizationId: z.string().openapi({
			example: "org_ujp9HKOcQtk-Xt9jnJLc5",
			description: "The ID of the organization the order belongs to",
		}),
	});

	export type CreateBody = z.infer<typeof createBody>;

	export const updateBody = z.object({
		totalAmount: z
			.number()
			.positive()
			.openapi({
				example: 99.99,
				description: "The total amount of the order",
			})
			.optional(),

		userId: z
			.string()
			.openapi({
				example: "usr_ujp9HKOcQtk-Xt9jnJLc5",
				description: "The ID of the user placing the order",
			})
			.optional(),

		organizationId: z
			.string()
			.openapi({
				example: "org_ujp9HKOcQtk-Xt9jnJLc5",
				description: "The ID of the organization the order belongs to",
			})
			.optional(),
	});

	export type UpdateBody = z.infer<typeof updateBody>;

	// ===============================
	// PUBLIC
	// ===============================
	export const publicItem = z.object({
		id: z.string().openapi({
			example: "ord_ujp9HKOcQtk-Xt9jnJLc5",
			description: "The unique identifier for the order",
		}),

		orderDate: z.date().openapi({
			example: "2021-01-01T00:00:00.000Z",
			description: "The date the order was placed",
		}),

		totalAmount: z
			.string()
			.transform((val) => parseFloat(val))
			.openapi({
				example: 99.99,
				description: "The total amount of the order",
			}),

		userId: z.string().openapi({
			example: "usr_ujp9HKOcQtk-Xt9jnJLc5",
			description: "The ID of the user who placed the order",
		}),

		organizationId: z.string().openapi({
			example: "org_ujp9HKOcQtk-Xt9jnJLc5",
			description: "The ID of the organization the order belongs to",
		}),
	});

	export type PublicItem = z.infer<typeof publicItem>;

	export const publicItemDetail = publicItem.extend({
		dateUpdated: z.date().openapi({
			example: "2021-01-01T00:00:00.000Z",
			description: "The date the order was last updated",
		}),
	});

	export type PublicItemDetail = z.infer<typeof publicItemDetail>;

	export const publicItemDetailWithRelations = publicItemDetail.extend({
		user: UserModel.publicItem,
		organization: OrganizationModel.publicItem,
	});

	export type PublicItemDetailWithRelations = z.infer<
		typeof publicItemDetailWithRelations
	>;
	// ===============================
	// RESPONSE
	// ===============================
	export const listResponse = z.object({
		data: z.array(publicItem),
	});

	export type ListResponse = z.infer<typeof listResponse>;

	export const detailResponse = z
		.object({
			data: publicItemDetailWithRelations,
		})
		.strict();

	export type DetailResponse = z.infer<typeof detailResponse>;

	export const createResponse = z.object({
		data: publicItemDetail,
	});

	export type CreateResponse = z.infer<typeof createResponse>;

	export const deleteResponse = z.object({
		data: publicItemDetail,
	});

	export type DeleteResponse = z.infer<typeof deleteResponse>;

	export const updateResponse = z.object({
		data: publicItemDetail,
	});

	export type UpdateResponse = z.infer<typeof updateResponse>;

	// ===============================
	// INTERNAL
	// ===============================
	export type OrderInsert = typeof ordersTable.$inferInsert;

	export type OrderUpdate = Partial<
		Omit<OrderInsert, "id" | "dateCreated" | "dateUpdated">
	>;
}
