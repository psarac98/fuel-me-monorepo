import { ApiPaths } from "@fuel-me/shared-types/api";
import type { HealthCheckResponse } from "@fuel-me/shared-types";
import { api, type AppEndpointBuilder } from "@/app/api";

const getHealth = (builder: AppEndpointBuilder) =>
  builder.query<HealthCheckResponse, void>({
    query: () => ApiPaths.healthCheck,
  });

const healthApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHealth: getHealth(builder),
  }),
});

export const { useGetHealthQuery } = healthApi;
