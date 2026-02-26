import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  type FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

const TAG_TYPES = ["Users"] as const;

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: TAG_TYPES,
  endpoints: () => ({}),
});

export type AppEndpointBuilder = EndpointBuilder<
  BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, object, FetchBaseQueryMeta>,
  (typeof TAG_TYPES)[number],
  "api"
>;
