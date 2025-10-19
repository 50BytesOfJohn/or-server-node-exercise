import { NotFoundError } from "../../errors/index.js";
import { OrderCache } from "./cache.js";
import { OrderModel } from "./model.js";
import * as repository from "./repository.js";

export async function listOrders(
	query: OrderModel.ListQuery,
): Promise<OrderModel.ListResponse> {
	const orders = await repository.listOrders(query);

	return OrderModel.listResponse.parse({ data: orders });
}

export async function getOrder(id: string): Promise<OrderModel.DetailResponse> {
	const order = await OrderCache.getById(id);

	if (!order) {
		throw new NotFoundError("Order not found");
	}

	return OrderModel.detailResponse.parse({ data: order });
}

export async function createOrder(body: OrderModel.CreateBody) {
	const order = await repository.createOrder({
		totalAmount: body.totalAmount.toString(),
		userId: body.userId,
		organizationId: body.organizationId,
	});

	return OrderModel.createResponse.parse({ data: order });
}

export async function updateOrder(
	id: string,
	body: OrderModel.UpdateBody,
): Promise<OrderModel.UpdateResponse> {
	const order = await repository.updateOrder(id, {
		totalAmount: body.totalAmount?.toString(),
		userId: body.userId,
		organizationId: body.organizationId,
	});

	if (!order) {
		throw new NotFoundError("Order not found");
	}

	OrderCache.invalidateById(id);

	return OrderModel.updateResponse.parse({ data: order });
}

export async function deleteOrder(id: string) {
	const order = await repository.deleteOrder(id);

	if (!order) {
		throw new NotFoundError("Order not found");
	}

	OrderCache.invalidateById(id);

	return OrderModel.deleteResponse.parse({ data: order });
}
