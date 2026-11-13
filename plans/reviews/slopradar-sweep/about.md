# Slopradar sweep: about

Scope: `src/app/(home)/about/**` except `_components/hero.tsx`. 4 markers in scope; all removed. Plus the dedicated `story-track.tsx` cleanup (below).

## Fixed (0 markers)

None of the 4 markers was safe to fix inside this scope; see below. The story-track cleanup is reported in its own section.

## Judged not worth it

- `src/app/(home)/about/_components/stack.tsx:64`, duplicate-logic (ThemedImage pair): the fix needs a new shared component plus edits to `uses/_components/logo.tsx` and `uses/_components/coding.tsx` (another agent's scope), and each copy carries different classes and sizes; leave for a coordinated pass, not a single-scope cleanup.
- `src/app/(home)/about/_components/feed/data.ts:60`, unchecked-cast (event payloads): Octokit types `payload` as one loose shape that is not keyed by `event.type`, so a "typed payload map" would just move the same casts into one place, and a zod schema per event would add runtime parsing that could quietly drop events the feed shows today. Not worth the risk for no change in what the code guarantees.

## Needs owner decision

- `src/app/(home)/about/_components/feed/event.tsx:117`, duplicate-logic: `describePullRequest` builds its own title fallback (`title` / `pull request #N` / `a pull request`) instead of using `pullRequestLabel(payload)`. Swapping changes the visible wording (for example, a titled PR would read "pull request Title (#12)" instead of "Title"). Proposal: decide which wording the feed should use, then make both paths call `pullRequestLabel`.
- `src/app/(home)/about/_components/feed/data.ts:91`, deprecated-api: `unstable_cache` (x2 in this file). Moving to `'use cache'` needs `cacheComponents` turned on in `next.config.ts`, which changes caching and prerendering across the whole app. Same marker exists in `src/server/db/queries/guestbook.ts`, `src/lib/github-*.ts`. Proposal: migrate all of them together in one change that turns on `cacheComponents`.

## Deferred (fumadocs files)

None; no file in scope imports fumadocs.

## story-track.tsx (dedicated)

`src/app/(home)/about/_components/story-track.tsx`, inlined single-use names that carried no meaning:
- `CORNER_RADIUS` (16) inlined into the `Math.min` that sets `radius`.
- `MARKER_SELECTOR` inlined (used once). `LANE_SELECTOR` kept (used twice).
- `TRACK_START_Y` (-4) inlined, with a one-line comment for the bare number.
- `spring` options object inlined into `useSpring(...)` (same values: damping 20, mass 0.5, stiffness 100).
- `id` + `` grooveId = `${id}-groove` `` collapsed to `const grooveId = useId()` (only the generated filter id string changes; it is never shown and the `url(#...)` reference uses the same variable).
- `const unsubscribe = progress.on(...); return () => unsubscribe()` became `return progress.on('change', follow)`.
- The two `{track ? <svg/> : null}` blocks became one `{track ? <>…</> : null}`; the DOM is identical.
Kept: `layoutOffsetWithin` (used twice), `roundedPath`, `traceTrack`, `markerProgress` (named algorithms), `svgClassName` (used by both SVGs), `smoothProgress` (`useSpring` must run every render, so it can't move into the ternary).

Scroll-fill verification (`scratchpad/about-track/track.cjs`, Playwright headless shell, 1440x900): scrolls to 0/25/50/75/100% of the track (offset 'start center' to 'end center'), waits for the spring to settle, records the fill path's computed `stroke-dasharray`/`stroke-dashoffset`/`transform`/`clip-path`/opacity, path `d`, SVG size/viewBox/classes, filter attributes, marker circle classes and positions, and the `data-reached` state of each row, then screenshots the viewport. The pass runs at 1440 wide, resized to 1100, and resized back to 1440, under both `reducedMotion: no-preference` and `reduce`, for 30 states in all.
- Values: before vs after, all 30 states identical. Fill dasharray 0.06625 (top of page, clamped) / 0.25 / 0.5 / 0.75 / 1; transform none; clip none; reached rows 1/1/3/4/5; SVG 1278x2400 (1022x2400 at 1100).
- Screenshots: the original file was restored briefly for a clean "before2" run, under the same conditions as "after2" (the dev overlay and Simba hidden). 29/30 are pixel-identical. The one difference is the hero portrait blinking (`hero.tsx`, not this file).
- Spring vs reduced motion (`spring.cjs`, samples the dasharray each frame after jumping to 50%): no-preference eases in (…0.386, 0.435, 0.464, 0.480…), the same curve before and after; reduce snaps straight to 0.5 in both.
- Full-page about shots (`shots.cjs` limited to /about) vs `base-about-*`: 1440 light/dark and 390 light are pixel-identical; 390 dark differs only where the baseline had the Next dev "1 Issue" badge.

## Verification

- `grep -rn "TODO(slopradar)" src/app/(home)/about` (excluding hero.tsx): none left.
- `bunx tsc --noEmit`: pass.
- `bunx biome check src/app/(home)/about`: clean. `bun run check`: 2 format errors, both outside this scope (`src/app/(home)/colophon/page.tsx`, `src/components/layout/sections/separator.tsx`).
- `bun run check:spelling`: 1 error outside this scope (`src/app/api/chat/snapshot-tmp/route.ts:38` "blogg").
- Note: `about/_components/stack.tsx` was also edited by someone else during the sweep (`stackIntro` import); left as is.
