# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rules

- **No comments in code** unless the user explicitly asks for them. Do not add inline comments, JSDoc, or block comments to new or existing code.
- **Never run DB migrations** without asking the user for permission first. This includes `migration:run`, `migration:generate`, and `migration:revert`.
- **Never read, write, or modify `.env` files.** If you need env variable names, ask the user.
- **Always use `pnpm`** — never use npm, npx, or yarn.
- **Focus on the user's request** — avoid falling into fix-loops. If multiple quick fixes fail, stop and analyze the root cause.
- **Ask before significant refactoring** or creative solutions that go beyond the original request.

## Build & Development Commands

```bash
# Install dependencies
pnpm install

# Start all apps in dev mode (API on :4000, site-manager on :3000, dispatcher on :3001)
pnpm dev

# Build all packages
pnpm build

# Lint entire monorepo
pnpm lint

# Start PostgreSQL (required before running API)
docker compose up -d

# Run DB migrations (ASK USER FIRST)
pnpm --filter api typeorm migration:run -- -d src/data-source.ts

# Generate a new migration after entity changes (ASK USER FIRST)
pnpm --filter api typeorm migration:generate -- -d src/data-source.ts src/migrations/<MigrationName>

# Regenerate API types from OpenAPI schema (API must be running on :4000)
pnpm generate:api-types

# Run a script in a specific workspace
pnpm --filter <package-name> <script>
# e.g.: pnpm --filter api dev, pnpm --filter site-manager dev
```

## Project Overview

Fuel Me is a fleet/fuel management platform with a NestJS API backend, two React frontends (site-manager for admin users, dispatcher for dispatcher-role users), and shared packages for types, utilities, and UI components.

## Architecture

**Monorepo** using pnpm 10 workspaces + Turborepo 2. ESM everywhere except the API (CommonJS for NestJS compatibility).

### Apps

| App | Stack | Port | Purpose |
|-----|-------|------|---------|
| `apps/api` | NestJS 11, TypeORM 0.3, PostgreSQL 16 | 4000 | REST API backend |
| `apps/site-manager` | React 19, Vite 6, Redux Toolkit, Tailwind 4 | 3000 | Admin/site-manager frontend |
| `apps/dispatcher` | Same as site-manager (dark theme, orange accents) | 3001 | Dispatcher-role frontend |

### Packages

| Package | Import Path | Purpose |
|---------|------------|---------|
| `packages/shared-types` | `@fuel-me/shared-types` | Manual types (`src/index.ts`) |
| | `@fuel-me/shared-types/api` | Auto-generated OpenAPI types (`src/generated/api.d.ts`) |
| `packages/shared-utils` | `@fuel-me/shared-utils` | Utility functions (e.g., `pathWithParams`) |
| `packages/ui` | `@fuel-me/ui` | Shared React components (Button) |
| | `@fuel-me/ui/styles.css` | Theme tokens (colors, spacing, radius) |

### Type Generation Flow

NestJS Swagger decorators → OpenAPI JSON at `/docs-json` → `openapi-typescript` → `packages/shared-types/src/generated/api.d.ts` → consumed by frontend RTK Query endpoints.

After changing API DTOs/controllers: restart API, then run `pnpm generate:api-types`.

### Database

PostgreSQL 16 via Docker Compose (host port 5433 → container 5432). TypeORM entities extend `BaseEntity` (UUID PK, createdAt, updatedAt). User roles: `admin`, `dispatcher`, `driver`.

- `synchronize: false` — schema changes must go through migrations, never auto-sync.
- Entities are registered in `data-source.ts` and imported via `TypeOrmModule.forFeature()` in each module.

### Path Aliases

Both frontends use `@/*` → `src/*` via Vite resolve alias + TypeScript `paths` config.

## Coding Standards

### TypeScript

- Strict mode enabled across the monorepo (`tsconfig.base.json`)
- Target: ES2022, module resolution: bundler
- API uses CommonJS (`module: "commonjs"`) — everything else uses ESNext

### Swagger Documentation

Every controller endpoint must have:
- `@ApiOperation` with a concise but descriptive `summary` and a unique `operationId`
- `@ApiResponse` for every non-2xx status the endpoint can return (e.g., 400, 404, 409) with a short `description`

This ensures the generated OpenAPI schema is complete and the frontend auto-generated types are accurate.

### Validators Convention

Modules can optionally have a `<module>.validator.ts` file containing an `@Injectable()` class that handles database-level validation (uniqueness checks, referential integrity, etc.). Validators inject the TypeORM repository directly and throw NestJS HTTP exceptions (e.g., `ConflictException`, `BadRequestException`). Services inject the validator and call it before executing business logic.

### Frontend Feature Structure

Both frontends use feature-based architecture. Each feature is self-contained:

```
src/features/<domain>/
├── components/     # Components scoped to this feature only
├── routes/         # Route pages for this feature
├── services/       # RTK Query endpoint files
├── types/          # TypeScript types scoped to this feature
└── constants/      # Constants scoped to this feature
```

App-global code (`src/components/`, `src/services/`, `src/types/`, `src/constants/`) is used across multiple features within that app but is NOT shared cross-app. Cross-app sharing goes through `packages/`.

### Frontend API Pattern

Both frontends use RTK Query with a shared pattern:
1. `src/app/api.ts` defines the base API with `createApi` and tag types
2. `src/features/<domain>/services/` contains individual endpoint files
3. Each file exports a function that takes `AppEndpointBuilder` and returns endpoint config
4. `services/index.ts` calls `api.injectEndpoints()` to register all endpoints and exports hooks
5. Cache invalidation uses tag types (e.g., `"Users"` with `"LIST"` sentinel tag)

### Security

- Helmet enabled globally on the API for security headers
- ThrottlerGuard applied globally (60 req/60s)
- Global `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`
- CORS allows only `localhost:3000` and `localhost:3001`

## File Organization

```
fuel-me-monorepo/
├── apps/
│   ├── api/                    # NestJS backend
│   │   └── src/
│   │       ├── main.ts         # Bootstrap (helmet, validation, CORS, Swagger)
│   │       ├── app.module.ts   # Root module (throttler, TypeORM, feature modules)
│   │       ├── data-source.ts  # TypeORM config
│   │       ├── common/         # BaseEntity
│   │       ├── health/         # Health check endpoint
│   │       ├── users/          # Users module (entity, DTOs, controller, service, validator)
│   │       └── migrations/     # TypeORM migrations
│   ├── site-manager/           # Admin frontend
│   │   └── src/
│   │       ├── app/            # Base API, typed hooks
│   │       ├── store/          # Redux store config
│   │       ├── components/     # App-global components (not shared cross-app)
│   │       ├── services/       # App-global services
│   │       ├── types/          # App-global types
│   │       ├── constants/      # App-global constants
│   │       ├── routes/         # Route definitions
│   │       └── features/       # Feature modules (components, routes, services, types, constants)
│   └── dispatcher/             # Dispatcher frontend (same structure as site-manager)
├── packages/
│   ├── shared-types/           # Manual + generated TypeScript types
│   ├── shared-utils/           # Pure utility functions
│   └── ui/                     # Shared React components + theme tokens
├── docker-compose.yml          # PostgreSQL 16
├── turbo.json                  # Turborepo task config
├── tsconfig.base.json          # Shared TS config
└── eslint.config.js            # ESLint flat config
```

## Common Tasks

### Adding a New API Module

1. Create folder `apps/api/src/<module>/`
2. Create entity extending `BaseEntity`, register in `data-source.ts`
3. Create DTOs with `class-validator` decorators and `@ApiProperty()` on response DTOs
4. Create controller with `@ApiTags`, `@ApiOperation`, `@ApiResponse` on every endpoint
5. Create service with business logic
6. Optionally create `<module>.validator.ts` for database-level validation
7. Create module, register entity via `TypeOrmModule.forFeature()`, add to `app.module.ts`
8. Ask user to generate and run migration
9. Restart API, run `pnpm generate:api-types`

### Adding Frontend Features

1. Create `src/features/<domain>/services/` in the target frontend app
2. Create individual endpoint files following the `AppEndpointBuilder` pattern
3. Create `index.ts` that injects endpoints and exports hooks
4. Import types from `@fuel-me/shared-types/api`
5. Use `pathWithParams` from `@fuel-me/shared-utils` for URL template substitution

### Adding a Shared UI Component

1. Create component in `packages/ui/src/`
2. Export from `packages/ui/src/index.ts`
3. Use theme tokens from `styles.css` (e.g., `bg-fuel-orange`, `rounded-btn`)
4. Import in frontends via `import { Component } from "@fuel-me/ui"`

### Adding Database Changes

1. Modify entity files in `apps/api/src/<module>/`
2. Update `data-source.ts` entities array if new entity
3. Ask user for permission to generate migration: `pnpm --filter api typeorm migration:generate -- -d src/data-source.ts src/migrations/<MigrationName>`
4. Ask user for permission to run migration: `pnpm --filter api typeorm migration:run -- -d src/data-source.ts`
5. If either command fails, ask the user for help — do not attempt to fix it yourself
