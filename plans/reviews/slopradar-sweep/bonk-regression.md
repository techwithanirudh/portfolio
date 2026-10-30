# Bonk label stays on screen

Owner report: after bonking the hero portrait, the "bonk" label above it stays visible. On `origin/main` (f3ed38bc) it fades out after each bonk.

## Root cause

Not the bonk code. The uncommitted Motion swap of `ViewAnimation` (the working-tree change that deleted `src/lib/reveal-script.ts` and made `view-animation.tsx` an `m.div` with `initial={{ opacity: 0, y: 6 }}`) replaced main's reveal rule in `src/styles/globals.css`:

```css
/* main and HEAD: hide reveal items outside the first section until the script runs */
:root[data-reveal] [data-reveal-item]:not(#main-content [data-slot="section"]:nth-child(1 of [data-slot="section"]) *) { opacity: 0; }
```

with a blanket override for everything in the first section that has an inline opacity:

```css
#main-content [data-slot="section"]:nth-child(1 of [data-slot="section"]) [style*="opacity"] {
  opacity: 1 !important;
  transform: none !important;
}
```

The bonk label is an `m.span` in the hero (the first section) whose fade is written by Motion as inline `style="opacity: ..."`, so the `!important` rule pinned it at opacity 1 and also cancelled its upward float. The `zzz` label hit the same rule.

Evidence (headless Chromium against the dev server on :3111, one click on the face):

- Before the fix: the label's inline style ends at `opacity: 0; transform: translateY(-0.35em)` with no running animations, yet `getComputedStyle(label).opacity` is `1` at every sample from 0 to 3000 ms. The only matching rule with an opacity is the one above, `opacity: 1 !important`.
- `bonk-chip.tsx` against main's `BonkChip` in `src/app/(home)/_components/portrait.tsx`: the label JSX, keys, durations (0.6 s fade, 260 ms `data-bonked`, 1500 ms streak, 5000 ms sulk) and complaint table are unchanged. The timer refactor (effects to refs with `??=`) keeps main's timing: main's `[bonked]` effect also cleared 260 ms after the first bonk of a run, since `setBonked(true)` on an already true flag doesn't rerun it. The `LazyMotion`/`MotionConfig` and the `motion/react` to `framer-motion` alias don't affect it: the keyframes ran to opacity 0 in the inline style, CSS overrode them.

## Fix

Scope the first-section override to `ViewAnimation`'s own elements, which is what main's rule targeted:

- `src/components/view-animation.tsx`: the `m.div`/`m.li` gets `data-reveal-item` back.
- `src/styles/globals.css`: the selector is now `... [data-reveal-item][style*="opacity"]`.

## Verification (headless Chromium, dev server)

Label opacity after the last click:

| Case | +0 ms | +150 | +300 | +500 | +700 to +3000 |
| --- | --- | --- | --- | --- | --- |
| Single click | 0.82 | 0.76 | 0.19 | 0.00 | 0.00 |
| 5 rapid clicks (toast "hey, that's my face") | 0.81 | 0.89 | 0.53 | 0.05 | 0.00 |
| Reduced motion, 3 clicks (toast "ouch") | 0.83 | 0.77 | 0.24 | 0.00 | 0.00 |
| Keyboard Enter/Space, 3 clicks (toast "ouch") | 0.81 | 0.96 | 0.53 | 0.05 | 0.00 |

That matches main's 0.6 s `[0, 1, 0]` fade. `data-bonked` clears about 260 ms after the first bonk of a run, as on main. Only one label is in the DOM at a time. 16 clicks: the face sulks (`aria-disabled`), `zzz` pulses 0.28 to 1 to 0 and is gone with the button enabled again after 5 s. The first section's four `ViewAnimation` items still compute to opacity 1 at load, with and without JavaScript.

`bunx tsc --noEmit -p .` passes, `bunx biome check` on the two files passes, `bun run check:spelling` passes, `bun run doctor` is 100/100.

## Sweep

Searched `git diff f3ed38bc` over `src` (commits plus working tree) and the untracked files for `setTimeout`, `clearTimeout`, `AnimatePresence`, `onAnimationEnd`, `onExitComplete`, `exit=`, `useAnimate`, `requestAnimationFrame`, `cancelAnimationFrame` and `style*=`.

| Place | Verdict |
| --- | --- |
| `globals.css` first-section `[style*="opacity"]` rule | Regression, fixed above. It also caught any other Motion element with inline opacity in a page's first section (for example an `IconSwapItem`), now scoped the same way. |
| `layout.tsx` `<noscript>` `[style*="opacity:0"]` rule | Fine: only applies with JavaScript off, when nothing animates. |
| `portrait/bonk-chip.tsx` timers (`bonkedTimer`, `sulkTimer`, `streakTimer`) | Fine: same timing as main's effects, all cleared on unmount. The squash and head-shake keyframes start from `null` (current value) instead of `0`/`1`, so a rapid rebonk continues from the current scale instead of snapping to 1; not a stuck state, left as is. |
| `portrait/bonk-chip.tsx` `AnimatePresence` (bonk label, `zzz` with its own exit transition) | Fine: identical to main. |
| `portrait/portrait.tsx` eye-follow `requestAnimationFrame` | Fine: identical to main, cancelled on cleanup. |
| `icon-swap.tsx` `exit=` | Fine: same exit, plus a plain fade under reduced motion; always renders `m.span` now (no caller passed `as`). |
| `ui-sounds.tsx` 16 ms and 120 ms `setTimeout` | Fine: same sounds and delays, the switch on/off logic is equivalent. |
| `features/assistant/text-selection-popup.tsx` | Fine: a `requestAnimationFrame` became a 200 ms debounce (from a feature commit), still cleared on cleanup. Not touched (other agents' area). |
| `features/assistant/tools/navigate.tsx` hash poll | Fine: same 10 s wait and 50 ms poll, reduced motion still scrolls instantly via `scrollToTarget`. Not touched. |
| `features/assistant/mascot/controller.ts` frame timer | Fine: cleared in `dispose`, `stopCurrent` and on a reduced-motion change. Not touched. |
| `features/assistant/mascot/hooks.ts` `useNap` | Fine: timer cleared on cleanup, rescheduled on input and on returning to the tab. Not touched. |
| `features/assistant/mascot/use-reading-eyes.ts`, `use-sprite-frames.ts` | New code; every timer is cleared in its effect cleanup. Not touched. |
| `lib/confetti.ts` `requestAnimationFrame` loop | New code; stops and removes the canvas once no pieces are left. |
| `features/not-found/simba-loop.tsx` (deleted, replaced by `simba-thinking.tsx`) | Behaviour change, not fixed: the 404 Simba used to loop `CuriousLoop` (curious, curious right, thinking) on a `setTimeout`; in the working tree it holds a static `thinking` pose, and `CuriousLoop` is gone from `mascot/constants.ts`. `SLOPRADAR-RESOLUTIONS.md` records the loop as owner-approved and no sweep log records removing it. Restoring it needs `CuriousLoop` back in the assistant constants, which another agent owns, so it's flagged for the owner. |
