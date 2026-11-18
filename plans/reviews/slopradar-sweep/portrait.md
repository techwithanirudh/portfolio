# portrait: slopradar sweep log

Scope: the portrait (eye tracking, chips, bonk, heading), its callers (home hero, about hero, blog author byline), `src/lib/portrait-eyes.ts`, and the hero gradient AVIF question.

## Fixed (6)

Portrait split (`src/app/(home)/_components/portrait.tsx` deleted, `portrait-face.tsx` moved):
- misplaced-module (portrait.tsx:33): moved to `src/components/portrait/`: `portrait.tsx` (eye-tracking Portrait), `blinking-eyes.tsx`, `portrait-face.tsx` (unchanged, moved), `static-portrait-chip.tsx` (StaticPortraitChip + chip classes, no `use client`), `bonk-chip.tsx` (BonkChip + a local `useBonk` hook), `portrait-heading.tsx` (PortraitHeading, now a server component). Portrait stays exported because BonkChip now imports it from another file.
- boolean-parameter (portrait.tsx:103): `still` flag dropped; StaticPortraitChip and BonkChip are separate components.
- magic-number (portrait.tsx:36): `PORTRAIT_WIDTH`/`PORTRAIT_HEIGHT` exported beside `PORTRAIT_CHIP_VIEW_BOX` in `@/lib/portrait-eyes`; the default viewBox and the static chip's `<image>` read them.
- inconsistent sonner import (portrait.tsx:6): kept direct `sonner` (owner note: `@/lib/toast` adds a sound and the bonk plays its own); a one-line comment on the import says why.
- layering (author-byline.tsx:1): byline imports StaticPortraitChip from `@/components/portrait/static-portrait-chip`. The chip's base classes no longer bake in the heading-text `mx-[0.04em] translate-y-[0.08em]` (those live in `inlineChipClassName`, used by the bonk chip and the heading's gap), so the byline only sets `size-[1.15em]` instead of overriding with `m-0 ... translate-y-0`. `ownerFirstName` inlined.
- inconsistent rel (home hero.tsx:109): GitHub link spreads `externalLinkProps` from `@/components/external-link` (`rel` becomes `noopener noreferrer`, same browser behavior).

## Judged not worth it (2)

- author-byline.tsx:6 duplication (first-name split shared with features/assistant/owner-name.ts): the shared home would be `src/constants/site.ts`, which imports `fumadocs-ui` (deferred file, not editable in this sweep); each side is a one-expression derivation. Byline now inlines `owner.split(' ')[0] ?? owner`; owner-name.ts untouched.
- author-byline `coAuthorSeparator` (coordinator asked to inline): kept as a module constant because Biome's `useTopLevelRegex` (ultracite core, error) forbids a regex literal in the render body.

## Kept as is, with reasons

- PortraitHeading's duplicate-line grid trick: kept. Alternatives considered: `aria-label` on the h1 (keeps the name but nests the button in the heading, a different a11y tree), CSS anchor positioning of an out-of-h1 button over the gap (not supported widely enough to guarantee identical placement), JS measuring (adds runtime work). None can be proven identical, so the trick stays.
- Hero gradient AVIF `<picture>`: kept. Measured with Next 16.4.2's own optimizer code path (`image-optimizer/transform.js`: AVIF is `sharp.avif({ quality: round(q*50/80), effort: 3 })`); replicated with the same sharp copy and verified byte-exact against the dev endpoint's WebP output at every width. No `next.config.ts` change was needed for the measurement (the shared dev server was not restarted).

  | width | optimizer WebP q75 | optimizer AVIF q75 | hand AVIF (sharp q80) |
  | --- | --- | --- | --- |
  | 640 | 110,330 | 15,030 | 61,512 |
  | 750 | 158,632 | 21,521 | 91,734 |
  | 828 | 199,618 | 27,177 | 117,621 |
  | 1080 | 358,568 | 45,867 | 214,277 |
  | 1200 | 455,516 | 56,683 | 274,977 |

  The optimizer's AVIF is ~4x smaller but at WebP-level fidelity: RMSE vs the PNG at 750w is 5.13 (optimizer AVIF) / 5.51 (WebP) vs 2.64 (hand AVIF); at 1080w 6.04 / 5.96 vs 2.87. Even `quality={100}` (AVIF q63, needs a `qualities` change) gives 43KB at RMSE 3.76. So next/image cannot reproduce the hand-made grain, the swap would visibly soften the film grain and could not be pixel-identical, and `images.formats` would also switch every next/image on the site to AVIF. See Needs owner decision.

## Needs owner decision

- Hero gradient: accept the optimizer's AVIF (`images.formats: ['image/avif', 'image/webp']`, plain next/image, delete `public/images/hero-gradient/*.avif`) for 21KB instead of 92KB at the phone size, at the cost of a softer grain (RMSE about 2x the hand files) and a site-wide format switch for all next/image output. Proposal: keep the hand AVIFs unless the byte saving matters more than the grain.

## Deferred

- none in scope.

## Files touched outside the original scope list

- `src/components/features/blog/author-byline.tsx` (coordinator added it).

## Verification

- Bonk click test (Playwright, home 1440, clicks 1-20 at ~130ms spacing, spies on `OscillatorNode.start`, `AudioBufferSourceNode.start`, `HTMLMediaElement.play`, a MutationObserver on the button attrs, toasts and bonk/zzz spans), before and after, normal and reduced motion: identical sequences. Toasts at clicks 3/5/7/9/12 (`ouch`, `hey, that's my face`, `stop it`, `okay seriously, stop`, `AAAARGH`), sulk toast and `aria-disabled` + zzz at 16; two oscillator starts per pop click, three per error click during sulk (17-20); `data-bonked` clears 258ms after the first bonk of a run (before 258, after 258); sulk ends 5.0s after click 16 (5001 / 4999ms), zzz leaves ~210-220ms later; motion inline style set in normal mode, never set in reduced mode; settled style `transform: none;` both; eye tracking `translate` after a pointer move to (10,10): `-20.608px -12.3008px` before, `-20.6079px -12.301px` after. Reduced-motion runs play no oscillators in either version.
- Layout boxes (h1, bonk button, gap span, byline chips) on /, /about, /blog, /blog/vscode-setup (solo), /blog/gorkie-sandboxes (co-authored) at 1440/390/320, light and dark: 0 differences (the chip wraps onto line 2 at 320 on the home hero, still identical). h1 text: `Anirudh Sriram.` / `About me.`; CDP accessibility tree identical (heading, button "Portrait of Anirudh Sriram", image).
- Byline match logic: 'Anirudh' true, 'Anirudh & Devarsh' true, 'Devarsh and Anirudh' true, 'Devarsh' false (unchanged expression).
- Screenshots (scratchpad/portrait/before-*.png vs after2-*.png, 30 pairs): all identical except (a) the 16x16 GitHub icon on the home hero (the components agent's Octicons switch, not this change) and (b) about-390-light, where the Next dev "1 Issue" badge shows a page error `Target ref is defined but not hydrated` from motion `useScroll`, coming from `src/app/(home)/about/_components/story-track.tsx`, which another agent edited at 13:08 (after this baseline).
- `bunx tsc --noEmit`: clean. `bunx biome check` on touched files: clean. `bun run check`: fails only on format in `src/app/(home)/colophon/page.tsx` and `src/components/layout/sections/separator.tsx` (not this scope). `bun run check:spelling`: clean.
