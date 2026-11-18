# Owner decisions: Simba picks (decisions-simba)

Picks 1, 10, 11, 16, 23, 24, 25 and 26 from the owner's decision list. All are done. No page content changed, so the llms routes need no update. Evidence (JPGs, harnesses, logs) is in `scratchpad/decisions-simba/`.

## 1. Hidden Regenerate button
- `input.tsx`: the hidden state is now `disabled:opacity-0`. tailwind-merge drops the Button base's `disabled:opacity-50`, which used to beat `opacity-0`.
- Measured before: opacity 0.5. Measured after: opacity 0, `disabled`, `aria-hidden="true"` and `pointer-events: none`, so it can't be focused or announced.
- The visible state is unchanged: opacity 1, enabled, and `aria-hidden="false"` once an assistant reply exists (checked with a fake stream).
- Evidence: `regenerate-hidden-before-after-shown.jpg`.

## 10. Header buttons at 40px
- `header.tsx`: the three buttons use `size='icon-lg'`. The sizing overrides (`aspect-square h-full w-auto`) and the header's `h-10` are gone.
- `shadow-none ring-0 focus-visible:ring-inset` stay. I tried dropping them and the secondary variant's shadow and ring drew seams between the buttons (`cmp-dropall` test), so they are needed for the look.
- Measured: buttons go from 39x39 to 40x40, docked and expanded. The header is 41px tall (40 plus the dashed divider) where it was 40, and the divider still runs under the buttons.
- Evidence: `header-docked-before-after.jpg` and `header-before-after.jpg` (dark and light docked, dark expanded).

## 11. Cross-fade on the expand/collapse icon
- `header.tsx`: `<IconSwap><IconSwapItem className='inline-flex' key={expanded ? 'shrink' : 'expand'}>`, used the same way as `layout/footer/sound-toggle.tsx`.
- Normal motion: blur, scale and opacity cross-fade over about 300ms.
- Reduced motion: a plain opacity fade, which is IconSwapItem's own behavior.
- Evidence: `icon-crossfade-frames.jpg`. Top row is normal motion, bottom row is reduced motion. Captured at 0.05x WAAPI playback with the panel's FLIP finished, so only the icon moves.

## 16. Thinking icon is the brain
- `message-metadata.tsx` `MessagePending`: `Icons.pawPrint` with `animate-spin` is now `Icons.brain` (Hugeicons BrainIcon, already in `icons.tsx`) with `animate-pulse`. A spinning brain read oddly, and pulse matches the other in-progress status lines.
- The reasoning line already used the brain, so the two "thinking" states now match.
- The paw stays Lucide. `guestbook-band.tsx` still uses it, so `icons.tsx` is unchanged.
- Evidence: `thinking-brain.jpg`.

## 23. Simba tools
- **Validation (`route.ts`):**
  - The loose zod message shape is replaced by `safeValidateUIMessages<ChatUIMessage>({ messages, dataSchemas: chatDataSchemas, tools: chatTools })`.
  - The existing limits stay: 1MB body, 1 to 50 messages, and 100k text characters (text plus reasoning parts).
  - `system` role messages are still rejected. The SDK's schema allows them, so the route checks for them explicitly.
- **Data schemas (`lib/ai/chat/types.ts`):** `chatDataSchemas` holds `client: { location }` and `context: { text }` capped at `MAX_CONTEXT_LENGTH` (1200). `ChatDataTypes` is derived from the schemas. The selection popup slices to the same constant, so the cap has one source.
- **Static tool map, so validation can run before the stream:**
  - `tools/index.ts` exports `chatTools`; the `createChatTools(writer)` factory is gone.
  - searchDocs gets its writer through the SDK's `toolsContext` (`contextSchema` plus `toolsContext: { searchDocs: { writer } }`).
  - `ChatTools` is `InferUITools<typeof chatTools>`.
- **Curl checks against :3111:**
  - A valid message streams (200).
  - Each of these returns 400: a 1300-character context, a system message, an unknown `data-evil` part, a bogus part, a navigate part whose output breaks its schema, and an empty list.
- **searchDocs:** each hit returns `{ title, url, description, tag, excerpt }`. The excerpt is an 800-character window that starts 200 characters before the first query term, or at the top of the page. The full processed page text is no longer returned. The prompt says to fetch full text with getPageContent. It still does not use the Fumadocs search API.
- **celebrate:** returns `{ intensity }`. The client checks `output && live`.
- **renderPortfolio:** `slugs` is gone from `ProjectItem` (catalog) and from the tool's project state. The client never read it.

## 24. Moderation reason limit
- `src/lib/validators/moderation.ts`: the reason field gets `.describe(\`One short, user-facing sentence on why, under ${MODERATION_REASON_MAX_LENGTH} characters.\`)`. The 120 constant stays the single source.
- The JSON schema the model sees now carries both the description and `maxLength: 120`. The prompt directive already stated the limit and is unchanged.
- This is a small edit outside my listed scope. The pick named the schema field.
- Three live moderation calls: a friendly message was allowed, spam and harassment were denied, and the reasons were 43 to 49 characters long.

## 25. Simba prompt dedupe (prompt text 20,530 to 17,646 chars)
- The dash rule now appears once, in core `<voice>`. The duplicate in `<formatting>` is gone.
- The contact-form instructions now live only in the showContactForm tool block:
  - The `contact-forms` directive is removed. Its two unique lines (share the exact name, email and message; never say "i don't know" while the result is in context) moved into the tool's `<output>`.
  - The tool's duplicate `<examples>` are removed, because `examples.ts` already covers trigger, submitted and recall.
  - `<important>` is trimmed to three lines.
- The `<inputs>` blocks that restated the zod describes are gone for searchDocs, getPageContent, navigate, celebrate and showContactForm. renderPortfolio keeps its block, because it carries spec rules the schema doesn't have.
- The celebrate block now has only its `<output>` line. "never just to decorate an answer" moved into the tool description.
- searchDocs' purpose line now says that hits are excerpts.
- **Live check:** I asked the same 8 questions before and after (`before-prompt-answers.txt`, `after-prompt-answers.txt`):
  - projects, testimonials, navigate to the blog, the contact form, confetti, the vscode post and a missing fact all behaved the same.
  - "show me his experience" navigated to /about#experience once, then used renderPortfolio in 4 out of 4 reruns. That is sampling noise, and both are valid answers.
- **Curl checks:** recall of the form contents is exact, a submit is acknowledged briefly, and a cancel is handled gracefully. No dash appeared even when the visitor asked for one.

## 26. Base UI popover for the selection popup
- `text-selection-popup.tsx` now uses `Popover.Root` (controlled), `Portal`, and `Positioner`:
  - The Positioner gets a virtual anchor, `{ contextElement: #main-content, getBoundingClientRect: range rect }`.
  - Placement: side top with an 8px offset on fine pointers, side bottom with a 28px offset on coarse pointers, and `collisionPadding` 8.
  - The Popup has `initialFocus={false}` and `finalFocus={false}`.
  - The hand-written Escape and outside-press handling, `createPortal` and floating-ui are gone. The pointerdown and keydown listeners stay only for the "selection started on a control" guard.
  - `onOpenChange` ignores outside presses inside `#main-content`, as before, so a new drag moves the popup instead of closing it.
- **Harness (`sel.cjs`, real mouse drags; home hero paragraph and the vscode post):** the before and after logs are identical apart from 1px of smooth-scroll noise. Checked:
  - No popup at 0 or 100ms, popup at 350ms, centered 8px above the range.
  - It stays anchored after scrolling.
  - Escape closes it and keeps the selection.
  - An outside press closes it.
  - A selection inside a control gets no popup.
  - Clicking it opens the panel with the selected text as context.
  - The popup stays during a new drag in the page and then moves.
  - Focus and the selection are untouched when it appears.
- Coarse pointer at 390px: side bottom, gap 28.
- Screenshots: `selection-popup-{home,post}-before-after.jpg`. The only pixel differences are the animated portrait face and mascot chip.
- **Differences:**
  - The popup wrapper now has Base UI's `role="dialog"`, with no name. It used to be a plain div.
  - Base UI dismisses an outside press on click rather than on pointerdown, so the final state is the same.
- **Dependencies:** `@floating-ui/react-dom` had no other importer, so I ran `bun remove @floating-ui/react-dom`.
  - package.json loses one line.
  - In bun.lock, the hoisted `@floating-ui/dom` changed from 1.8.0 to 1.7.6 (tiptap's version, which used to be nested), and Base UI's `@floating-ui/react-dom` now nests dom 1.8.0. Every consumer resolves the same version it did before.
  - Backups are `package.json.before` and `bun.lock.before` in the scratch folder. The popup harness was rerun after the removal: same output.

## Verification
- `bunx tsc --noEmit`: clean.
- `bun run check`: 433 files, clean.
- `bun run check:spelling`: clean.
- `bun run doctor`: 68/100, not the expected 83. All 12 findings are outside this scope:
  - `about/_components/story-track.tsx:180` and `ui-sounds.tsx:78` (effect cleanup).
  - Non-component exports in `contributions.tsx`, `not-found-content.tsx`, `header/mobile/item.tsx` and `portrait/static-portrait-chip.tsx`.
  - `page-actions.tsx:166`.
  - The known `prompt-input.tsx:38` and carousel items.
  - These look like other agents' in-progress edits. Nothing in the assistant, chat or ai folders is flagged.
- No `TODO(slopradar)` markers in scope. No em dashes added to user-facing copy.

## Files changed
- `src/components/features/assistant/`: `header.tsx`, `input.tsx`, `message-metadata.tsx`, `text-selection-popup.tsx`, `tools/celebrate.tsx`.
- `src/app/api/chat/`: `route.ts`, `utils/tools/index.ts`, `utils/tools/search-docs.ts`, `utils/tools/celebrate.ts`, `utils/tools/render-portfolio.ts`.
- `src/lib/ai/`: `chat/types.ts`, `chat/catalog.ts`, `prompts/chat/directives.ts`, `prompts/chat/tools.ts`.
- `src/lib/validators/moderation.ts`, which is outside scope (pick 24).
- `package.json` and `bun.lock` (the `bun remove`).
