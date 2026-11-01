# React Doctor sweep

Score: 68 (2 errors, 10 warnings) to **100 (no issues)**, react-doctor 0.9.x via `bun run doctor`.
12 findings: 9 fixed in code, 3 judged verified false positives and suppressed on a single line each (2 comments, one covers 3 rules on the same call).

## Fixed

| Finding | Rule | Fix | Evidence |
| --- | --- | --- | --- |
| `src/app/(home)/about/_components/story-track.tsx:180` | effect-needs-cleanup (error) | `return progress.on('change', follow)` became `const unsubscribe = progress.on(...)` + `return () => unsubscribe()`. The old code already returned motion's unsubscribe handle (detector false positive: it does not model returning the call directly), so this is an equivalent teardown the detector can read. | /about scroll test: `[data-reached]` count 1,2,3,4,5 while scrolling down, back to 1 at the top. |
| `src/components/ui-sounds.tsx:77` | effect-needs-cleanup (error) | The `submit` handler (its 120ms `setTimeout` waits for validation) closed over nothing from the effect, so it moved to module scope as `playSubmit`, next to `playPress`, which already lives there. The effect still adds and removes the same reference with `{ capture: true }`. Only one `<UiSounds />` is mounted (`src/app/provider.tsx`), so the shared reference cannot dedupe a second listener. | Browser: an injected form's `requestSubmit()` started 1 audio source; a button press started 1; CDP shows the capture `submit` listener on `document`. |
| `src/components/ui/carousel.tsx:115` | jsx-no-constructed-context-values | Context value wrapped in `React.useMemo` with all 8 inputs as deps. The value is the same, and its identity now changes only when an input changes. | ArrowRight/ArrowLeft and the Next button still move the testimonials track (`translateX` 0 to -319.5 and back). |
| `src/components/page-actions.tsx:165` | anchor-has-content | `render={<a href rel target />}` became a render function `({ children, ...props }) => <a {...props} href rel target>{children}</a>`. Base UI already injected the children at runtime (false positive). The children are now explicit, and the DOM is unchanged. | The menu reads `menuitem "View as Markdown" / "Open in GitHub" / "Open in ChatGPT" / "Open in Claude"`. Each is an `<a>` with `target=_blank rel=noopener`, the right href and the `group/item` class. |
| `src/components/features/contributions.tsx:400` | only-export-components | `ContributionGraphTotalCount` returned `children(...)` with no JSX, so it was not seen as a component. It now reads the hook on its own line and returns `<>{children({ totalCount })}</>`. The fragment adds no DOM. | /about: the `<div>2,398 contributions in the past 365 days.</div>` is still a direct child of the footer. |
| `src/components/features/not-found/not-found-content.tsx:87` | only-export-components | `notFoundMetadata` moved to the new `src/components/features/not-found/metadata.ts`. `src/app/not-found.tsx` and `src/app/(home)/not-found.tsx` import it from there. | The unknown URL still has the title "Not found \| Anirudh Sriram" and robots `noindex`. |
| `src/components/layout/header/mobile/item.tsx:8` | only-export-components | The `pillItemVariants` cva moved to the new `src/components/layout/header/mobile/pill-item-variants.ts`. `item.tsx` and `pill.tsx` import it. | 390px /about: the pill links keep `size-8`, About has `aria-current=page` with `bg-primary/10`, and the others are muted. |
| `src/components/portrait/static-portrait-chip.tsx:13` | only-export-components | `portraitChipClassName` and `inlineChipClassName` moved to the new `src/components/portrait/chip-class-names.ts`. `static-portrait-chip.tsx`, `bonk-chip.tsx` and `portrait-heading.tsx` import them. | The inline chip class string renders unchanged (`... ring-inset mx-[0.04em] translate-y-[0.08em]`). |

## Verified false positives, suppressed on one line

- `src/components/ui/carousel.tsx:96`: no-pass-data-to-parent, no-pass-live-state-to-parent and no-prop-callback-in-effect all fire on `setApi(api)`. The Embla api is created inside `useEmblaCarousel` in this child and only exists after Embla's own effect runs, so the parent has no other way to get it. This is the documented exception for no-pass-data-to-parent ("the child owns an external subscription ... the parent cannot subscribe to"). The only caller, `src/app/(home)/_components/testimonials.tsx`, needs the api for autoplay and prev/next. Removing `setApi` would break the shadcn public API. Suppressed with `react-doctor-disable-next-line <3 rules> -- reason` on the line above.
- `src/components/ai-elements/prompt-input.tsx:38`: no-prevent-default. The chat owns submission on the client (`useChat().sendMessage`). The rule's own fix prompt says to keep `onSubmit` + `preventDefault` when the product owns a client-side submission lifecycle. The suggested `<form action>` would run `onStart` as an async transition, so `setInput('')` would not commit until `sendMessage` resolves (after the whole stream). It would also auto-reset the form and stop passing the event to `onSubmit`. Suppressed on the line above `<form>`, with that reason.

## Remaining

None. `bun run doctor`: "Score: 100 / 100 Great, No issues found".

## Verification

- `bunx tsc --noEmit -p .`: clean.
- `bunx biome check` on the 17 touched files: clean. Biome only re-sorted the new import in `bonk-chip.tsx`.
- `bun run check:spelling`: clean.
- Browser: Playwright headless shell against the shared dev server at http://localhost:3111 (left running). Script: scratchpad `doctor-verify.cjs`.
  - Carousel keyboard and buttons work.
  - Story-track progress follows scroll both ways.
  - UI sounds play on press and on submit.
  - The view-options links keep their names and attributes.
  - Not-found metadata is unchanged.
  - Simba input: Shift+Enter inserts `\n` with no request. Enter fires exactly one `/api/chat` POST (intercepted and stubbed with 500) and clears the input.
  - The only console errors were the expected 404 (not-found page) and the stubbed 500.

## Owner decisions

- The two suppressions above: accept them, or change the carousel API (for example, let the parent own `useEmblaCarousel`) or the chat submission model.
- Three new small modules for the export split: `not-found/metadata.ts`, `header/mobile/pill-item-variants.ts` and `portrait/chip-class-names.ts`.
