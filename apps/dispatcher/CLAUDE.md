# Dispatcher — CLAUDE.md

Frontend-specific guidance for `apps/dispatcher` (React 19 + Vite 6).

## Commands

```bash
pnpm --filter dispatcher dev      # Start dev server (port 3001)
pnpm --filter dispatcher build    # Type-check + Vite build
pnpm --filter dispatcher preview  # Preview production build
```

## Stack

Same as site-manager: React 19, Vite 6, Redux Toolkit + RTK Query, Tailwind CSS 4.

- Path alias: `@/*` → `src/*`
- Vite proxies `/api` → `http://localhost:4000`

## Key Difference from Site Manager

**Dark theme with orange accents.** The code structure, RTK Query patterns, and feature architecture are identical to site-manager — only the UI styling differs:

- Background: `bg-slate-900` (dark)
- Cards: `bg-slate-800`
- Items: `bg-slate-700`
- Text: `text-white`, `text-slate-400`
- Accents: `bg-orange-400`, `bg-orange-900`, `text-orange-300`
- Uses `Button variant="secondary"` by default

## App Structure

Same architecture as site-manager. See `apps/site-manager/CLAUDE.md` for the full RTK Query pattern, cache invalidation strategy, and import conventions.

```
src/
├── main.tsx
├── app.tsx
├── styles.css
├── app/
│   ├── api.ts
│   └── hooks.ts
├── store/
│   └── index.ts
├── components/             # Global components (app-specific, not shared)
├── services/               # Global services (app-specific)
├── types/                  # Global types (app-specific)
├── constants/              # Global constants (app-specific)
├── routes/                 # Global route definitions
└── features/
    └── <domain>/
        ├── components/     # Feature-scoped components
        ├── routes/         # Feature-scoped route pages
        ├── services/       # RTK Query endpoints
        ├── types/          # Feature-scoped types
        └── constants/      # Feature-scoped constants
```
