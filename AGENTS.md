# AGENTS.md

This file is for coding agents working in this repo.
Follow these conventions unless a task says otherwise.

## Scope
- Applies to the entire repository.
- No additional AGENTS.md files found.
- No Cursor rules found in `.cursor/rules/` or `.cursorrules`.
- No Copilot rules found in `.github/copilot-instructions.md`.

## Repo overview
- Next.js 16 app router project in `src/app`.
- TypeScript is strict (`tsconfig.json` enables `strict`).
- Styling is Tailwind CSS + `tailwind-merge` + `class-variance-authority`.
- Content is MDX in `content/` and Fumadocs tooling is used.
- Database tooling uses Drizzle (`drizzle.config.ts`).
- Email templates use `react-email` (`emails/`).

## Project structure
- Route groups live under `src/app/(home)` and `src/app/(auth)`.
- API-like routes use `route.tsx` (for example under `src/app/og`).
- Page-specific components live in `_components` folders near pages.
- Shared layout and providers live in `src/app/layout.tsx` and `src/app/provider.tsx`.
- Shared UI primitives live in `src/components/ui`.
- Site sections live in `src/components/sections`.
- Reusable utilities live in `src/lib`.
- Hooks live in `src/hooks`.
- MDX layout and docs helpers live in `src/components` and `source.config.ts`.
- Public assets live in `public/` and are imported with `@/public/*`.
- Email templates live in `emails/`.
- Local scripts live in `scripts/`.

## Install
- `pnpm install`
- `pnpm postinstall` runs `fumadocs-mdx` automatically.

## Dev/build commands
- `pnpm dev` - start Next dev server (turbopack).
- `pnpm build` - production build.
- `pnpm start` - start production server.
- `pnpm preview` - build then start.
- `pnpm email:dev` - react-email dev server on port 3001.
- `pnpm email:build` - build email templates.
- `pnpm email:export` - export emails.

## Lint/format/check
- `pnpm format` - Biome format (write).
- `pnpm lint` - run link checker + Biome lint.
- `pnpm lint:write` - Biome lint with fixes.
- `pnpm lint:unsafe` - Biome lint with unsafe fixes.
- `pnpm check` - Biome check (lint + format + imports).
- `pnpm check:write` - Biome check with fixes.
- `pnpm check:unsafe` - Biome check with unsafe fixes.
- `pnpm exec tsx scripts/lint.mts` - link validation only.

## Database
- `pnpm db:generate` - generate migrations.
- `pnpm db:migrate` - run migrations.
- `pnpm db:push` - push schema.
- `pnpm db:studio` - open Drizzle Studio.
- `./start-database.sh` - local DB helper script.

## Tests
- No Jest/Vitest/Playwright test runner configured.
- Use `pnpm lint` or `pnpm check` for CI-style validation.
- For targeted checks, run Biome on a single file (below).

## Single-file or targeted checks
- `pnpm exec biome format --write path/to/file.tsx`
- `pnpm exec biome lint path/to/file.tsx`
- `pnpm exec biome check path/to/file.tsx`
- `pnpm exec biome check src` for a directory.
- Link checker has no single-file mode; it scans `content/**/*.mdx`.

## Code style essentials
- Formatting is enforced by Biome; run `pnpm format` or `pnpm check`.
- Indentation: 2 spaces.
- Quotes: single quotes for JS/TS and JSX.
- Semicolons: always.
- Organize imports is enabled (Biome).
- Avoid unused imports; Biome treats these as errors.

## Imports and module boundaries
- Use ESM imports/exports (repo is `type: module`).
- Prefer `type` imports for types (`import type { Foo } from '...'`).
- Use the `@/` alias for `src/*` paths.
- Use `@/public/*` for assets under `public/`.
- Use relative imports for same-folder modules.

## TypeScript conventions
- Keep `strict` mode compatible.
- `noUncheckedIndexedAccess` is enabled; guard optional lookups.
- `verbatimModuleSyntax` is enabled; keep type/value imports explicit.
- Use explicit return types for exported helpers when helpful.
- Favor `const` and `readonly` data where possible.
- Avoid `any`; use `unknown` + narrowing instead.
- Use `zod` schemas for validation in `src/lib/validators`.

## React/Next.js conventions
- App router pages live in `src/app/**/page.tsx`.
- Layouts live in `src/app/**/layout.tsx`.
- Use `'use client'` only when needed for hooks/state.
- Client-only files may use `.client.tsx` naming.
- Components are mostly function components.
- Prefer named exports; default exports reserved for Next pages/layouts.
- Use `React.ComponentProps<'element'>` for wrapper props.
- Colocate page-specific components in `_components` folders.
- Prefer server components and server data fetching by default.
- Keep metadata in `layout.tsx` or `page.tsx` using `createMetadata`.

## Styling conventions
- Tailwind CSS for styling.
- Use `cn()` from `src/lib/utils.ts` to combine classes.
- Use `cva()` for variant-based components.
- Keep Tailwind classes sorted; Biome warns on unsorted classes.
- For conditional class names, pass to `cn()` or `clsx`.
- Avoid manual string concatenation for class lists.
- Use `tailwind-merge` semantics through `cn()`.

## Error handling
- Server actions use `next-safe-action` with `ActionError`.
- Throw `ActionError` for expected failures with user-facing messages.
- Prefer early returns and explicit error messages.
- For server errors, return `DEFAULT_SERVER_ERROR_MESSAGE` when unsure.
- Log unexpected errors with `console.error` (see `src/lib/safe-action.ts`).
- Avoid swallowing errors; rethrow or surface via action errors.

## Naming conventions
- Components: `PascalCase` (files and exports).
- Hooks: `useX` naming in `src/hooks`.
- Utility functions: `camelCase`.
- Constants: `camelCase` unless globally reused; no all-caps unless necessary.
- Files and folders: `kebab-case` or Next.js conventions (`page.tsx`).

## Content and data
- MDX content lives in `content/` and is used by Fumadocs.
- When adding content, keep frontmatter consistent with existing files.
- Use `remark`/`rehype` plugins configured by Fumadocs.
- Blog and project data helpers live in `src/lib/source`.
- `scripts/lint.mts` validates links in MDX content.

## Misc
- Run `pnpm check` before large refactors.
- Keep changes minimal and scoped to the task.
