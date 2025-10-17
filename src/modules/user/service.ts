import { UserModel } from "./model.js";
import * as repository from "./repoistory.js";

export async function listUsers(
  query: UserModel.ListQuery
): Promise<UserModel.ListResponse> {
  const users = await repository.listUsers(query);

  return UserModel.listResponse.parse({ data: users });
}

export async function getUser(id: string): Promise<UserModel.DetailResponse> {
  const user = await repository.getUserById(id);

  if (!user) {
    throw new Error("User not found");
  }

  return UserModel.detailResponse.parse({ data: user });
}

export async function createUser(body: UserModel.CreateBody) {
  const user = await repository.createUser(body);

  return UserModel.createResponse.parse({ data: user });
}

export async function updateUser(
  id: string,
  body: UserModel.UpdateBody
): Promise<UserModel.DeleteResponse> {
  const user = await repository.updateUser(id, {
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: body.password,
    organizationId: body.organizationId,
  });

  if (!user) {
    throw new Error("User not found");
  }

  return UserModel.updateResponse.parse({ data: user });
}

export async function deleteUser(id: string) {
  const user = await repository.deleteUser(id);

  if (!user) {
    throw new Error("User not found");
  }

  return UserModel.deleteResponse.parse({ data: user });
}
