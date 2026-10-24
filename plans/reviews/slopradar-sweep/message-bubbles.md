# Simba message bubbles

Owner-approved redesign of the chat turns: user bubbles, plain Simba replies with a small avatar, no role labels or dashed dividers.

## Changed
- `src/components/ai-elements/message.tsx`: `Message` right-aligns user turns (`data-[role=user]:items-end`). `MessageContent` turns into the user bubble through `group-data-[role=user]/message:` variants: `bg-secondary`, `rounded-lg`, `px-3 py-2`, `max-w-[80%]` and `wrap-anywhere`, so long words and URLs wrap. `data-role` is unchanged.
- `src/components/features/assistant/message-list.tsx`:
  - Removed `roleName` and the visible `MessageHeader` labels.
  - Removed `dashed-stack` from the list. The content now has `py-4`. Turns are spaced with `mt-4` before a Simba turn and `mt-6` before a user turn, with `first:mt-0`.
  - Added `SimbaTurn`, used for replies, the pending state and `ReplyError`. It is a two-column grid: a 20px `SimbaChip` (the rest-pose head, existing art) sits on the first line, and the text, metadata and status lines go in column 2. Portfolio cards and the contact form span both columns, so they keep the full width (left edge under the avatar).
  - The user turn renders the context quote and text parts inside the bubble. Text still goes through `MessageResponse`, so markdown and links work as before.
- No mascot code reads the message DOM. `use-reading-eyes.ts` only sets CSS variables on the rig SVG. The grep for `data-role`, `dashed-stack` and `querySelector` found nothing that depends on the list.

## Needs owner decision
- Screen readers: I kept "you" and "Simba" as `sr-only` `MessageHeader`s so the log still says who is speaking. This was "assistant" before. Delete those two lines if you want no label at all.
- User text still renders as markdown, as it did before. A pasted URL becomes an underlined link inside the bubble. Switch to plain text if you want it literal.
- The scroll-to-bottom button is still centered and can overlap a bubble while scrolled up. That is how it behaved before.

## Verification
- `bunx tsc --noEmit -p .`: clean. `bunx biome check` on the 2 files: clean. `bun run check:spelling`: clean. `bun run doctor`: 100/100.
- Screenshots: Playwright headless shell with a fake SSE stream, DPR 2, saved in `scratchpad/bubbles/` (script: `shots.cjs`; `before-*` is the old design).
  - `after-{mobile,docked,full}-{light,dark}.png`, plus `-top` scrolled views for mobile and docked.
  - `after-streaming.png` (mid-reply) and `after-error.png` / `after-error-focus.png` (500 response; Try again gets keyboard focus with a ring).
  - `after-long-{mobile,docked}.png` (long URL and word, long message) and `-scrollbtn` variants. No message overflows horizontally.
