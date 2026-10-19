# Simba chat: AI Elements suggestions, message actions, tool rows

Owner-approved set from the variant C mock (scratchpad/aimock/NOTES.md): 1 and 2 in full, 3 only for the tools that left no trace.

## What changed

1. Suggestion chips (empty state)
   - New `src/components/ai-elements/suggestion.tsx` (`Suggestions`, `Suggestion`): dashed rounded-full pills, `bg-card`, text-xs, 14px icon slot, focus ring, wraps and centers.
   - `message-list.tsx` `SuggestedQuestions`: "show me his projects" (Hugeicons work, tinted primary), "what's his stack" (wrench), "how do i reach him" (mail). They sit right under the intro text, inside `ConversationEmptyState`. They are not pinned to the bottom like in the mock, because the scroll fade mask covers the bottom 64px of a scroller that cannot scroll yet. They are hidden while a quoted context is attached, and they go away once there are messages.
   - Sending goes through a new `useAskSimba()` hook in `input.tsx`. The input's `onStart` uses the same hook, so chips send the same `data-client` location part, play the same send sound and trigger the same mascot submit activity.

2. Message actions (last Simba reply only)
   - `ai-elements/message.tsx`: added `MessageActions` and `MessageAction` (ghost `icon-xs` button with a Base UI tooltip, `pointer-coarse:size-8`). `MessageResponse` now carries `data-slot='message-response'`.
   - `ReplyActions` in `message-list.tsx`: Copy and Regenerate. They are only shown when `status === 'ready'`, so they are hidden while streaming or submitted and on errors, where ReplyError keeps its own "Try again". Visibility: `opacity-0` that turns visible on group hover or focus-within. Touch devices see them all the time (`pointer-coarse:opacity-100`).
   - Copy copies the rendered reply text (the `innerText` of the turn's message-response blocks), so markdown syntax stays out of the clipboard. It reuses `useCopyToClipboard` (haptics), `CopyStateIcon` (check swap), the `copy` sound, a "Copied" tooltip and label, a polite sr-only live region and `toast.error` on failure. The panel is `data-sound-press='off'`, so the sounds are played explicitly, as before.
   - Regenerate plays `tap` and calls `regenerate()`, same as the old button.
   - `input.tsx`: removed `RegenerateButton`. The old refresh button only regenerated, so nothing needed a new home. New chat stays in the header's + button. `PromptInputTools` became unused and was removed from `prompt-input.tsx`, and `PromptInputFooter` now defaults to `justify-end`, so Submit stays on the right.

3. Collapsed tool rows (searchDocs, getPageContent, navigate)
   - `ai-elements/tool.tsx`: `ToolHeader` `title` is now a `ReactNode` (it omits the HTML `title` attribute) and it takes an optional muted `detail`. The contact form header renders the same as before.
   - New `tools/step.tsx` (`ToolStep`, `ToolStepField`): a dashed collapsible row, `px-2.5 py-1.5`, measured at 30px tall. The title shimmers while the chat is busy. A pending part on an idle chat shows "stopped". Failed results use the error tone.
   - New `tools/search-docs.tsx`: "sniffing the pages…" while running, "searched the pages" with the query and "N results" when done. Expanded, it shows the query and the top 5 results as links with their paths. This replaces the separate "Used N sources" collapsible.
   - New `tools/page-content.tsx`: "fetching a page…", then "read the page" with the path. Expanded, it shows the page link. Failures show "couldn't find that page" with "not found".
   - `tools/navigate.tsx`: only the rendered JSX changed. The effect, `go` and the scroll logic are untouched. It shows "taking you to /path" (shimmer), then "took you to About, experience". Expanded, it shows the href as a link. Failures show "couldn't find that page" with "not found", and `output-error` shows "couldn't get there".
   - `message-metadata.tsx`: removed the transient tool shimmer and the Sources block. It only shows the thinking or reasoning indicator now, before the first text or tool part.
   - Wording: the earlier lines "Sniffing the pages" and "Fetching a page" are kept but lowercased, to match the navigate and celebrate lines.

Kept as they were: portfolio cards, the contact form, the celebrate line, user bubbles, ReplyError, pending state, the scroll button, trigger.tsx, panel.tsx and the mascot hooks.

## Needs owner decision
- `src/components/ai-elements/sources.tsx` is now unused. Deleting it was blocked in this session, so it is left in place. Please delete it.
- `src/app/api/chat/utils/tools/search-docs.ts` still writes `source-url` parts that nothing renders now (the row reads the tool output). It could drop the writer and the `contextSchema`.
- A pending row on an aborted reply reads "sniffing the pages… / stopped". It could switch to past tense instead.
- Chip copy and icons: "show me his projects" / "what's his stack" / "how do i reach him", with the work, wrench and mail icons.

## Verification
- `bunx tsc --noEmit -p .`: clean. `bunx biome check` on the 11 touched files: clean. `bun run check:spelling`: clean. `bun run doctor`: 100/100.
- Playwright (headless shell, fake `/api/chat`), scripts `scratchpad/aireal/t1.cjs` and `t2.cjs`:
  - Chips: the first chip, activated with the keyboard (focus + Enter), sent `[data-client, text "show me his projects"]`. Chips count was 0 after sending.
  - Actions: opacity 0 without hover and 1 on hover. Copy put the plain text on the clipboard (no `**`), and the label became "Copied". Regenerate went from 1 to 2 requests with `trigger: regenerate-message`. The input no longer has a regenerate button.
  - Touch (iPhone 13 context, `pointer: coarse` true, 390x844): actions at opacity 1 without hover, light and dark.
  - Streaming: the search row shimmers with "running" and there are no actions. Still no actions while text streams. One action set appears when done. Stop mid-tool shows the row as "stopped".
  - Error (HTTP 500): "Simba lost the scent. Try again", with no actions.
  - Failures: navigate, page and search rows show not found / not found / error.
  - Navigate: in fullscreen at 1440 it went to /about#experience and docked the panel (`expanded:false`). On the 390 sheet it went to /about and closed the panel. Rows measured 30px collapsed.
  - No page errors.
- Screenshots: `scratchpad/aireal/` (docked-*, full-*, mobile-*).

## Tool rows reverted

The owner kept parts 1 and 2 and dropped part 3. Tool calls render the way they did at HEAD again, inside the current bubble and avatar layout (every part in column 2).
- Restored `src/components/ai-elements/sources.tsx` from HEAD, with its two TODO markers removed and the `*Props` types un-exported, the same as `tool.tsx`.
- `message-metadata.tsx`: HEAD's logic again. "Used N sources" collapsible from `source-url` parts, and the in-progress lines "Sniffing the pages", "Fetching a page" and "Fetching contact form". It keeps the brain `MessagePending` (decision 16) and leaves out the dead `motion-reduce:animate-none`.
- `message-list.tsx`: no searchDocs or getPageContent branches, so those parts render nothing, as at HEAD.
- `tools/navigate.tsx`: HEAD's JSX again ("taking you to /path…", "took you to <link>", "couldn't find that page"). The logic is unchanged (`claimToolCall`, docking or closing the panel, the hash scroll).
- `ai-elements/tool.tsx`: `ToolHeader` takes a string `title` again and has no `detail`. The contact form header is HEAD's.
- Deleted `tools/step.tsx`, `tools/search-docs.tsx` and `tools/page-content.tsx`.
- Server: searchDocs writes `source-url` parts again through `contextSchema` plus `toolsContext: { searchDocs: { writer } }` in `route.ts`. The unslop description stays.
- Unslop changed none of the tool-line wording, so the lines use HEAD's capitalization.
- Same as at HEAD: a reply stopped during searchDocs or getPageContent shows only the avatar, and a stopped navigate keeps its "taking you to…" shimmer.
- Checks: tsc, biome on the 7 touched files and spelling are clean, and doctor is 100. A POST with an empty message list gets 400. Screenshots are `scratchpad/aireal/revert-*.png` (script `rv.cjs`).
