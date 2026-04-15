# Agent Guide

## Project Overview
- Next.js App Router portfolio site with Fumadocs content and MDX.
- TypeScript in strict mode with path aliases (`@/*`, `@/public/*`).
- Tailwind CSS (v4) with PostCSS, plus Radix UI and shadcn/ui components.
- Content lives in `content/` and Fumadocs-generated `.source/`.
- Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.

## Repo Layout
- `src/app`: App Router routes, layouts, and metadata.
- `src/components`: UI and layout components.
- `content/` and `.source/`: MDX collections and generated content.
- `emails/`, `scripts/`, `public/`: email templates, tooling, and static assets.

## Commands
- Install: `bun install`
- Dev/build: `bun dev`, `bun run build`
- Types: `bun run typegen`, `bun run typecheck`
- Lint: `bun run check` (fix: `check:write`, unsafe: `check:unsafe`)
- QA: `bun run check:links`, `bun run check:spelling`
- DB: `bun run db:generate`, `bun run db:migrate`, `bun run db:push`
- Email: `bun run email:dev`, `bun run email:build`, `bun run email:export`

## Testing
- No automated test runner is configured (no `test` script or test config files found).
- Single-test command: not available until a test runner is added.

## Philosophy

This codebase will outlive you. Every shortcut becomes someone else's burden. Every hack compounds into technical debt that slows the whole team down.

You are not just writing code. You are shaping the future of this project. The patterns you establish will be copied. The corners you cut will be cut again.

Fight entropy. Leave the codebase better than you found it.

## Editor Rules
- Cursor rules: none found in `.cursor/rules/` or `.cursorrules`.
- Copilot rules: none found in `.github/copilot-instructions.md`.

## Environment & Config
- Environment variables are validated in `src/env.ts` using `@t3-oss/env-nextjs` and `zod`.
- `next.config.ts` loads `src/env` at startup; keep env validation passing locally.
- Set `SKIP_ENV_VALIDATION=true` only for CI/build environments that cannot supply secrets.
- Server env includes database, Resend, auth providers, BotID, and GitHub/Google OAuth tokens.
- Client env uses `NEXT_PUBLIC_*` for analytics and base URL settings.

## Content & Docs
- Author content in `content/`; generated content lives in `.source/` (never edit by hand).
- `bun install` runs `fumadocs-mdx` via `postinstall` to sync MDX types.
- Prefer MDX frontmatter for metadata (title, description, dates).

## UI & Styling
- Tailwind CSS v4 with PostCSS; global tokens live in `src/styles/globals.css`.
- Prefer `cn` from `src/lib/utils.ts` to merge class names.
- App-level icons should be sourced via `src/components/icons/icons.tsx`; prefer Lucide for generic UI/app icons and keep non-Lucid/icon-specific SVGs centralized there when a different source is necessary.
- shadcn/ui components live in `src/components/ui`; extend them rather than copy/paste.
- Radix UI primitives are used for accessible overlays, menus, and form controls.

## Data & Email
- Drizzle schema lives in `src/server/db/schema/index.ts` and uses the `portfolio_*` table prefix.
- Use `bun run db:generate` after schema changes to regenerate migrations.
- Email templates live in `emails/` and are built/exported via the `email:*` scripts.
- Resend credentials are required for email functionality.
