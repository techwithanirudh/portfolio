# Perf hacks audit (agent: perf-hacks, read-only)

Question: where is code more complex, hand-rolled or clever than it needs to be in the name of speed, for a small measured or plausible benefit, so it can go back to plain idiomatic code?

Scope: src/, emails/, scripts/, next.config.ts, package.json. Snapshot taken 2026-10-19 while another agent was editing, so line numbers can drift by a few lines.

Excluded on purpose:
- The reveal script itself (src/lib/reveal-script.ts, ViewAnimation, staggerDelay): the trigger for this audit, already being decided.
- Anything touching the hero LCP image (src/app/(home)/_components/hero.tsx, the hero gradient AVIF/WebP, its priority/fetchPriority). Owner: fades on it hurt LCP; decision 17 keeps the hand-made images.
- Simba mascot timing code, rig-art.ts, .source/.
- unstable_cache to 'use cache' (decision 18), canvas-confetti (decision 21: keep the hand-rolled confetti; only its dynamic import is discussed below), the sound gates (decision 20), and the seven skeleton/speed changes the owner just approved (speed.md: server session handoff, search `connection()`, contributions without Suspense, `animate-delayed-show`, account outside Suspense, comments 40px toolbar).

## Facts that shape the verdicts

- The React compiler is NOT on. next.config.ts has no `reactCompiler`, and package.json has no `babel-plugin-react-compiler`. So manual `memo`/`useMemo`/`useCallback` is not redundant "because of the compiler"; each one has to be judged on its own. Several context `useMemo`s were added on purpose for React Doctor (commit 2feabdcf, "memoised context values").
- Hoisted regexes (`externalHrefPattern`, `WHITESPACE_LOOKAHEAD`, `FONT_IMPORT`, ...) are required by the Ultracite preset (`performance/useTopLevelRegex: "error"`, node_modules/ultracite/config/biome/core/biome.jsonc:319). Not a candidate.
- No `content-visibility`, `contain`, `translateZ`, `transform-gpu` or `backface-visibility` anywhere. The only `will-change` is story-track.tsx:265.
- Chunk sizes below come from the production build already in `.next/static/chunks` (BUILD_ID JgLr-Yykm70PT2JKK6DB4, built 2026-10-19 16:54), gzip -9 of each file, found by grepping the chunk for a distinctive string. Nothing was rebuilt.
- "Measured" in an entry means a number from that build or from an existing report (cited). "Estimated" means reasoning only, no run.

## Ranked list

Ranked by code removed and simplicity gained against the risk of reverting.

### 1. Post comments: module-level promise plus a custom near-viewport hook
- Where: src/components/features/blog/post-comments.tsx:8-22 and :34-41; src/hooks/use-near-viewport.ts (whole file, 35 lines, one caller).
- What it does: a module-level `commentsWanted` promise and its resolver gate a `React.lazy` import. On the server the lazy resolves at once, so the widget's shell is server-rendered; on the client the import waits until `useNearViewport` (a hand-written IntersectionObserver hook) fires a screen away, and React keeps the server markup in the Suspense boundary until then. The custom hook exists because usehooks-ts' callback-ref re-render made React drop that server markup (components.md:69).
- Plain alternative: `const Comments = dynamic(() => import('@fuma-comment/react').then((m) => m.Comments), { ssr: false })` plus usehooks-ts `const { ref, isIntersecting } = useIntersectionObserver({ freezeOnceVisible: true, rootMargin: '100% 0px' })`, and render `{isIntersecting && <Comments ... />}` inside the existing `min-h-59` box. With no server markup to preserve, the usehooks-ts re-render problem no longer applies, so the custom hook can go (SLOPRADAR-RESOLUTIONS.md:1014 already proposed this swap).
- Benefit kept: the 205KB gzip widget chunk stays off initial load either way (measured: `.next/static/chunks/2eze1qv9uak3r.js`, 720,066 B raw, 205,464 B gzip). What the clever version buys over the plain one is only the server-rendered empty form shell. The comments list is fetched client-side in both versions (speed.md:75), so search engines see no comments either way.
- Risk: the form shell is no longer in the HTML, so `min-h-59` (236px) is the only reservation. The swap happens about a screen below the viewport, so shifts there are off-screen and should not count toward CLS (estimated). The 36 to 40px toolbar selector from speed.md item 7 must stay: the widget itself still flips while auth resolves.
- Verdict: revert (simplify), then verify CLS. Cost of reverting: estimated, not measured.
- Lines removed: about 45 (hook file 35, promise dance 10). Adds about 4.
- How to verify: CLS on /blog/vscode-setup at 390, Lighthouse mobile median of 5, and a scripted scroll to the end with a PerformanceObserver for `layout-shift`; compare against the current 0.085 list-growth entry in speed.md:75 (that one is unrelated and should stay the same).

### 2. Tempus driving Lenis' animation frame
- Where: src/components/layout/lenis.tsx:7, :17-23, `autoRaf: false` at :29; `tempus` in package.json.
- What it does: turns off Lenis' own requestAnimationFrame loop and drives `lenis.raf(time)` from a Tempus ticker. Tempus exists to merge several rAF loops (GSAP, Lenis, others) into one. Nothing else in src/ uses Tempus (grep: only lenis.tsx).
- Plain alternative: delete `useTempus`, the ref and `autoRaf: false`; Lenis' default `autoRaf: true` runs its own loop.
- Benefit: none plausible with a single consumer. The extra dependency is a few KB at most (estimated; not isolated in the build, Turbopack merged it into a shared chunk).
- Risk: none expected; behaviour is the same loop. Reduced-motion still unmounts Lenis.
- Verdict: revert. Cost of reverting: estimated (no measurement exists either way).
- Lines removed: about 8, plus the `tempus` dependency.

### 3. BlurImage cached-image detection
- Where: src/components/blur-image.tsx:31-36 (`imageRef` with `useCallback`) and the `ref={imageRef}` prop at :55.
- What it does: checks `img.complete` on mount so images that loaded before hydration still clear the blur.
- Plain alternative: delete it. next/image 16.4.2 already does this in its own ref: `if (img.complete) handleLoading(...)`, and `handleLoading` calls the `onLoad` prop with a synthetic event (node_modules/next/dist/client/image-component.js:163 and :29-69). So `onLoad={() => setLoaded(true)}` already covers cached images.
- Benefit: none; it duplicates framework behaviour.
- Risk: next/image waits for `img.decode()` before calling onLoad, so the blur clears one decode later (single-digit ms). Visual only.
- Verdict: revert. Cost of reverting: verified in source, not measured in a browser. Quick check: load /uses twice (second load from cache) and confirm the setup photo is not stuck blurred.
- Lines removed: 7 (including the `useCallback` import).
- Not touched: the blur-up effect itself is a design choice, and the eager `fetchPriority` line (:51) is one line with a real LCP role on the blog and project covers.

### 4. Dynamic import of the confetti module
- Where: src/components/features/assistant/tools/celebrate.tsx:30-35 (`await import('@/lib/confetti')` with a catch that falls back to a toast).
- What it does: splits the confetti code into its own chunk.
- Plain alternative: `import { launchConfetti } from '@/lib/confetti'` at the top and call it directly; drop the try/catch.
- Benefit: measured tiny. The chunk is `.next/static/chunks/018lolti0aox-.js`, 2,024 B raw, 1,143 B gzip, and the caller already lives inside the Simba assistant, which is itself `dynamic(..., { ssr: false })` in src/app/provider.tsx:19. So the split saves about 1KB inside a chunk nobody downloads on first load.
- Risk: none. The only thing the try/catch guarded was a failed chunk load.
- Verdict: revert. Cost of reverting: measured (chunk size above).
- Lines removed: about 5.

### 5. Search dialog loaded on first key press or tap
- Where: src/components/features/search/index.tsx:9-45 (window `keydown`/`pointerdown`/`touchstart` listeners, `wanted` and `mounted` state, the `onMount` callback) and src/components/features/search/dialog.tsx:68-79 (`onMount` prop and its effect).
- What it does: keeps the dialog chunk out of the first load, starts loading on the first interaction anywhere, mounts it closed, and opens it one render later so the first open still animates.
- Plain alternative: `const Dialog = dynamic(() => import('./dialog'), { ssr: false })` and always render `<Dialog {...props} />`; the chunk then loads right after hydration on every page. Or latch on the first open only (`wanted` state, no window listeners, no `onMount`) and accept that the very first open may skip its enter transition.
- Benefit: measured size, unmeasured timing. The chunk that holds the dialog (`.next/static/chunks/124kojvsago6s.js`, 211,152 B raw, 66,284 B gzip) is not in rootMainFiles, so today it is not in the first load. Note that Lighthouse never presses a key or taps, so under the current code it never loads this chunk in the lab; an always-load revert will show up in lab numbers even though real visitors on phones already load it on their first touch (`touchstart` counts).
- Risk: TBT and JS transfer on every page if always loaded (66KB gzip plus parse of 211KB on a throttled phone). Correctness risk is low.
- Verdict: measure first. Cost of reverting: estimated.
- Lines removed: about 30 (always-load) or about 20 (latch on open).
- How to measure: production build, Lighthouse mobile median of 5 on /, /about and /blog/vscode-setup, current vs always-load; compare TBT, LCP and total JS gzip transfer (sum of `script` resources in the report). Revert only if TBT moves less than about 50ms and LCP within noise.

### 6. `motion/react` aliased to `framer-motion` in Turbopack
- Where: next.config.ts `turbopack.resolveAlias` (the block at the end of the config, about 8 lines with its comment) and the explicit `framer-motion` 14.2.0 dependency that exists only for it (SLOPRADAR-RESOLUTIONS.md:416).
- What it does: works around `motion/react` reading `motion` off a namespace import, which the comment says keeps the full `motion` component (drag, pan, layout) in every page even under `LazyMotion` + `m`.
- Plain alternative: delete the alias and the extra dependency; keep `LazyMotion features={domAnimation}` and `m` (the documented Motion bundle-size pattern). The blog header already imports `motion/react-m` directly.
- Benefit: unmeasured. Commit 2feabdcf ("motion aliased to framer-motion for tree shaking") recorded no before/after size.
- Risk: if the comment is right, every page grows by the full motion component (estimated 15 to 30KB gzip); that is a real TBT cost on mobile.
- Verdict: measure first. Cost of reverting: estimated.
- Lines removed: about 8 in next.config.ts, plus one dependency.
- How to measure: two production builds, with and without the alias; compare the summed gzip size of `rootMainFiles` plus the / page chunks from `.next/build-manifest.json` and `.next/server/app/page_client-reference-manifest.js`, and run Lighthouse mobile median of 5 on / for TBT. Revert if the difference is under about 3KB gzip.

### 7. GrainBackdrop ResizeObserver for a pixel budget
- Where: src/components/shader/grain-backdrop.tsx:34-53 (ref, state, ResizeObserver computing `maxPixelCount` as area times 1.5 squared). Used once, in the home CTA (src/app/(home)/_components/cta.tsx:13).
- What it does: caps the WebGL canvas at 1.5x CSS pixel density so 3x phones do not shade 9x the pixels.
- Plain alternative: a constant, e.g. `maxPixelCount={1920 * 1080}`, with no observer and no state. The library default is 6016 x 3384 (node_modules/@paper-design/shaders/dist/shader-mount.js:42), so some cap is worth keeping, but it does not need to track the box. The library already pauses itself off-screen and on hidden tabs (its own IntersectionObserver and `visibilitychange`, shader-mount.js:75-79).
- Benefit: GPU time while the CTA is on screen; nothing Lighthouse sees (the CTA is at the bottom of /).
- Risk: on a very large desktop CTA the constant could render the grain slightly softer than now (estimated, visual only).
- Verdict: revert to a constant. Cost of reverting: estimated.
- Lines removed: about 15.
- Check: look at the CTA on a 3x phone and a 1440 desktop; the grain is soft by design, so a difference should be hard to see.

### 8. Manual memoisation with the compiler off
- Revert (trivial, no consumer relies on identity):
  - src/components/layout/header/index.tsx:108 `useMemo` around `splitLinkItems(resolveLinkItems(...))` of about 8 links.
  - src/components/search-redirect-input.tsx:30 `useCallback` for a submit handler passed to one input.
  - src/components/features/contributions.tsx:221 and :339 `useMemo` for `groupByWeeks` and `getMonthLabels` over 365 days (microseconds; the parent is a server render plus one hydration).
  - src/components/features/search/index.tsx:18 `onMount` `useCallback` (goes away with item 5 anyway).
- Keep:
  - src/components/features/assistant/message-list.tsx:188 `memo(AssistantMessage)`, src/components/ai-elements/message.tsx:49 `memo(MessageResponse)`, src/components/ai-elements/shimmer.tsx:40: chat streaming re-renders on every token; this is the one hot path in the app.
  - Context value `useMemo`s (assistant/context.tsx:86, auth/sign-in-modal.tsx:63, contributions.tsx:233): React Doctor flags their removal, and the assistant context fans out widely.
  - src/components/page-actions.tsx:108 and src/components/features/search/dialog.tsx:89-139: page-actions is the Fumadocs template verbatim; the dialog memos feed cmdk on every keystroke.
- Benefit of the trivial ones: none measurable. Risk: none.
- Verdict: revert the four trivial ones. Cost: estimated (no measurement needed; render counts do not change user-visible timing). Enabling `reactCompiler` instead would let all of them go, but it adds a Babel pass to every Turbopack build; not recommended just for this.
- Lines removed: about 12.

### 9. Guestbook entries cache split
- Where: src/server/db/queries/guestbook.ts:83-117 (shared entries under `unstable_cache` with a tag, a separate viewer-reactions query, merge in JS) and the five `updateTag(GUESTBOOK_CACHE_TAG)` calls in src/app/(home)/guestbook/actions/guestbook.ts:78, :89, :117, :151, :200.
- What it does: caches the entry list across requests and recomputes only the viewer's own reaction flags.
- Plain alternative: one query per request (entries plus a left join or `exists` for the viewer's reactions), no tag, no `updateTag`, `revalidatePath` or nothing at all since the page is dynamic.
- Benefit: measured indirectly. With the cache warm, the entries fallback lived 1 to 7ms (skeletons.md item 1); a cold Neon HTTP query is a full round trip (tens to hundreds of ms, estimated).
- Risk: slower TTFB on a dynamic page, worse on a cold database. Adjacent to decision 18 (leave unstable_cache for now).
- Verdict: measure first, low priority.
- Lines removed: about 25.
- How to measure: production server, `curl -w '%{time_starttransfer}'` on /guestbook, median of 5 warm and 5 after an idle period, current vs plain. Lighthouse is a poor fit here (dynamic page, low traffic). Revert only if the warm TTFB difference is under about 30ms.

### 10. Hover preload of case study covers
- Where: src/components/features/work/cover.ts (whole file, 21 lines, `getImageProps` plus `ReactDOM.preload`), src/components/features/work/work-card.tsx:54-55, src/components/features/assistant/tools/portfolio.tsx:64-78.
- What it does: on pointer enter or focus, preloads the 1200px cover the case study page will show, so it is decoded when the shared-element view transition (`work-card` transition types) snapshots the new page.
- Plain alternative: delete it; the case study page loads its eager cover after navigation.
- Benefit: unmeasured, but plausible and visible: without it, the destination cover renders blurred (BlurImage) during the morph and then sharpens. Lighthouse cannot see it (soft navigation only).
- Risk: a visibly worse /projects to case study transition, especially on slow networks.
- Verdict: keep. Cost of reverting: estimated. If you want a number: throttle to Fast 4G in DevTools, click a project card, and record when the cover's `load` fires relative to the click, with and without.
- Lines removed if reverted: about 25.

## Smaller items: keep

These are one to five lines each, with a plausible benefit; reverting saves almost nothing.

| file:line | What | Why keep | Evidence |
|---|---|---|---|
| src/app/provider.tsx:26-29 | `SmoothCursor` via `dynamic(..., { ssr: false })` | Keeps a desktop-only decoration off every page | measured: chunk `3rgr13or_5ae8.js` 15,009 B raw, 6,140 B gzip |
| src/app/provider.tsx:19-25 | `Assistant` via `dynamic` | Large; legit split | measured: `2wfncaitx82yg.js` 95,024 B gzip |
| src/app/layout.tsx:33-39 | Caveat `preload: false` | Saves a font preload on pages that never use it; 1 line | estimated |
| src/app/(home)/about/_components/story.tsx:131-133 | First story photo eager plus high priority | Likely LCP candidate on /about | estimated |
| src/app/(home)/projects/page.tsx:50, work-grid.tsx:22-44 | `eagerCount={2}` covers | Above-the-fold covers on /projects; lazy in-viewport images start late | estimated |
| src/app/(home)/blog/[slug]/_components/header.tsx:33, uses/_components/setup.tsx:18, projects/[slug]/page.tsx:64 | `loading='eager'` on page covers (BlurImage turns it into `fetchPriority='high'`) | These are the LCP images of those pages | estimated; same class of thing as the hero the owner excluded |
| src/app/(home)/about/_components/story-track.tsx:265 | `will-change-transform` layer for the animated line | Separates the per-frame path redraw from the SVG filter; 1 class | estimated |
| src/components/portrait/portrait.tsx:35-45 | rAF coalescing of pointermove | Avoids a forced layout (`getBoundingClientRect`) per pointer event; 2 lines | estimated |
| src/components/preview-link.tsx:20-46 | `createJsonFetcher` request Map | Dedupes the pointerenter preload and the onOpenChange load, which both fire before the first fetch resolves; a plain version would need a ref anyway | estimated |
| src/components/page-actions.tsx:19, :36-47 | Markdown text Map for the copy button | Fumadocs template verbatim; diverging from upstream costs more than it saves | n/a |
| src/components/ai-elements/markdown.tsx:102-126 | Promise cache with a 200-entry cap | Required for `use()` (the promise must be stable across renders), not a speed hack | n/a |
| src/lib/link-preview.ts:21 | React `cache` around reading the manifest JSON | Called once per link in an MDX page; 1 wrapper | n/a |
| src/lib/github-*.ts, about feed data.ts | `unstable_cache` around GitHub calls | Rate-limit protection, not speed; decision 18 | n/a |
| src/components/page-actions.tsx:33 | 150ms delayed spinner | Anti-flash UX, same idea as the approved `animate-delayed-show` | n/a |

## Summary of verdicts

| # | Item | Verdict | Lines removed | Revert cost |
|---|---|---|---|---|
| 1 | Post comments promise plus use-near-viewport | revert, verify CLS | ~45 | estimated |
| 2 | Tempus driving Lenis | revert | ~8 plus a dependency | estimated |
| 3 | BlurImage cached-image ref | revert | 7 | verified in next/image source |
| 4 | Confetti dynamic import | revert | ~5 | measured (1.1KB gzip) |
| 5 | Search dialog intent loading | measure first | ~20 to 30 | estimated (chunk 66KB gzip measured) |
| 6 | motion to framer-motion alias | measure first | ~8 plus a dependency | estimated |
| 7 | GrainBackdrop ResizeObserver | revert to a constant | ~15 | estimated |
| 8 | Trivial memo/useCallback | revert four, keep the rest | ~12 | estimated |
| 9 | Guestbook cache split | measure first, low priority | ~25 | partly measured (skeletons.md item 1) |
| 10 | Hover cover preload | keep | (~25) | estimated |

Total if the five "revert" items land: about 90 lines and one dependency. If both "measure first" bundle items also come back neutral: about 125 lines and two dependencies.
