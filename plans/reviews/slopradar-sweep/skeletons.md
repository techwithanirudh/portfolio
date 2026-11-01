# Skeleton audit (agent: skeletons)

Tip applied: measure the loaded UI with Playwright, then size each skeleton to it (Aiden Bai), plus the speed half (Theo: make it fast enough that the skeleton never shows).

Method. Headless Chromium against the dev server at 1440 and 390, light and dark, reduced motion, animations frozen for screenshots. For every skeleton the skeleton and the loaded UI were measured in the same page load, with the boxes of the container and every leaf block (text lines, inputs, buttons, avatars, images) and the PerformanceObserver `layout-shift` entries after the swap.
- Server Suspense fallbacks (guestbook entries, search page, about contributions): the real page with the streamed reveal script (`$RC`/`$RR`) held back 3s by route interception, so the real fallback stays up and then React swaps in the real server content.
- Session skeletons (guestbook form, footer user button): `/api/auth/get-session` delayed 2.5s by route interception, then answered with `null` (signed out) or a fake session (signed in). No database involved.
- Search results: `/api/search` delayed 2s and answered with the real response, for many (react, 18), few (depensa, 4), one (vscode) and empty (zzqqxx) results.
- Signed-in only or client-only states (account settings and sessions, guestbook entries signed in, one and empty, contributions, Simba pending, reasoning, contact form, markdown fallback): a throwaway client harness at `src/app/(home)/zz-skeleton-preview/` that rendered the real skeleton for 2.5s and then the real loaded component with fake data (Simba at the panel's 358px width through a fake `ChatContext`). Deleted at the end; `git status` shows no trace.

Note on CLS: when a skeleton is replaced by new elements Chrome reports CLS 0 for the swap itself, because only elements that existed before and moved count. So the "px" columns below (box deltas of the container and of what sits after it) are the real measure; CLS is listed where something that existed before moved.

Artifacts: side-by-side JPGs (skeleton left, loaded right) in `scratchpad/skeletons/sbs/` (`*-before.jpg`, `*-after.jpg`, `*-unchanged.jpg`), raw boxes in `scratchpad/skeletons/{before,after}-*.json`, scripts `session.cjs`, `search.cjs`, `stream.cjs`, `harness.cjs` there too.

## Inventory

| # | Skeleton | file:line | Stands in for |
|---|---|---|---|
| 1 | `GuestbookEntriesSkeleton` | src/app/(home)/guestbook/_components/skeleton.tsx:5, used at guestbook/page.tsx:84 `<Suspense>` | the entries list (server, DB plus session) |
| 2 | Guestbook form pending | src/app/(home)/guestbook/_components/form.tsx:78 | the form while `useSession` is pending (signed-out prompt or the signed-in textarea) |
| 3 | `UserButton` pending | src/components/features/auth/user-button.tsx:46 | footer avatar (twice: desktop and mobile rows of the footer) |
| 4 | Search page `<Suspense fallback>` | src/app/(home)/search/page.tsx:15 | `SearchClient` (input, scope tabs, results) |
| 5 | `ResultsSkeleton` | src/app/(home)/search/_components/search-client.tsx:56, shown at :253 | the first result list of a visit |
| 6 | `ContributionsFallback` | src/app/(home)/_components/contributions.tsx:167, `<Suspense>` at :162 | the GitHub contribution graph (about page) |
| 7 | About activity feed | src/app/(home)/about/_components/feed/index.tsx:6 | no fallback: async server component, not in a Suspense boundary |
| 8 | `AccountSettingsSkeleton` | src/app/(auth)/account/_components/account-settings-skeleton.tsx:5, account/page.tsx:42 | avatar, display name, email, created date |
| 9 | `ActiveSessionsSkeleton` | src/app/(auth)/account/_components/active-sessions-skeleton.tsx, account/page.tsx:50 | the session rows |
| 10 | `ContactFormSkeleton` | src/components/features/assistant/tools/contact-form.tsx:238, used at message-list.tsx:162 | Simba's contact form while the tool input streams |
| 11 | `MessagePending` | src/components/features/assistant/message-metadata.tsx:18, used at message-list.tsx:124 and message-metadata.tsx:63 | the reply's first line before any token arrives |
| 12 | Reasoning line and tool status lines | message-metadata.tsx:57 and :105 | status while thinking or running searchDocs/getPageContent/showContactForm |
| 13 | Portfolio pending line | src/components/features/assistant/tools/portfolio.tsx:192 (`ToolPendingLine`, tools/status-line.tsx:6) | the cards the renderPortfolio tool returns |
| 14 | Markdown `<Suspense fallback>` | src/components/ai-elements/markdown.tsx:108 | the rendered markdown of a reply (invisible plain-text paragraph) |
| 15 | BlurImage placeholder | src/components/blur-image.tsx:40 | the image itself, blurred and pulsing until load |
| 16 | Post comments `<Suspense>` | src/components/features/blog/post-comments.tsx:43 | no fallback (server markup kept until the widget code loads) |
| 17 | Sign-in dialog `<Suspense>` | src/components/features/auth/sign-in-modal.tsx:68 | no fallback, closed dialog, nothing to size |

No `loading.tsx` exists anywhere in `src/app`.

## Per skeleton: shift before and after, what changed, speed

### 1. Guestbook entries (changed)
- Measured: section is `fill='contain'`, fixed at 448px, so the swap never moves anything outside it (CLS 0 before and after, real page, all four combos). Rows: skeleton 204px, real entries 197 (no signature), 204 (signature), 224 (two-line message), 284 at 390 (long message); rows already matched.
- Inside the row the reaction placeholders were 28px rounded pills (`h-7 w-16/w-14 rounded-full`) where the real buttons are 32px square (`size='sm' shape='square'`, 72px and 91px wide), and two 32px edit/delete squares showed on every row although signed-out visitors (most) never get them and signed-in ones only on their own entries.
- Changed: pills to `h-8 w-18 rounded-none` and `h-8 w-23 rounded-none`; removed the action squares and the now-pointless flex row around the byline. Row height unchanged (204).
- Speed: the shared entries are already `unstable_cache`d; warm, the fallback lived 1 to 7ms (it streams in the same response chunk), so it is a flash for signed-out visitors. Signed in, the viewer's reactions query (Neon HTTP) adds one round trip. Proposal: keep the boundary for a cold cache, or drop it and render entries directly since the warm cost is a cache read plus `getSession`.

### 2. Guestbook form session skeleton (unchanged, already exact)
- Measured: 382px tall before and after, every block identical (label 14px at y56, textarea or prompt box 160px at y78, line 20px at y246, button 36px at y290), signed in and out, 1440 and 390, light and dark. CLS 0. `sbs/guestbook-form-*-unchanged.jpg`.
- Speed (highest impact, above the fold): visible 300 to 700ms on every guestbook visit in dev (hydration plus `/api/auth/get-session`, 18 to 180ms). The page already resolves the session on the server (`loadEntries` calls `getSession`). Proposal: pass the server session (or just `user`) into `GuestbookForm` as initial data, or enable better-auth's session cookie cache, so a visit that has the data renders the right form immediately.

### 3. Footer user button (unchanged, already exact)
- Measured: trigger 38x38 and avatar 36x36 at (1,1) in both states, signed in (initials) and out (user icon). CLS 0.
- Speed: same session fetch as #2, on every page (footer is usually below the fold). Proposal: same server-session hand-off from the layout, which would also remove the disabled-button window.

### 4. Search page Suspense fallback (changed)
- Before: a 477px (1440) or 502px (390) block of five bars outside the page container (full bleed, x=24 at 1440 instead of inside the bordered 1280px column), then the loaded `Section fill='contain'` (612/663px) with a 40px input row and a 38px dashed tab row. Every block landed in a different place.
- After: the fallback is the same `Section fill='contain'`, a 40px input row (16px icon placeholder exactly where the search icon renders, 12px from the edge), and the dashed tab row built from the same `tags` list and the button's own `p-2 px-3 text-sm` line box (`box-content h-lh`). Section 612/663 before and after the swap, icon and tab row at identical coordinates. `sbs/search-fallback-*`.
- Speed: in dev the page renders dynamically and the fallback lives 2ms; in production the page is static and `SearchClient` reads search params through nuqs, so the fallback is what every visitor sees until hydration. Proposal: keep the input and tabs outside the suspending part (only the results need the query), or read `searchParams` in the page and pass the initial query down.

### 5. Search results skeleton (changed in the follow-up)
- Before: title rows match (45px), but each excerpt row was 38px against the real 44px (one `text-sm` line plus `p-3`), so every excerpt drifted 6px (24px by the fourth row). Container fixed, CLS 0.
- After: excerpt row `relative box-content flex h-lh items-center p-3 ps-7 text-sm` (the 14px bar centered in the real line box). Re-measured with the real API delayed: excerpt rows 44px like the loaded ones, second title row at y101 in both (0px drift). Loaded shots before and after identical (16 combos, one 4px scrollbar strip at 390 dark).
- Speed: about 170ms in dev (100ms `useDocsSearch` debounce, the API call, and the lazy `parse` chunk), first query of a visit only (later queries keep the previous results). Under the ~200ms threshold, so it mostly flashes. Proposal: warm `/api/search` and preload the parse chunk on mount or input focus, or switch to the static Orama index so results are local; or delay showing the skeleton by ~150ms.

### 6. Contributions graph fallback and graph (changed)
- Before: fixed `h-45` (180px plus border = 181) against the graph's 285px at md and up (+104px; CLS 0.026 real page, 0.053 harness) and 235px on phones (+54px; CLS 0.045). Measured the loaded graph at 320 to 1440: 234px below ~470px (footer text wraps), 209px from 480 to 767, 284px from 768 (plus the 1px dashed-stack border).
- After: `h-58.5 min-[480px]:h-52.25 md:h-71` with a comment; skeleton and graph equal at 320, 460, 480, 600, 767, 768, 1024, 1440 (0px). Error path (API down, short "unavailable" notice) now shrinks 285 to 69 instead of 181 to 69; rare.
- Loaded graph (fixed in the follow-up): the server always rendered the desktop block size (`useIsMobile` started false), so on phones the server HTML was 310px and hydration dropped it to 235px. Measured with JS off (streamed content revealed by hand) against the hydrated page: 320 and 390 jumped -75px, 768 and 1440 0px. Now the about graph renders both block sizes (12/3 below md, 23.5/2 from md) and CSS shows one (`md:hidden` / `hidden md:flex`), the same pattern the Simba Contributions card already uses; `useIsMobile` is gone from it, and the single tooltip sits after the two graphs. Server HTML and hydrated now 235/235 at 320 and 390, 285/285 at 768 and 1440 (0px). The shared `ContributionGraph` component and the Simba card are untouched. Pixel check: the 8 tooltip and legend shots (1440 and 390, light and dark; each covers the whole graph) are identical; the 4 plain graph shots differ only by at most 6/255 in brightness from the reveal animation still settling at capture time. Cost: the hidden size's SVG is in the DOM too (about 365 extra rects).
- Speed: the about page has no request-time data, so it is prerendered and the graph is in the HTML; the page shell also waits for the un-suspended activity feed, so the fallback essentially never shows in production (4ms in dev). Proposal: await the contributions on the server next to the feed and pass the data, dropping `Suspense` and `use()`.

### 7. About activity feed (no skeleton)
- `Feed` awaits GitHub (cached 5 minutes) with no Suspense, so the whole about page waits for it. Fine while prerendered; if the page ever turns dynamic, wrap it in Suspense with a fallback sized from the measured feed box (`max-h-96` list plus the 40px header).

### 8. Account settings skeleton (changed)
- Before: value lines `h-4` (16px) against `text-sm` text (20px): each of three rows 4px short, card 419 against 431px (+12px), and the Edit button 2px off vertically. CLS 0.0065 (1440) / 0.008 (390) together with #9.
- After: value lines `h-5`; every block identical (431/367px, Edit at y173/149 in both).
- Speed: `getSession` is React `cache`d; this boundary only waits for the session the page needs anyway. Proposal: render it outside Suspense and stream only the sessions list.

### 9. Active sessions skeleton (changed)
- Before: three separate bordered cards with `space-y-4` (374px) against borderless `dashed-stack` rows of 124 to 126px; lines `h-4`/`h-3` with `space-y-1` against 20/22px and 16px lines with `space-y-0.5`. One session: 374 to 126 (-248px, CLS 0.089 / 0.061); three: 374 to 356 (-18px).
- After: one row with the real row's structure (`dashed-stack`, `rounded-none border-0` flat card, `h-5.5` OS line to match the "This device" badge, three `h-4` lines with `space-y-0.5`, `w-21` Revoke). One session: 126 to 126 and 158 to 158 (0px). Three sessions: grows 126 to 356 below; on the real page the section is `flex-1`, so the footer only moves when the list outgrows the viewport. One row because the current session is the only one every account is sure to have.
- Speed: `listSessions` is a DB call per request. Proposal: none beyond #8; it is a private, rarely visited page.

### 10. Simba contact form skeleton and status line (changed)
- Before: intro and labels 12px against 16px (`text-xs`), field gap 8px against 12px (`FormItem`'s `grid gap-2` plus the form's `space-y-1`): the skeleton was 28px shorter than the form, every field drifting 4 to 28px.
- After: `h-4` lines and the same `FormItem className='space-y-1'` wrapper the form uses, cancel `w-17`. Every block now sits at the same offset from the tool header as the form (intro +45, inputs +101/+173, textarea +245, buttons +337, button widths 220/68).
- Status line (follow-up): while the tool input streamed, `MessageMetadata` also showed "Fetching contact form" above a card whose header already says "drafting", then dropped it, so the card jumped up 28px. `showContactForm` is now in `hasOwnStatus` (and its `toolStatus` entry is gone). Verified on the real panel with `/api/chat` rerouted to a local fake stream (tool input streaming 2.5s, then input available): card 53px below the assistant header then 25px (-28px) before, 25px then 25px after, light and dark; skeleton block and form block both 383px. Loaded form shots identical.
- Speed: lasts as long as the model streams the tool input (a few hundred ms). Nothing to prefetch.

### 11. Simba `MessagePending` (changed)
- Before: 16px row (the icon) replaced by the first 20px text line: +4px. After: `h-5`, the icon centered in a text line's height; 20 to 20px.
- Speed: model time to first token; legitimate.

### 12. Reasoning and tool status lines (unchanged)
- 20px line replaced by a 20px text line: 0px.

### 13. Portfolio pending line (unchanged)
- A one-line status replaced by cards of unknowable height; not a sizable skeleton. Speed: server tool time; legitimate.

### 14. Markdown Suspense fallback (changed in the follow-up)
- The invisible fallback paragraph collapsed newlines: a reply with a list measured 40px as fallback against 149px rendered (-109px). Now `invisible whitespace-pre-line`: 140px against 149px (the 9px left is the list's own margins). It only shows on a reply's first mount, so this mostly matters for long replies that arrive in one chunk. Loaded markdown unchanged.

### 15. BlurImage (unchanged)
- With every image delayed 2.5s on /uses, /blog/vscode-setup and /projects/depensa, the pulsing blurred box and the loaded image have the same box (the placeholder is the image itself); CLS 0.

### 16. Post comments (unchanged)
- No fallback: React keeps the server markup until the widget code loads near the viewport. The widget's own spinner is third-party (@fuma-comment/react). Its `/api/comments/<slug>/auth` call took 1.3s in dev and then grew the widget 4px (footer shift 0.0037 at 390). Proposal: prefetch the auth state with the widget code, or reserve the 4px.

### 17. Sign-in dialog (unchanged)
- No fallback and nothing visible while closed.

## Speed proposals, ranked by impact (proposals only, none implemented)
(Item 3's mobile jump and item 7 are now fixed.)
1. Session skeletons (#2 guestbook form above the fold, #3 footer avatar on every page): hand the server session down (the guestbook page already has it) or enable the better-auth cookie cache. Removes the most-seen skeleton (300 to 700ms in dev).
2. Search page fallback (#4): in production it shows on every visit until hydration. Render the input and tabs outside the suspending component or read the query on the server.
3. Contributions on mobile (#6): fix the 75px hydration jump of the loaded graph with CSS sizing; and drop the Suspense since the data is already in the prerendered HTML.
4. Search results (#5): warm the API and the parse chunk, or use a static index; or delay the skeleton.
5. Guestbook entries (#1): flashes 1 to 7ms warm; consider dropping the boundary.
6. Account (#8): render settings outside Suspense.
7. Simba contact form (#10): drop the duplicate status line (owner decision).
8. Comments (#16): prefetch auth or reserve height.

Flash list (under ~200ms, worth removing or delaying): guestbook entries fallback (1 to 7ms warm), search page fallback in dev (2ms; long in production), contributions fallback (4ms dev, never in production), search results skeleton (~170ms dev).
Skeletons where the data is already server rendered: contributions fallback (prerendered about page), guestbook entries (cached query, streams in the first chunk), account settings (session already resolved for the page).

## Follow-up (owner: do everything)
The earlier "needs owner decision" and "deferred" items are done: search results excerpt rows (#5), markdown fallback (#14), contact form status line (#10), and the mobile graph jump (#6). Nothing is left deferred or waiting on a decision.

## Files changed
- src/app/(home)/search/page.tsx (fallback markup; imports `Section`, `tags`)
- src/app/(home)/_components/contributions.tsx (fallback heights plus a two-line comment on where they come from)
- src/app/(home)/guestbook/_components/skeleton.tsx
- src/app/(auth)/account/_components/account-settings-skeleton.tsx
- src/app/(auth)/account/_components/active-sessions-skeleton.tsx
- src/components/features/assistant/tools/contact-form.tsx (`ContactFormSkeleton` only)
- src/components/features/assistant/message-metadata.tsx (`MessagePending` gets `h-5`; `showContactForm` joins `hasOwnStatus`)
- src/app/(home)/search/_components/search-client.tsx (`ResultsSkeleton` excerpt row)
- src/components/ai-elements/markdown.tsx (fallback paragraph `whitespace-pre-line`)
- src/app/(home)/_components/contributions.tsx also: both block sizes rendered and switched by CSS, `useIsMobile` removed

## Verification
- Loaded UI pixel check: every loaded-state screenshot from the before run compared with the after run over the shared area: identical except signature image antialiasing on the guestbook and the site header in the account harness (scroll position differs because the page got shorter); no loaded component changed.
- `node shots.cjs mine-skeletons` against base: about, post, search (1440 and 390 dark) and guestbook 390 identical. Differences that are not from this change: contact and home (a 16 to 20px icon), guestbook 1440 (28x4px at the bottom right), search 390 light (4px scrollbar strip), simba panel (panel position and input, assistant work from other agents).
- `bunx tsc --noEmit`: pass. `bun run check`: 433 files, no fixes. `bun run check:spelling`: clean.
- Harness `src/app/(home)/zz-skeleton-preview/` deleted (twice: it came back briefly for the markdown re-measure); `git status` shows no trace.
- Follow-up: tsc pass, `bun run check` 433 files no fixes, spelling clean. Scripts `graph.cjs` (server HTML vs hydrated, 12 graph/tooltip/legend shots), `fakestream.cjs` (local fake chat stream), `ssrshot.cjs`. Artifact JPGs (19, about 313KB) in `scratchpad/skeletons/artifact/`.
