import { ApiPaths, type UserResponseDto } from "@fuel-me/shared-types/api";
import type { AppEndpointBuilder } from "@/app/api";

export default (builder: AppEndpointBuilder) =>
  builder.query<UserResponseDto[], void>({
    query: () => ApiPaths.getUsers,
    providesTags: (result) =>
      result
        ? [
            ...result.map(({ id }) => ({ type: "Users" as const, id })),
            { type: "Users", id: "LIST" },
          ]
        : [{ type: "Users", id: "LIST" }],
  });
