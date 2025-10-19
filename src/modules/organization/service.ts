import { NotFoundError } from "../../errors/index.js";
import { OrganizationCache } from "./cache.js";
import { OrganizationModel } from "./model.js";
import * as repository from "./repository.js";

export async function listOrganizations(
	query: OrganizationModel.ListQuery,
): Promise<OrganizationModel.ListResponse> {
	const organizations = await repository.listOrganizations(query);

	return OrganizationModel.listResponse.parse({ data: organizations });
}

export async function getOrganization(
	id: string,
): Promise<OrganizationModel.DetailResponse> {
	const organization = await OrganizationCache.getById(id);

	if (!organization) {
		throw new NotFoundError("Organization not found");
	}

	return OrganizationModel.detailResponse.parse({ data: organization });
}

export async function createOrganization(body: OrganizationModel.CreateBody) {
	const organization = await repository.createOrganization(body);

	return OrganizationModel.createResponse.parse({ data: organization });
}

export async function updateOrganization(
	id: string,
	body: OrganizationModel.UpdateBody,
): Promise<OrganizationModel.DeleteResponse> {
	const organization = await repository.updateOrganization(id, {
		name: body.name,
		industry: body.industry,
		dateFounded: body.dateFounded,
	});

	if (!organization) {
		throw new NotFoundError("Organization not found");
	}

	OrganizationCache.invalidateById(id);

	return OrganizationModel.updateResponse.parse({ data: organization });
}

export async function deleteOrganization(id: string) {
	const organization = await repository.deleteOrganization(id);

	if (!organization) {
		throw new NotFoundError("Organization not found");
	}

	OrganizationCache.invalidateById(id);

	return OrganizationModel.deleteResponse.parse({ data: organization });
}
