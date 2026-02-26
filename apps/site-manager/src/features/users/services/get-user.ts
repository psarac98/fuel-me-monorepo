import { ApiPaths, type UserResponseDto } from "@fuel-me/shared-types/api";
import type { AppEndpointBuilder } from "@/app/api";
import { pathWithParams } from "@fuel-me/shared-utils";

export default (builder: AppEndpointBuilder) =>
  builder.query<UserResponseDto, string>({
    query: (id) => pathWithParams(ApiPaths.getUserById, { id }),
    providesTags: (_result, _error, id) => [{ type: "Users", id }],
  });
