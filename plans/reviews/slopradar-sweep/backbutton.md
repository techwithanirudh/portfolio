# backbutton: Back after a #hash link shows the wrong page

Owner approved "Fix in this PR" for the bug that decisions-site found (decisions-site.md section 20 and Owner follow-ups).

## Bug

On `/blog/vscode-setup`, click a heading anchor or a TOC link, go to About, then press Back. The URL changes to `/blog/vscode-setup#config`, but About stays on screen. A plain fragment navigation creates a history entry with `history.state === null`. Next's `handlePopState` returns early on a null state (`node_modules/next/dist/client/components/app-router.js:62`, its own TODO-APP), so the traversal is ignored. Because `usePathname` never changes, pageEnter never plays either.

## Fix

- New `src/components/hash-link-history.tsx` (`HashLinkHistory`, renders null, about 45 lines).
- `src/app/provider.tsx`: import it (line 10) and mount `<HashLinkHistory />` in `Provider` (line 77). `layout.tsx` imports fumadocs-ui, so it is deferred and was left untouched.

How it works:
1. A capture click listener runs when a click lands on an `a[href*="#"]` while the current entry holds Next's state (`__NA`). It remembers that state together with the pathname and search.
2. Fragment navigations fire `popstate` with a null state in all three engines. When that happens on the same path, the listener runs `history.replaceState(saved, '', location.href)`. The saved state carries `__NA`, so Next's patched `replaceState` passes straight through to the native one. That means no router `restore` call, no re-render and no scroll.
3. Firefox also clears the state when the current hash is clicked again, with no event at all. The next click mends a null entry on the same path before anything navigates.

Why this is the smallest robust option:
- The browser still does the native fragment navigation, so scrolling, `:target`, Lenis anchors, the TOC observer and `data-scroll-behavior` all behave as before.
- The other proposal was to intercept the click and call `pushState` ourselves. That needs `preventDefault`, a manual scroll, and `:target` would stop updating, which changes visible behavior.
- Routing hash links through Next `Link` would mean touching the MDX heading component, the fumadocs TOC (deferred) and the skip link. It would also change scrolling.
- A first try used `setTimeout(0)` after the click. It was racy: Firefox runs the fragment navigation a task after the click, so the timer fired first (Firefox tocBack, sameHashTwice and scrollBack failed). Results from that try are kept in `scratchpad/backbutton/first-attempt/`.
- Normal link clicks do not change: the listener only reads `history.state`, and a write needs a null state on the path a hash link was clicked on.

## Verification

Harness: `scratchpad/backbutton/run.cjs`. Each scenario runs at 1600x900 so the TOC minimap shows, with no-preference and with reduced motion. Sound is spied by wrapping `AudioContext.prototype.createOscillator/createBufferSource`. Frame logs (URL, h1, scrollY, history.length, `__NA`, TOC active anchor and bars, sound count) are in `before-<engine>.json` and `after-<engine>.json`, with a readable summary in `after-summary.txt`. Engines: chromium headless shell 1243, webkit 2359, firefox 1543.

| Check | Chromium | WebKit | Firefox |
|---|---|---|---|
| (1)(2) heading link, About, Back: before | About shown at /post#config | same | same |
| (1)(2) heading link, About, Back: after | post, y 1382 | post, y 1328 | post, y 1382 |
| Forward/Back again, then Back to /post (no hash) | ok | ok | ok |
| TOC (minimap popover) link, About, Back: before / after | About / post y 2996, TOC active `extensions` | About / post y 2942, `extensions` | About / post y 2890, `extensions` |
| Same hash clicked twice, About, Back: before / after | About / post | About / post | About / post (Firefox needs the next-click repair) |
| (3)(9) home, blog, post with clicks, Back x2, Forward x2 | identical before/after (URL, h1, scrollY, history.length, __NA) | identical | identical |
| (4) Cmd+K jump, Back, Forward | identical | identical (only typing-sound counts differ) | identical |
| (5) scroll restore, plain back (left at 1800) | 1346, same as before | 1746, same as before | 804 (Firefox wheel stops at 804), same as before |
| (5) scroll restore after a hash link (left at ~3470) | lands 2996 (the hash target) | 3418 | 3462 |
| (6) TOC active state after Back | the heading's own anchor, bars lit | same | same |
| (7) pageEnter on Back onto the hash entry: before / after | 0 / 1 | 0 / 1 | 0 / 1 |
| (8) reduced motion (scroll-behavior auto, no Lenis) | fixed, no sounds | fixed | fixed |

- Video of the repro in Chromium: `scratchpad/backbutton/repro-before.mp4`, `repro-after.mp4`, plus a combined `repro-before-after.gif`. Their frame logs are `repro-*-frames.json`. The "before" recording filters the HashLinkHistory click listener out with an init script, so the source stays unchanged. Before: Back gives `/blog/vscode-setup#config` with h1 "About me.". After: h1 "my VSCode setup" at y 1383.
- `bunx tsc --noEmit`: pass. `bun run check`: pass. `bun run check:spelling`: one failure, `prerendered` in `src/app/(home)/search/page.tsx:11`, which is another agent's file and not touched here.

## Residual

- Scroll on Back to a hash entry in Chromium lands on the hash target (2996), not where the visitor left (3472). WebKit and Firefox restore close to the leave point. Plain Back in Chromium is also imprecise (1800 → 1346, same before and after), so browser and Next scroll restoration are a separate matter.
- In Firefox, after re-clicking the current hash, leaving by keyboard only (for example Cmd+K then Enter, with no click in between) still leaves that one entry stateless. This is rare and also happened before the fix.
- One run before the fix showed Chromium with reduced motion rendering the post on Back to /blog (plain3). It did not recur in 6 runs afterward, and no hash link was involved, so it was likely dev-server noise from concurrent edits.
- `UiSounds` sets `historyNavigation` on the fragment-navigation popstate too. This existed before, and the next pointerdown or keydown resets it.
