# Perf hack reverts (agent: perf-reverts)

Source: perf-hacks-audit.md, owner-approved items 1 (post comments), 2 (Tempus), 3 (BlurImage ref), 4 (confetti import), 7 (GrainBackdrop observer) and the trivial memos from item 8. Items 5, 6, 9 and 10 were not touched (measure first or keep).

Net lines removed: about 107 across src, plus the `tempus` entry in package.json and its two bun.lock entries.

## 1. Post comments: module promise plus use-near-viewport
- Change: src/components/features/blog/post-comments.tsx now uses `next/dynamic(() => import('@fuma-comment/react').then((m) => m.Comments), { ssr: false })` and usehooks-ts 3.1.1 `useIntersectionObserver({ freezeOnceVisible: true, rootMargin: '100% 0px' })`, rendering `{isIntersecting && <Comments ... />}` inside the existing `min-h-59` box. The 40px toolbar selector stays; its comment lost the clause about the server placeholder (there is none now). src/hooks/use-near-viewport.ts deleted (no other callers).
- Lines removed: 48 (post-comments 66 to 53, hook file 35).
- Evidence (dev server, Playwright headless shell, scripted scroll in 0.6-viewport steps to the bottom, `layout-shift` PerformanceObserver with buffered entries, 3 runs each):
  - /blog/vscode-setup at 390 and 1440: 0 `@fuma-comment` requests and an empty comments box after load plus networkidle; 5 requests after scrolling near; widget rendered with the form, "Sign In" and the existing comment ("hi!!"); CLS 0 in all 6 runs, no layout-shift entries at all (the 0.085 list-growth entry noted in speed.md did not appear).
  - /blog/hello-world at 390 and 1440: the post is short, so the box starts within one screen of the viewport and the widget loads right away (same as the old rootMargin); widget rendered with the form and the existing comment; CLS 0 in all 6 runs.
  - Box height 236px after load in every run.

## 2. Tempus driving Lenis
- Change: src/components/layout/lenis.tsx drops `useTempus`, the ref and `autoRaf: false`; `ReactLenis` defaults to `autoRaf: true` (node_modules/lenis/dist/lenis-react.mjs:45). With no hooks left, the `SmoothScroll` wrapper was inlined into `Lenis`. `bun remove tempus` removed it from package.json and bun.lock (diff is exactly the three tempus lines; node_modules/tempus gone). Nothing else imported tempus.
- Lines removed: 17 in lenis.tsx, 1 in package.json, 2 entries in bun.lock.
- Evidence: on /about (Lenis is only mounted by pages using `Wrapper`; blog posts do not use it) `html.lenis` is present and an 800px wheel scrolls progressively: 242, 410, 528, 610, 668, 690, 778, ... 800 over about 600ms. Same-page anchor (test link to #experience clicked on /about) eases 2616 to 2645 and lands with the heading 80px from the top. Cross-page link /about#experience from the home page lands on the heading (top 80px).

## 3. BlurImage cached-image ref
- Change: src/components/blur-image.tsx: removed the `imageRef` useCallback, its comment, the `ref` prop and the `useCallback` import. next/image's own ref already calls `onLoad` for completed images.
- Lines removed: 8.
- Evidence (1440, headless shell): on /, /projects/depensa and /blog, after first load, after a reload (images from cache), after a full navigation away and `goBack`, and after a client-side header link plus history back, no BlurImage in or near the viewport kept `blur-lg`, and all images were `complete` (home 4 BlurImages, project page 1, /blog has none). No revert needed.

## 4. Confetti dynamic import
- Change: src/components/features/assistant/tools/celebrate.tsx imports `launchConfetti` statically next to the `ConfettiIntensity` type and calls it directly; the `async`, `await import(...)` and the catch fallback toast are gone (the reduced-motion toast stays).
- Lines removed: 5.
- Evidence: tsc clean. Not exercised in a browser (needs a live Simba tool call).

## 5. GrainBackdrop ResizeObserver
- Change: src/components/shader/grain-backdrop.tsx: removed the ref, state and ResizeObserver; `maxPixelCount={1920 * 1080}`. The library documents its default as 1920 * 1080 at 2x per side (shader-mount.d.ts:47-53), so 1920 * 1080 is its own base unit.
- Lines removed: 25.
- Evidence: the home CTA canvas renders the grain at 390 (dpr 3) and 1440 (dpr 2), WebGL context present, screenshot checked. Headless shell reports the canvas backing store at 1x CSS size in both cases, so it cannot show the density difference below.
- Behavior note (from the library's resize math, not measured on a device): the old cap was 1.5x CSS density; the new cap is above the CTA's full-density pixel count on common screens, so a 3x phone now shades about 1137x1020 instead of about 568x510 (4x the pixels) and a 2x 1440 desktop 2556x800 instead of about 1917x600. The grain gets slightly finer and GPU work goes up while the CTA is on screen. See owner decisions.

## 6. Trivial memos
- src/components/layout/header/index.tsx: `useMemo` around `splitLinkItems(resolveLinkItems({ links }))` replaced with a plain call; `useMemo` import removed. Lines removed: 4.
- src/components/search-redirect-input.tsx: `handleSubmit` is a plain function; `useCallback` import removed. Lines removed: 3.
- src/components/features/contributions.tsx: `monthLabels` is a plain call. Lines removed: 0 (one line for one line).
- src/components/features/search/index.tsx: `onMount` useCallback removed, `onMount={() => setMounted(true)}` inline (Biome split the JSX onto four lines). Net +3 lines. The dialog's `useEffect(..., [onMount])` now re-runs on each SearchDialog render and calls `setMounted(true)`, which React bails out of once mounted. The file imports a `fumadocs-ui` type; edited anyway because the owner named this memo explicitly.
- Kept back: contributions `weeks` useMemo. `weeks` is a dependency of the context-value `useMemo` the owner wants kept (React Doctor); a fresh array every render would make that memo recompute every time. Removing it needs moving `weeks`, `width` and `height` into the context memo, which is a restructure, not a memo revert.

## Verification
- `bunx tsc --noEmit -p .`: clean.
- `bunx biome check` on the 9 touched files: clean (one formatter fix applied to search/index.tsx).
- `bun run check:spelling`: clean.
- `bun run doctor`: finding list identical before and after (score 68, same 12 locations); only the scanned file count changed (451 to 450, the deleted hook).
- Dev server log: no compile errors (only the existing AVIF warnings).
- Scripts and outputs: scratchpad perfrev/ (comments.cjs, lenis-blur.cjs, anchor.cjs, grain.cjs); screenshots deleted afterwards.

## Needs owner decision
- Grain density: keep `1920 * 1080` (finer grain, up to 4x shader pixels on 3x phones) or pick a lower constant. No single constant reproduces the old per-box 1.5x cap: matching it on a 3x phone CTA needs about 290,000 pixels, which would drop a 2x desktop CTA to about 0.75x.
- Contributions `weeks` memo: keep (current) or fold `weeks`, `width` and `height` into the context-value memo.

## Update: grain revert undone
Owner rule: the revert must not make phones do more GPU work. A single constant cannot match the old per-box cap (CSS area times 1.5 squared) on both a 3x phone (cap about 0.5M pixels) and a 2x desktop (about 1.6M), so the original ResizeObserver code is back in src/components/shader/grain-backdrop.tsx, identical to HEAD, and item 5 is logged as kept.
