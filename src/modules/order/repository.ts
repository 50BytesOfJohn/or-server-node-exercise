import { desc, eq, and } from "drizzle-orm";
import { db } from "../../db/index.js";
import { ordersTable } from "../../db/schema.js";
import { OrderModel } from "./model.js";

export async function listOrders(query: OrderModel.ListQuery) {
  const { page, limit, userId, organizationId } = query;

  const offset = (page - 1) * limit;

  let whereClause;
  if (userId && organizationId) {
    whereClause = and(
      eq(ordersTable.userId, userId),
      eq(ordersTable.organizationId, organizationId)
    );
  } else if (userId) {
    whereClause = eq(ordersTable.userId, userId);
  } else if (organizationId) {
    whereClause = eq(ordersTable.organizationId, organizationId);
  }

  return db.query.ordersTable.findMany({
    where: whereClause,
    limit: limit,
    offset: offset,
    orderBy: [desc(ordersTable.orderDate)],
  });
}

export async function createOrder(body: OrderModel.OrderInsert) {
  const [result] = await db
    .insert(ordersTable)
    .values({
      totalAmount: body.totalAmount,
      userId: body.userId,
      organizationId: body.organizationId,
    })
    .returning();

  return result;
}

export async function updateOrder(id: string, body: OrderModel.OrderUpdate) {
  const [result] = await db
    .update(ordersTable)
    .set({
      totalAmount: body.totalAmount,
      userId: body.userId,
      organizationId: body.organizationId,
      dateUpdated: new Date(),
    })
    .where(eq(ordersTable.id, id))
    .returning();

  return result;
}

export async function deleteOrder(id: string) {
  const [result] = await db
    .delete(ordersTable)
    .where(eq(ordersTable.id, id))
    .returning();

  return result;
}

export async function getOrderById(id: string) {
  return db.query.ordersTable.findFirst({
    where: eq(ordersTable.id, id),
    with: {
      user: {
        columns: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      organization: {
        columns: {
          id: true,
          name: true,
          industry: true,
          dateFounded: true,
        },
      },
    },
  });
}
