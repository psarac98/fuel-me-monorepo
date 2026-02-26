import { ApiPaths, type UserResponseDto, type CreateUserDto } from "@fuel-me/shared-types/api";
import type { AppEndpointBuilder } from "@/app/api";

export default (builder: AppEndpointBuilder) =>
  builder.mutation<UserResponseDto, CreateUserDto>({
    query: (body) => ({
      url: ApiPaths.createUser,
      method: "POST",
      body,
    }),
    invalidatesTags: [{ type: "Users", id: "LIST" }],
  });
