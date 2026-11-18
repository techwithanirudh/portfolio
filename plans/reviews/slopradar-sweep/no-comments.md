# No-comments pass (slopradar-cleanup)

Local only: nothing was committed, pushed, stashed or switched.

## Scope

Every `.ts`, `.tsx` and `.css` file under `src/`, `emails/` and `scripts/` that this branch changes or adds. That is the union of `git diff --name-only main...HEAD`, `git diff --name-only HEAD` and the untracked files. Deleted files are left out, and so are `rig-art.ts`, `.source/`, `content/` and `plans/`. That leaves 436 files. None of them carry a generated-file header.

## Counts

Comments were counted with a TypeScript AST walk (`getLeadingCommentRanges`/`getTrailingCommentRanges`, which includes `{/* */}` in JSX) and a string-masked regex for CSS.

| | Comment nodes | Comment lines |
| --- | --- | --- |
| Before | 477 | 626 |
| After | 314 | 382 |
| Removed | 163 | 244 |

There are 73 touched files. In those files, 102 comment blocks were deleted outright, and 50 kept comments were cut down to one or two plain lines. No em dashes are left in any kept comment.

No `TODO(slopradar)`, `TODO`, `FIXME`, `@ts-ignore`, `@ts-expect-error` or `eslint-disable` remain in scope.

## Kept comment nodes, by reason (314)

- **Non-obvious browser or library quirk, or a magic number (190):** for example Safari 26 bar tinting, Firefox popstate timing, Base UI focus and scroll-lock behaviour, the fumadocs 460px cap, the React 500-byte streaming boundary, the WCAG contrast numbers in `globals.css`, Resend error shapes, Next output file tracing, and the SVG id scoping.
- **JSDoc that defines an exported API or prop contract (91):** for example `site-path.ts`, `catalog.ts`, `employment-period.ts`, `pagination.ts`, component prop docs and the units on `duration`.
- **Credit, attribution or licence (26):** braydoncoyer.dev (`shadow-box`, `story`, `story-track`, `experience-rail`, `post-filters`, `post-row`, and `header.tsx` under `blog/[slug]`), Kibo UI, chanhdai (`icon-swap`, `copy-state-icon`, `command.tsx`, `search/footer.tsx`), fumadocs-ui (`header`, `toc/popover`, `is-active`), Delba de Oliveira (`blur-image`), @web-kits/audio, and the AI Elements slice.
- **Lint suppressions with their reason (6):** `biome-ignore` in `mermaid.tsx` (2), `rig.tsx` (2), `json-ld.tsx` and `message-list.tsx`. Biome reports none of them as unused.
- **Issue link (1):** `auth-client.ts` links better-auth#1391.

## Deleted (102 blocks)

These comments restated code, described where a component is used, or recorded history ("the label above was dropped", "copy the rebrand's lists"). Most came from the narration in the mascot files (`constants`, `controller`, `hooks`, `use-sprite-frames`, `use-look`, `use-reading-eyes`, `rig`), the `render-portfolio.ts` step comments, and the assistant tool cards (`portfolio-row`, `portfolio-testimonial`, `portfolio-contributions`). The rest were "Decorative" `alt=''` notes and single lines like `Keep the 200 most recent renders`.

One deleted comment was wrong. `constants.ts` described `Embarrassed` as "The 404 page's loop: a curious tilt each way, then a think".

## Restored comments

None. No attribution comment was removed on this branch: `git diff main` has no removed credit, licence or adapted-from lines in scope.

The brief mentions a credit JSDoc in `post-index.tsx`. That file has never had one. Its only comment is a prop doc, which was kept. The braydoncoyer credits it may have meant are in `post-filters.tsx` and `post-row.tsx`, and both are kept.

## Code changes

None. Only comment lines changed: every edit is recorded with its old lines, and each was checked to be a comment line. No comment named a dead path or workaround that could be deleted.

## Constraints found (unenforced, open)

- `src/components/portrait/portrait-face.tsx` said "Inline copy of public/images/portrait.svg; change both together." The skill says to delete a constraint comment that isn't encoded, so it was deleted.
  - Encoding offer: a small `scripts/` check, run in `check`, that renders `PortraitFace` to static markup and compares the paths with `public/images/portrait.svg`. Or generate one from the other.
- `src/app/(home)/_components/hero.tsx`: the AVIF comment said to re-export the AVIFs from the PNG if it changes. That clause was dropped. The kept part explains why the AVIFs exist.
  - Encoding offer: a script that regenerates the AVIF set from the PNG (sharp, q80, the optimizer widths), so re-exporting is one command.

## MUST KILL (our-code surprises whose comment was deleted)

- `src/app/(home)/_components/testimonials.tsx` `paused`/`resumed`/`hovered`/`focused`: four booleans plus the `playing` expression encode one rule. The visitor's pause sticks, and hover or focus pauses only until they press play inside. It needs a comment to be read, so model it as one state value or a small reducer with named states.
- `src/components/features/assistant/mascot/hooks.ts`, in the hook that calls `useOn(activity, …)`, `useOn(open, …)` and the `setAway` effect: correctness depends on hook order. Activity must run before the greeting, and away must run after the greeting and settle. That order was only written down in the deleted comments. Make it explicit with a single effect that sequences the controller calls, or a controller method that takes the whole `{activity, open, away}` snapshot.

## Verification

- `bunx tsc --noEmit -p .`: exit 0.
- `bunx biome check` over the 73 touched files plus the 3 files with suppressions: 1 error and 1 info. Both predate this pass and neither is on a line it changed.
  - `emails/theme.ts:24`: the formatter wants single quotes on `fonts.sans`. This pass only edited line 129 of that file.
  - `src/components/features/assistant/panel.tsx:177`: a class-sort info on the Popup `className`.
  - Both are left alone, as unrelated reformatting.
- `bun run check:spelling`: exit 0.
- No `next build` was run, and the dev server on 3111 was not touched.

## Open items

1. The two MUST KILL refactors above.
2. The two constraint encodings above.
3. Pre-existing formatting in `emails/theme.ts:24` (one `bunx biome check --write emails/theme.ts`).
