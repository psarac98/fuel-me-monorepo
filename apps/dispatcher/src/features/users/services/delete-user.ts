import { ApiPaths } from "@fuel-me/shared-types/api";
import type { AppEndpointBuilder } from "@/app/api";
import { pathWithParams } from "@fuel-me/shared-utils";

export default (builder: AppEndpointBuilder) =>
  builder.mutation<void, string>({
    query: (id) => ({
      url: pathWithParams(ApiPaths.deleteUser, { id }),
      method: "DELETE",
    }),
    invalidatesTags: (_result, _error, id) => [
      { type: "Users", id },
      { type: "Users", id: "LIST" },
    ],
  });
