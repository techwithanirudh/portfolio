---
name: slopradar
description: "Repo-wide code-quality review: one reviewer agent per area annotates every rule violation as a TODO(slopradar) comment, then the findings are compiled into plans/reviews/SLOPRADAR.md and resolved. Use when the owner asks for a slopradar pass, a slop score, or a whole-codebase quality review."
disable-model-invocation: true
---

# Slopradar

Adapted from the slopradar skill in techwithanirudh/depensa.

A slopradar pass has three phases: annotate, compile, resolve. It measures code against this repo's own rules (`.claude/CLAUDE.md`, `biome.jsonc` and the comments that explain its parked rules) and the `desloppify` (review mode), `no-comments` and `ultracite` skills.

## Phase 1: annotate

Spawn one `general-purpose` agent per scope below, in parallel. Each gets the reviewer brief in `reviewer-brief.md`, with `{SCOPE}`, `{SKILLS}` and `{READS}` filled in from this table. Reviewers only add comments; they change no code.

| Scope | Skills after the standing ones | Extra reads |
| --- | --- | --- |
| `src/app` (routes, layouts, `api/`, `(llms)`, `og/`, metadata) | `vercel-react-best-practices`, `ai-sdk` | `node_modules/next/dist/docs` for any Next API in question, `src/app/(llms)` against the pages it describes |
| `src/components` except `ui/` | `vercel-composition-patterns`, `react-doctor`, `make-interfaces-feel-better` | `src/components/icons/icons.tsx`, `src/styles/globals.css` |
| `src/lib`, `src/server`, `src/hooks`, `src/contexts`, `src/constants`, `src/types`, `src/env.ts`, `src/styles` | `ai-sdk` | `src/server/db/schema/index.ts`, `src/env.ts` |
| `emails/`, `scripts/`, root config (`next.config.ts`, `source.config.ts`, `biome.jsonc`, `package.json`) | none | `package.json` scripts |

`src/components/ui` is shadcn/ui: review it only for local edits that should have been extensions, never for upstream style. `.source/` is generated and out of scope.

Every reviewer also reads `.claude/CLAUDE.md` and `biome.jsonc`.

## Phase 2: compile

Merge the reports into `plans/reviews/SLOPRADAR.md`: a score table per scope (slop 0 to 10, 10 worst, with the count of annotations), the cross-scope patterns, any contradictions inside the rulebook (these go to the owner as questions before cleanup, since every band would otherwise re-argue them), and per scope the systemic patterns, structural verdict, ordered cleanup bands, orphans, and what to keep. Verify every security finding in code before recording it.

## Phase 3: resolve

1. Owner decisions first. List each rulebook contradiction and each "change the code or change the rule" finding at the top of `SLOPRADAR.md` under "Owner decisions"; do not resolve those annotations until answered.
2. Resolve the rest band by band, each band one reviewable, behaviour-preserving change: fix, delete the `TODO(slopradar)` comment, log the row in `plans/reviews/SLOPRADAR-RESOLUTIONS.md` (file:line, rule, what changed, or why it was declined). A band never changes what a visitor sees or hears; anything that would is an owner decision.
3. Run independent verifier agents over the result. A verifier refutes: it checks each resolution against the rule and the code, and reports regressions. Accept a declined finding only with a written reason.
4. Done means `grep -rn "TODO(slopradar)" src emails scripts` returns nothing and `bun run typecheck`, `bun run check` and `bun run build` pass. Nothing is committed or pushed until the owner says so.

Follow with `no-comments` over the resolution diff, and `desloppify` last.

## Standing exceptions

These are owner decisions, not findings:
- The icon mix in `src/components/icons/icons.tsx` (Hugeicons by default, Lucide for arrows, chevrons, the paw and volume icons, Octicons for the GitHub feed) stays as is.
- `preventDefault` in `src/components/ai-elements/prompt-input.tsx` stays.
- `src/components/ui/carousel.tsx` is exempt from React Doctor findings.
