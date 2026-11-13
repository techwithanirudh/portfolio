---
name: desloppify
description: Review or simplify code by deleting unnecessary layers, duplicate shapes, weak fallbacks, casts, mirrored state, and custom helpers that should use source-owned contracts. Use `review` during repository review; use implementation mode when explicitly asked to perform cleanup.
---

# Desloppify

Adapted from the desloppify skill in techwithanirudh/depensa. Apply the repo rules in `.claude/CLAUDE.md` first.

## Review Mode

Review without editing during the pass. Find:

- duplicate helpers, facades, wrappers, dispatch tables, and pass-through layers
- local types, mappers, assertions, and fallback shapes duplicating zod schemas, Fumadocs collections, Drizzle types, AI SDK types, or package exports
- broad casts and manual parsing that bypass an owned contract
- fallback shaping that hides invalid data the page depends on
- mirrored component state derivable from props, the URL, a server component, or a store
- misplaced logic (client code that belongs in a server component, a route handler, or `src/lib`), and unnecessary public exports
- large files whose responsibilities can be split by owner or feature

Return findings with the unnecessary concept, correct owner, deletion or simplification opportunity, behavior risk, and proof obligation. Do not edit or enter the cleanup workflow in review mode.

## Implementation Mode

1. Identify the owner of each fact or behavior.
2. Search for package-native helpers, schemas, exports, and local patterns.
3. Replace custom shapes or layers with the source-owned contract.
4. Inline thin wrappers when direct code is clearer; delete obsolete code in the same pass.
5. Preserve intentional duplication when it protects a real boundary (server and client, page and `(llms)` text that is generated from the same constants).
6. Re-run a deletion-only pass if the diff grows.

Do not add an abstraction unless it removes more code and concepts than it introduces. Do not move code only to reduce line count, import a runtime-heavy module only for a type, or convert trusted typed flow into repeated runtime validation. A cleanup never changes what a visitor sees or hears; if it would, stop and ask the owner.

## Prevention

Classify recurring findings:

- expressible syntax shape: a Biome rule, or a GritQL plugin when no rule covers it
- missing durable knowledge: a line in `.claude/CLAUDE.md`
- context-specific judgment: review only

The second recurrence of the same stable class should produce a low-noise mechanical guard rather than another prose rule.
