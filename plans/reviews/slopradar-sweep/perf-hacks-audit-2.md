# Perf hacks audit, round 2 (agent: perf-hacks-2)

This round looked further than round 1 for code that exists only for speed and could go back to plainer code. It covered src/, next.config.ts, package.json, the PR history (`git log origin/main..HEAD`, 23 commits) and the working tree.

Not covered: the items round 1 decided (perf-hacks-audit.md, perf-reverts.md), the hero LCP image, the reveal Motion component, the min-h-59 comments box, the 40px toolbar, Simba mascot timing, rig-art.ts, .source/, and the memos React Doctor requires.

How things were measured: production builds on port 3112 (17s per build). Lighthouse 13 mobile ran 5 times per page through `scratchpad/reveal-ab/lh.sh`, and the tables give the median. JS size is `cat .next/static/chunks/*.js | gzip -c | wc -c`. /guestbook timing came from `curl`, signed out: 5 warm requests, then 5 requests that each followed 30s of idle. The load average was 6.5 to 8 during the measurements.

## Candidates

| # | file:line | What it does | Simpler version | Lines | Perf cost of the simpler version | Verdict |
|---|---|---|---|---|---|---|
| 1 | src/components/features/assistant/input.tsx (`saveInput`) | Waits 300ms (`useDebounceCallback`) before saving the Simba draft to localStorage, and cancels the pending save on send | Call `writeSavedInput(value)` directly in the change handler | -5 | One `localStorage.setItem` per keystroke (microseconds). The draft is also kept if the panel closes within 300ms of the last keystroke | **Applied** |
| 2 | src/hooks/use-copy-to-clipboard.ts (`copy`) | `useCallback` around `copy` | Plain async function. The only caller (blog ShareMenu) passes inline `onCopySuccess`/`onCopyError`, so the deps changed on every render and the memo never held | -3 | None | **Applied** |
| 3 | src/components/blur-image.tsx (`fetchPriority`) | Derives `fetchPriority='high'` from `loading='eager'` (3 lines with comment) | Pass `loading` only | -3 | Measured, A/B below: blog cover LCP 4525 to 4316ms (noise), TBT +40ms, JS +1KB, CLS 0 | **Applied (A/B)** |
| 4 | src/app/(home)/about/_components/story.tsx:130 | `fetchPriority='high'` on the first story photo | `loading='eager'` only | -1 | Measured: the /about LCP element on mobile is a `<p>`, not the photo. LCP 8345 to 8159ms, TBT 647 to 656ms | **Applied (A/B)** |
| 5 | src/app/layout.tsx:32-34 | Caveat `preload: false` | Default preload | -2 | Measured: adds a 75KB Caveat woff2 at High priority to every page. Home LCP median 5121 to 5712ms (+590, with a mechanism behind it) | **Restored (kept)** |
| 6 | src/server/db/queries/guestbook.ts:17-117 plus 5 `updateTag` calls | Shared entries under `unstable_cache`, a separate viewer-reactions query, merged in JS | One query with `bool_or(userId = viewer)`, and `refresh()` in the actions | about -48 | Measured, follow-up (c): /guestbook warm 14 to 248ms total, after idle 41 to 752ms | **Restored (kept)** |
| 7 | src/app/(home)/_components/contributions.tsx:149-168 | Renders both block sizes and lets CSS (`md:hidden` / `hidden md:flex`) show one | `useMediaQuery` with one graph | about -8 | The hook swaps graphs after hydration on phones, which is a visible layout shift. The current version costs 4.6KB gzip of /about HTML (measured: 62.0KB to 57.4KB without the second graph) plus about 370 extra hydrated rects | Keep (fixes a visible shift) |
| 8 | src/styles/globals.css:86, search-client.tsx:59 and :260, guestbook skeleton.tsx:5 | `animate-delayed-show`: skeletons stay transparent for 200ms | Show skeletons at once | -4 | Not a speed hack. It stops skeleton flashes that users can see (speed.md items 4 and 5) | Keep |
| 9 | src/app/(home)/search/page.tsx:13 | `await connection()` makes /search dynamic so `useSearchParams` renders on the server | Static page with Suspense and a fallback | +10 | The current code is already the simpler form. The fallback version blinks through the reveal (speed.md item 2) | Keep |
| 10 | src/app/(home)/guestbook/page.tsx:88 | Suspense plus a delayed skeleton around the entries | Await the entries in the page | -3 | With the cache warm the boundary never paints. Without it, a cold cache or the viewer-reactions query blocks the first byte | Keep (goes with #6) |
| 11 | src/app/(auth)/account/page.tsx:50, active-sessions-skeleton.tsx (25 lines) | Streams `listSessions` behind a skeleton | Await it in the page and delete the skeleton | about -28 | One DB round trip added to TTFB, likely 20 to 250ms (same driver as #6). Signed-in only, so Lighthouse can't measure it. The skeleton flash would go away | **Owner decision** |
| 12 | src/components/smooth-cursor.tsx:93-103 | rAF throttle on `pointermove` | Call `smoothMouseMove` directly | -8 | Browsers already align pointermove to frames, so the cost is about zero. But it changes cursor timing by a frame, and the cursor has regressed in cleanups before | Owner decision (lean keep) |
| 13 | src/components/features/assistant/text-selection-popup.tsx:80-83 | Hand-rolled 200ms debounce on `selectionchange` | `useDebounceCallback` | about -3 | It waits for the selection to settle (UX), not for speed. Changing it touches visible timing | Keep |
| 14 | src/components/ai-elements/markdown.tsx:105-112 | `useDeferredValue` plus Suspense for streamed markdown | Render `text` directly | -4 | Streaming re-renders on every token. This is the one hot path in the app | Keep |
| 15 | src/components/features/assistant/mascot/rig.tsx:50, :68 | `useMemo` around `scopeIds` over the big SVG defs and sprites | Plain calls | -4 | String rewrites over large SVG strings on every sprite-frame render. Mascot area, so excluded anyway | Keep |
| 16 | src/app/provider.tsx:56 | `LazyMotion` + `domAnimation` with `m` | `motion` components | small | Only pays off together with the framer-motion alias that round 1 kept. Many `m.` call sites would change | Keep (tied to the decided alias) |
| 17 | src/app/(home)/uses/_components/logo.tsx:40-64 | `fill` + `sizes={size + 'px'}` in a sized box | `width`/`height={size}` | 0 | Same images, no lines saved | Keep |
| 18 | `sizes` on covers and photos (blog header, uses setup and coding, projects cover, preview-link) | Responsive image hints | none | n/a | Needed for correct image sizes. Without them `fill` images fall back to `100vw` | Keep |
| 19 | src/components/features/auth/sign-in-modal.tsx:68 | Suspense with no fallback | none | n/a | Required: `useSearchParams` on static pages | Keep (not perf) |

Checked and found nothing to revert in the PR's own perf commits:
- 6e08b8af: analytics rendered on the server. That is the simpler form.
- 13cfb74b: testimonial avatars resized. Assets only.
- 523862a1: a Set lookup. Idiomatic.
- From 2feabdcf: KaTeX CSS imported in the MDX components (the idiomatic place) and the Simba asset trims.

There is no `content-visibility`, `optimizePackageImports`, `requestIdleCallback`, `useTransition` or extra `will-change` anywhere in src. Route `force-static` exports are the standard config for route handlers.

## Production A/B (one variant)

A is the current tree with items 1 and 2 applied. B adds items 3, 4, 5 and 6 together. Medians of 5 runs:

| Page | A LCP / TBT / CLS | B LCP / TBT / CLS |
|---|---|---|
| / | 5121 / 844 / 0 | 5712 / 685 / 0 |
| /about | 8345 / 647 / 0 | 8159 / 656 / 0 |
| /blog/vscode-setup | 4525 / 84 / 0 | 4316 / 124 / 0 |
| JS gzip, all chunks | 3,661,908 B | 3,662,991 B (+1.1KB) |

Individual runs:
- / A LCP: 4222 to 6165. / B LCP: 5262 to 6614.
- Blog A LCP: 2738 to 5591. Blog B LCP: 4085 to 5442.

LCP elements:
- / is the hero img.
- /about is a `<p>`.
- /blog/vscode-setup is the cover img. It was requested at High priority in A and Low in B, and was fetched by 21 to 50ms in both.

What I attribute to each item:
- Item 5 (Caveat) is the only change that touches /. In B the 75KB font is preloaded on every page and starts at the same time as the other fonts. That is a real cost with a plausible LCP effect, so I restored `preload: false`.
- Items 3 and 4 stay within the thresholds: TBT under 50ms, JS under 3KB, no CLS, LCP within noise. I kept them reverted.
- Caveat for items 3 and 4: Lighthouse uses simulated throttling. On a real slow network a Low-priority cover would compete with JS until layout boosts it. If the owner wants to be safe, re-adding the one `fetchPriority` line to BlurImage is cheap.

Guestbook (follow-up c), signed out, `curl` time to first byte and total:

| | warm TTFB / total | after 30s idle TTFB / total |
|---|---|---|
| Current (`unstable_cache` + tag) | 13.7 / 13.8 ms | 40.3 / 40.7 ms |
| Single query, no cache | 16.8 / 248.4 ms | 30.7 / 752.4 ms |

The single query rendered the same entries (the visible text diff matched). It was 18x slower when warm and the entries streamed in later, which is far outside noise. I kept the current code and restored it byte for byte from the backup. Signed-in visitors would pay the same query cost in both versions, because the viewer query already runs in parallel with the cached list.

## Follow-ups

- (a) Portrait sync: added. `scripts/check-portrait.tsx` (about 40 lines) renders `PortraitFace` with `renderToStaticMarkup`, removes the `portrait-` id prefix and compares tag by tag, with attributes sorted, against `public/images/portrait.svg`. Run it with `bun run check:portrait`. It also runs as a lefthook pre-commit command, only when one of the two files is staged. Checks: it passes on the current files, and it fails on a one-character color change and on an added attribute (I edited the svg temporarily, then restored it and confirmed with `cmp`).
- (b) Hero AVIFs: added. `scripts/hero-gradient-avif.ts` uses sharp, which next already installs (0.35.5). It writes the 6 srcset widths from `public/images/hero-gradient.png` at q80. Run it with `bun run generate-hero-avif [outDir]`. Its output into scratch was byte-identical to all 6 committed files. One `biome-ignore` is needed because sharp is not listed in package.json. The hero.tsx comment now names the script instead of "sharp, q80". No images changed (decision 17).
- (c) Guestbook caching: measured above. Kept.

## Applied, lines saved

- input.tsx: -5 (plus the `useDebounceCallback` import).
- use-copy-to-clipboard.ts: -3.
- blur-image.tsx: -3.
- story.tsx: -1.
- Total: about 12 lines removed.
- Added: check-portrait.tsx (42), hero-gradient-avif.ts (14), 2 package scripts, 3 lefthook lines.

## Needs owner decision

1. Account active sessions (#11): drop the Suspense boundary and the 25-line skeleton, and accept one DB round trip on TTFB for a signed-in-only page. That removes a skeleton flash.
2. Smooth cursor rAF throttle (#12): lean keep. It costs nothing, and the cursor is motion-sensitive.
3. BlurImage `fetchPriority` (#3): reverted because the measurement allowed it. Re-add the one line if you would rather not depend on Lighthouse's simulated network.
4. Round 1's contributions `weeks` memo is still open (perf-reverts.md).

## Verification

- `bunx tsc --noEmit -p .`: clean.
- `bun run check`: 434 files, no fixes needed.
- `bun run check:spelling`: clean.
- `bun run doctor`: 100/100, no issues.
- `bun run check:links`: 32 URLs, 0 errors.
- `bun run check:portrait`: passes.
- Production build of the final tree: passes. Route table unchanged: /search, /guestbook and /account are dynamic, /about is ISR. The only warnings are the existing AVIF warnings.
- Process hygiene: each server on 3112 was killed by its PID from lsof before the next build. The dev server on 3111 was stopped for the builds and restarted with `bunx next dev -p 3111 -H 0.0.0.0` (HTTP 200). No next start, lighthouse or esbuild processes are left apart from the dev server's own.
- Files changed:
  - src/components/features/assistant/input.tsx
  - src/hooks/use-copy-to-clipboard.ts
  - src/components/blur-image.tsx
  - src/app/(home)/about/_components/story.tsx
  - src/app/(home)/_components/hero.tsx (comment only)
  - package.json
  - lefthook.yml
  - new: scripts/check-portrait.tsx, scripts/hero-gradient-avif.ts
