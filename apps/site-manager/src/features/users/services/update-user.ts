import { ApiPaths, type UserResponseDto, type UpdateUserDto } from "@fuel-me/shared-types/api";
import type { AppEndpointBuilder } from "@/app/api";
import { pathWithParams } from "@fuel-me/shared-utils";

export type UpdateUserRequest = UpdateUserDto & { id: string };

export default (builder: AppEndpointBuilder) =>
  builder.mutation<UserResponseDto, UpdateUserRequest>({
    query: ({ id, ...body }) => ({
      url: pathWithParams(ApiPaths.updateUser, { id }),
      method: "PATCH",
      body,
    }),
    invalidatesTags: (_result, _error, { id }) => [
      { type: "Users", id },
      { type: "Users", id: "LIST" },
    ],
  });
