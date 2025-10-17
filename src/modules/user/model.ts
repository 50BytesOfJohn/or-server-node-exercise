import { z } from "@hono/zod-openapi";
import type { usersTable } from "../../db/schema.js";

export namespace UserModel {
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
    firstName: z.string().min(1).max(255).openapi({
      example: "John",
      description: "The first name of the user",
    }),

    lastName: z.string().min(1).max(255).openapi({
      example: "Doe",
      description: "The last name of the user",
    }),

    email: z.email().openapi({
      example: "john.doe@example.com",
      description: "The email address of the user",
    }),

    password: z.string().min(8).max(255).openapi({
      example: "securePassword123",
      description: "The password for the user account",
    }),

    organizationId: z.string().min(1).max(25).openapi({
      example: "org_ujp9HKOcQtk-Xt9jnJLc5",
      description: "The organization ID the user belongs to",
    }),
  });

  export type CreateBody = z.infer<typeof createBody>;

  export const updateBody = z.object({
    firstName: z
      .string()
      .min(1)
      .max(255)
      .openapi({
        example: "John",
        description: "The first name of the user",
      })
      .optional(),

    lastName: z
      .string()
      .min(1)
      .max(255)
      .openapi({
        example: "Doe",
        description: "The last name of the user",
      })
      .optional(),

    email: z
      .string()
      .email()
      .openapi({
        example: "john.doe@example.com",
        description: "The email address of the user",
      })
      .optional(),

    password: z
      .string()
      .min(8)
      .max(255)
      .openapi({
        example: "securePassword123",
        description: "The password for the user account",
      })
      .optional(),

    organizationId: z
      .string()
      .min(1)
      .max(25)
      .openapi({
        example: "org_ujp9HKOcQtk-Xt9jnJLc5",
        description: "The organization ID the user belongs to",
      })
      .optional(),
  });

  export type UpdateBody = z.infer<typeof updateBody>;

  // ===============================
  // PUBLIC
  // ===============================
  export const publicItem = z.object({
    id: z.string().openapi({
      example: "usr_ujp9HKOcQtk-Xt9jnJLc5",
      description: "The unique identifier for the user",
    }),

    firstName: z.string().openapi({
      example: "John",
      description: "The first name of the user",
    }),

    lastName: z.string().openapi({
      example: "Doe",
      description: "The last name of the user",
    }),

    email: z.string().openapi({
      example: "john.doe@example.com",
      description: "The email address of the user",
    }),
  });

  export type PublicItem = z.infer<typeof publicItem>;

  export const publicItemDetail = publicItem.extend({
    organizationId: z.string().openapi({
      example: "org_ujp9HKOcQtk-Xt9jnJLc5",
      description: "The organization ID the user belongs to",
    }),

    dateCreated: z.date().openapi({
      example: "2021-01-01T00:00:00.000Z",
      description: "The date the user was created",
    }),

    dateUpdated: z.date().openapi({
      example: "2021-01-01T00:00:00.000Z",
      description: "The date the user was last updated",
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
  export type UserInsert = typeof usersTable.$inferInsert;

  export type UserUpdate = Partial<
    Omit<UserInsert, "id" | "dateCreated" | "dateUpdated">
  >;
}
