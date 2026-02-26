# Site Manager — CLAUDE.md

Frontend-specific guidance for `apps/site-manager` (React 19 + Vite 6).

## Commands

```bash
pnpm --filter site-manager dev      # Start dev server (port 3000)
pnpm --filter site-manager build    # Type-check + Vite build
pnpm --filter site-manager preview  # Preview production build
```

## Stack

- React 19 with Vite 6
- Redux Toolkit + RTK Query for state and API calls
- Tailwind CSS 4 via `@tailwindcss/vite` plugin
- Path alias: `@/*` → `src/*`
- Vite proxies `/api` → `http://localhost:4000`

## App Structure

```
src/
├── main.tsx                # Entry point (React root + Redux Provider)
├── app.tsx                 # Root component
├── styles.css              # Imports @fuel-me/ui/styles.css
├── app/
│   ├── api.ts              # RTK Query base API (createApi, tag types)
│   └── hooks.ts            # Typed Redux hooks (useAppDispatch, useAppSelector)
├── store/
│   └── index.ts            # Redux store (configureStore + RTK Query middleware)
├── components/             # Global components used across features (app-specific, not shared)
├── services/               # Global services used across features (app-specific)
├── types/                  # Global TypeScript types (app-specific)
├── constants/              # Global constants (app-specific)
├── routes/                 # Global route definitions
└── features/
    └── <domain>/
        ├── components/     # Feature-specific components (only used within this feature)
        ├── routes/         # Feature-specific route pages
        ├── services/       # RTK Query endpoint files
        ├── types/          # Feature-specific TypeScript types
        └── constants/      # Feature-specific constants
```

### Global vs Feature vs Shared Package

- **`packages/ui`** — shared across ALL apps (site-manager + dispatcher). Reusable UI primitives.
- **`src/components/`, `src/services/`, etc.** — global to this app, used across multiple features but NOT shared with other apps.
- **`src/features/<domain>/components/`, etc.** — scoped to a single feature. Not imported outside that feature.

## RTK Query Pattern

### Base API (`src/app/api.ts`)

Defines `createApi` with `fetchBaseQuery({ baseUrl: "/api" })` and tag types. Endpoints are empty here — they're injected from feature services.

Exports `AppEndpointBuilder` type for strongly-typed endpoint definitions.

### Feature Services (`src/features/<domain>/services/`)

Each CRUD operation is a separate file:

```typescript
// get-users.ts
export const getUsers = (builder: AppEndpointBuilder) =>
  builder.query<UserResponseDto[], void>({
    query: () => ApiPaths.getUsers,
    providesTags: (result) =>
      result
        ? [...result.map(({ id }) => ({ type: "Users" as const, id })), { type: "Users", id: "LIST" }]
        : [{ type: "Users", id: "LIST" }],
  });
```

### Service Index (`services/index.ts`)

Injects all endpoints via `api.injectEndpoints()`, exports hooks and re-exports types:

```typescript
export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: getUsers(builder),
    createUser: createUser(builder),
    // ...
  }),
});

export const { useGetUsersQuery, useCreateUserMutation } = usersApi;
```

### Cache Invalidation

- Queries provide tags: individual item tags + `"LIST"` sentinel
- Mutations invalidate: `"LIST"` for creates, both individual + `"LIST"` for updates/deletes
- Tag type names match the domain (e.g., `"Users"`)

## Imports

```typescript
// Shared types (cross-app)
import { ApiPaths, type UserResponseDto } from "@fuel-me/shared-types/api";

// Shared utils (cross-app)
import { pathWithParams } from "@fuel-me/shared-utils";

// Shared UI (cross-app)
import { Button } from "@fuel-me/ui";

// Local app imports use @ alias
import { api, type AppEndpointBuilder } from "@/app/api";
```

## Theme

Light theme. Uses theme tokens from `@fuel-me/ui/styles.css`:
- `bg-fuel-orange`, `text-fuel-dark`, `bg-fuel-light`, etc.
- Custom spacing: `spacing-18`, `spacing-88`, `spacing-128`
- Custom radius: `rounded-btn`, `rounded-card`
