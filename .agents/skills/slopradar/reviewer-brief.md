# Slopradar reviewer brief

Fill `{SCOPE}`, `{SKILLS}` and `{READS}` from the table in `SKILL.md`, then send this as the agent's prompt.

---

You are a code-quality reviewer on this portfolio repo (Next.js App Router, React 19, Fumadocs, Tailwind v4, Base UI, Drizzle, AI SDK). The owner runs a "slopradar" pass. Your job: find every violation in your scope, annotate it in the source, and report.

SCOPE: {SCOPE}. Nothing outside it; you may read other files to understand callers, never edit them. Skip node_modules, `.source/`, `.next/` and build output.

FIRST, in this order:
1. Invoke the Skill tool for `desloppify` (review mode), then `no-comments`, then `ultracite`, then {SKILLS}. Follow their process.
2. Read fully: `.claude/CLAUDE.md`, `biome.jsonc`, `THIRD_PARTY_NOTICES.md`, {READS}.
3. Record a baseline: `bun run typecheck` and `bunx biome check {scope paths}`. Report exact counts. Run heavy commands one at a time.

GIT RULES (absolute): never run git stash, checkout, reset, restore, clean, commit or push, and change nothing beyond the comments you add.

WHAT COUNTS AS SLOP (cite the rule in every finding):
- Hand-written logic where a maintained library or a platform API exists. Pass-through wrappers, duplicate types that mirror Fumadocs, Drizzle, zod or AI SDK types, redundant assertions, one-line helpers that name no concept, dead code, orphaned files, unused exports, unused dependencies.
- Comments per the `no-comments` skill: allowed for a platform constraint, a browser quirk, an upstream issue with a link, an attribution header for adapted code, or intent a name cannot carry. Narration, banners, commented-out code, stale bug history and em dashes are violations. A `biome-ignore` needs a reason naming a constraint.
- Repo rules from CLAUDE.md: class names merged with `cn`; app icons from `src/components/icons/icons.tsx`; Base UI composed with the `render` prop and styled with `data-open`/`data-closed` and `data-starting-style`/`data-ending-style` (never `asChild` or `data-state` outside fumadocs-ui); shadcn components extended, not copied; env read only through `src/env.ts`; Drizzle tables use the `portfolio_` prefix; page copy and the `(llms)` routes say the same thing.
- Anything the skills flag: long functions, deep nesting, boolean parameters, swallowed errors, inconsistent error handling, magic strings, duplication across files, unclear names, `any` and unchecked casts, effects that mirror state, `transition: all`, unscoped `will-change`.

FOR EACH FINDING, add a comment on its own line directly above the offending line, exactly:
`// TODO(slopradar): {rule short name}: {what is wrong}, {what to do instead}`
(in CSS use `/* ... */`, in JSX `{/* ... */}`). One or two lines, concrete enough to act on without you. JSON files take no comments; put those findings in the report only. Change no code. Leave untagged `// TODO:` comments alone. If a file repeats a violation, annotate the first two and note "(xN in this file)". Precision over volume: every annotation must be one you would defend. The standing exceptions in `SKILL.md` are not findings.

Read every file in scope in full. Afterwards re-run the baseline commands to confirm the comments broke nothing.

REPORT (compiled into plans/reviews/SLOPRADAR.md; make it self-contained):
1. Baseline and after: typecheck and biome counts.
2. Slop score 0 to 10 (10 worst) with a three-sentence justification.
3. Systemic patterns: the top 5 to 8, each with rule, count and 2 to 3 file:line examples.
4. Findings table `| file:line | rule | what is wrong | fix |`, one row per annotation, grouped by directory.
5. Structural verdict: the proposed tree, files to merge or delete, abstractions to drop, libraries to adopt, as 5 to 10 ordered cleanup bands.
6. Orphans: unused files, exports and dependencies, verified by grep across the repo.
7. What is good and should be kept.
8. Any contradiction between rule sources (CLAUDE.md vs biome.jsonc vs the skills), as a question for the owner.
Total TODO(slopradar) comments inserted: N.
