import { z } from "@hono/zod-openapi";
import type { organizationsTable } from "../../db/schema.js";

export namespace OrganizationModel {
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
  });

  export type ListQuery = z.infer<typeof listQuery>;

  export const createBody = z.object({
    name: z.string().min(1).max(255).openapi({
      example: "Acme Inc.",
      description: "The name of the organization",
    }),

    industry: z.string().min(1).max(255).openapi({
      example: "Technology",
      description: "The industry of the organization",
    }),

    dateFounded: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Date must be in YYYY-MM-DD format",
      })
      .refine((dateString) => new Date(dateString) <= new Date(), {
        message: "Date founded cannot be in the future",
      })
      .openapi({
        example: "2021-01-01",
        description:
          "The date the organization was founded in YYYY-MM-DD format. Cannot be in the future",
      }),
  });

  export type CreateBody = z.infer<typeof createBody>;

  export const updateBody = z.object({
    name: z
      .string()
      .min(1)
      .max(255)
      .openapi({
        example: "Acme Inc.",
        description: "The name of the organization",
      })
      .optional(),

    industry: z
      .string()
      .min(1)
      .max(255)
      .openapi({
        example: "Technology",
        description: "The industry of the organization",
      })
      .optional(),

    dateFounded: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Date must be in YYYY-MM-DD format",
      })
      .transform((dateString) => new Date(dateString))
      .refine((date) => date <= new Date(), {
        message: "Date founded cannot be in the future",
      })
      .openapi({
        example: "2021-01-01",
        description:
          "The date the organization was founded in YYYY-MM-DD format. Cannot be in the future",
      })
      .optional(),
  });

  export type UpdateBody = z.infer<typeof updateBody>;

  // ===============================
  // PUBLIC
  // ===============================
  export const publicItem = z.object({
    id: z.string().openapi({
      example: "org_ujp9HKOcQtk-Xt9jnJLc5",
      description: "The unique identifier for the organization",
    }),

    name: z.string().openapi({
      example: "Acme Inc.",
      description: "The name of the organization",
    }),

    industry: z.string().openapi({
      example: "Technology",
      description: "The industry of the organization",
    }),
  });

  export type PublicItem = z.infer<typeof publicItem>;

  export const publicItemDetail = publicItem.extend({
    dateFounded: z.string().openapi({
      example: "2021-01-01",
      description: "The date the organization was founded",
    }),

    dateCreated: z.date().openapi({
      example: "2021-01-01",
      description: "The date the organization was created",
    }),

    dateUpdated: z.date().openapi({
      example: "2021-01-01",
      description: "The date the organization was updated",
    }),
  });

  export type PublicItemDetail = z.infer<typeof publicItemDetail>;

  // ===============================
  // RESPONSE
  // ===============================
  export const listResponse = z.object({
    data: z.array(publicItem),
  });

  export type ListResponse = z.infer<typeof listResponse>;

  export const detailResponse = z.object({
    data: publicItemDetail,
  });

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
  export type OrganizationInsert = typeof organizationsTable.$inferInsert;

  export type OrganizationUpdate = Omit<
    OrganizationInsert,
    "id" | "dateCreated" | "dateUpdated"
  >;
}
