# No-comments pass 2 (slopradar-cleanup)

Local only: nothing was committed, pushed, stashed or switched.

## Scope

Every `.ts`, `.tsx` and `.css` file under `src/`, `emails/` and `scripts/` in the union of `git diff --name-only origin/main...HEAD`, `git diff --name-only HEAD` and the untracked files, minus `rig-art.ts`, `.source/`, `content/` and `plans/`. That is 434 files.

## Counts

Same method as pass 1: a TypeScript AST walk (leading and trailing comment ranges, plus `{/* */}` in JSX) and a string-masked regex for CSS.

| | Comment nodes | Comment lines |
| --- | --- | --- |
| Before | 315 | 382 |
| After | 302 | 366 |
| Removed | 13 | 16 |

13 comments were deleted and 1 was cut down, across 12 files. Pass 1 had already left this scope at 314 nodes, so most of the new churn (message bubbles, chat tool rows, fullscreen navigation, the hook refactor, the two new scripts) arrived with few comments, and the ones it brought were mostly browser or library notes worth keeping.

No `TODO`, `FIXME`, `@ts-ignore`, `@ts-expect-error` or `eslint-disable` remain in scope.

## Deleted (13)

| File | Comment | Why |
| --- | --- | --- |
| `scripts/check-portrait.tsx` | One line per tag with sorted attributes... | Restates `canonical` |
| `scripts/hero-gradient-avif.ts` | The widths hero.tsx lists in its AVIF srcset | Unenforced coupling, see MUST KILL |
| `src/app/(auth)/account/_components/account-logout-button.tsx` | A 429 already has its own toast from the auth client | Our-code surprise, see MUST KILL |
| `src/app/(home)/guestbook/_components/reactions.tsx` | Signed out, they stay out of the tab order... | Restates `disabled` plus `focusableWhenDisabled={canReact}` |
| `src/app/api/chat/utils/tools/render-portfolio.ts` | JSDoc on `buildSpec` (3 lines) | Private function. The body shows that only `type`, `props` and `children` are copied |
| `src/app/api/chat/utils/tools/render-portfolio.ts` | Each element renders once... | Restates the `visited` check |
| `src/app/layout.tsx` | Only the home footer and the About captions use it... | Lists where Caveat is used, which goes stale |
| `src/app/layout.tsx` | Rendered on the server so the env schema... stays out of the client bundle | Constraint comment, see below |
| `src/components/features/assistant/mascot/hooks.ts` | One effect so the order is fixed... | Constraint comment. The single effect already shows the order |
| `src/components/features/assistant/panel.tsx` | Mounted while fullscreen or as a sheet... | Restates `LeaveOnRouteChange` and its effect |
| `src/server/db/queries/guestbook.ts` | Removes the viewer's reaction when it exists, otherwise adds it | Restates `toggleGuestbookEntryReaction` |
| `src/styles/globals.css` | Fades the last 6rem of an element out (the experience timeline's rail) | Restates `mask-fade-bottom` and says where it is used |
| `src/types/social.ts` | Leave it off the printed resume | Restates `hideOnResume` |

Trimmed: `src/constants/portfolio/uses.ts` `codingSetup` now reads "Plain text with `[label](href)` links". The "shared by the page and the llms routes" clause listed callers, so it was cut.

## Kept, by reason (302 nodes)

Pass 1's categories still hold. I re-read every kept comment against the code around it.

- **Browser or library quirk, or a magic number (about 182):** new ones in this pass include the `text/event-stream` charset note in `api/chat/route.ts`, the `connection()` reason in `search/page.tsx`, the Lenis remount in `tools/navigate.tsx`, the Base UI focus-return notes in `panel.tsx` and `sign-in-modal.tsx`, the Firefox popstate timing in `hash-link-history.tsx`, the Next WebP and Turbopack AVIF note in `hero.tsx`, the GitHub payload quirk in `feed/event.tsx`, and the `--lid`, gaze and cycle numbers in the mascot files.
- **JSDoc for an exported API or prop contract (about 88):** for example `site-path.ts`, `catalog.ts`, `employment-period.ts`, `pagination.ts`, `error-message.ts`, the mascot controller methods and the prop docs.
- **Credit, attribution or licence (24 nodes):** braydoncoyer.dev (`story`, `story-track`, `experience-rail`, `post-filters`, `post-row`, `blog/[slug]/_components/header.tsx`), Kibo UI, chanhdai (`icon-swap`, `copy-state-icon`, `ui/command.tsx`, `search/footer.tsx`), fumadocs-ui (`layout/header`, `toc/popover`, `is-active`), Delba de Oliveira (`blur-image`), and the AI Elements slice in `prompt-input.tsx`.
- **Lint suppressions with a reason (9):** `biome-ignore` in `scripts/hero-gradient-avif.ts` (still needed, because `sharp` is not declared in `package.json`), `mermaid.tsx` (2), `rig.tsx` (2), `json-ld.tsx` and `message-list.tsx` (2). There are also two `react-doctor-disable-next-line` lines, in `prompt-input.tsx` and `ui/carousel.tsx`. The rules they silence are about preferred patterns, not correctness, and each reason names a real library constraint (streamed submit, Embla's api).
- **Issue link (1):** `auth-client.ts` links better-auth#1391.

## Code changes

None. Only comment lines were edited. None of the deleted comments named a workaround that could be removed with identical behaviour. The two candidates (the 429 skip and the duplicated AVIF widths) need a reshape, so they are listed under MUST KILL instead.

## MUST KILL

- `src/app/(auth)/account/_components/account-logout-button.tsx`, `error.status !== 429`: the caller hides its own error because `authClient`'s `fetchOptions.onError` in `src/lib/auth-client.ts` already shows a toast for 429. Two places split ownership of the rate-limit toast. Return a typed "already reported" flag from the client, or move the 429 handling into one place.
- `scripts/hero-gradient-avif.ts` `widths` and `src/app/(home)/_components/hero.tsx` `gradientAvifSet`: the same six widths are written out by hand in both files. Export one `HERO_AVIF_WIDTHS` and build the script loop from it. A small check could also assert that every width has a file in `public/images/hero-gradient/`.

## Constraints found (unenforced, open)

- `src/app/layout.tsx` `<Analytics />` must stay a server component so the env schema and zod stay out of the client bundle. To enforce it, add `import 'server-only'` to the Analytics module so a client import fails the build. That needs approval.
- `src/components/features/assistant/mascot/hooks.ts`: the controller calls must run in the order activity, then greeting or settle, then away. The single effect enforces this today, but nothing stops someone from splitting it again. To enforce it, move the sequence into one controller method that takes `{ activity, open, away }`, which pass 1 also suggested.

## Verification

- `bunx tsc --noEmit -p .`: exit 0.
- `bunx biome check` over the 12 touched files plus the 4 other files with suppressions: no diagnostics.
- `bun run check:spelling`: exit 0.
- `bun run doctor`: no issues, score 100.
- No `next build` was run, and no processes were touched.

## Open items

1. The two MUST KILL reshapes above.
2. The two constraint encodings above.
3. From pass 1, still open: the `testimonials.tsx` pause-state reshape, and the portrait SVG check. `scripts/check-portrait.tsx` now exists, so that one may be done; whether it runs in `check` was not verified here.
