# Speed pass (agent: speed)

The seven speed proposals from the skeleton audit (skeletons.md), all approved by the owner ("make it faster so none of this is needed").

Method: the audit's approach, run on the dev server at 1440x900 and 390x844 with reduced motion. `scratchpad/speed/vis.cjs` samples every animation frame to see which skeletons are actually painted on screen (in the viewport, with an effective opacity above 0) and records CLS with a PerformanceObserver. Each scenario ran 4 to 5 times per width, and the first, cold run is dropped. Slow paths were reproduced with route interception (`/api/auth/get-session`, `/api/search`, the streamed `$RC` reveal) or with a throwaway delay that was then reverted. Signed-in states came from a throwaway harness at `src/app/(home)/zz-speed/`, now deleted; nothing touched the database. Artifacts are in `scratchpad/speed/`: `before-*.jpg` and `after-*.jpg` (about 15KB each), `*-vis-*.json`, and the scripts `vis.cjs`, `auth.cjs`, `comments.cjs`, `about.cjs`, `snap.cjs`, `searchflow.cjs` and `diff.py`.

## Results

| # | Item | Before (dev) | After (dev) | CLS |
|---|---|---|---|---|
| 1 | Guestbook form, signed out | skeleton painted 378 to 1494ms (1440), 534 to 843ms (390), 8 of 8 runs | not painted, 0 of 8 | 0 to 0 |
| 1 | Guestbook form, signed in (harness, get-session 400ms) | skeleton until get-session settles (the audit measured 300 to 700ms) | not painted, 0 of 8; the server user renders the textarea at first paint | 0 |
| 1 | Footer avatar | never painted on load in any run (guestbook, search, about, contact, 404; both widths): the footer sits below the fold and reveals late | unchanged (see risks) | 0 |
| 2 | Search page fallback | dev: 1 frame. Production: the page was static, so every visit showed the fallback until hydration | route renders per request: server HTML has the real input and scope tabs (dev curl), with no fallback | 0 |
| 3 | Contributions fallback | the dev HTML had the fallback and spinner (the audit measured 4ms) | server HTML: 2 graphs, 732 day cells, 0 spinners, 0 `B:` templates. Box server/hydrated: 235/235 at 320 and 390, 285/285 at 768 and 1440; next heading at the same y | 0.0001 at phones, unchanged from before |
| 4 | Search results, `/search?q=react` load | painted 167 to 1384ms, 8 of 8 | 0 of 6 painted (keyed version) | 0 |
| 4 | Search results, fast typing (30ms per key) | painted 352 to 751ms | 0 in 4 of 6; 21ms and 303ms in two dev runs while a chunk was compiling | 0 |
| 4 | Search results, human typing (180ms per key) | painted for the whole pending time, 116 to 347ms | 0 of 4 painted | 0 |
| 4 | Search results, API slowed by 1s | painted from the first keystroke | painted from about 200ms after the last keystroke until results (882 to 1083ms) | 0 |
| 5 | Guestbook entries | painted 1 frame, 8 of 8 runs | 0 of 8 | 0 |
| 5 | Guestbook entries, query slowed 1.5s (throwaway, reverted) | n/a | still streams: first byte 0.41s against 1.94s total; skeleton shown from about 200ms after mount for about 1.26s | 0 |
| 6 | Account settings | skeleton while the boundary waited for the session | settings are in the server HTML outside Suspense (harness: not painted); signed-out `/account` now gets a real `307` to `/?signin=%2Faccount` | 0 |
| 7 | Comments form | server placeholder 82px, then 86px for visitors once auth answers (+4px; at 390 a 0.14 layout-shift entry `FOOTER 136/-4`) | 86px in the server placeholder, while loading, signed out and signed in; the +4px entry is gone | see the finding below |

## Per item

### 1. Session skeletons
- Change: `guestbook/page.tsx` awaits `getSession()` (React `cache`d, so `loadEntries` reuses it) and passes `initialUser` to `GuestbookForm`. The form uses that user until the client's first session check settles, then switches to the live `useSession` value; a `checked` flag (state set during render) guards the switch. The pending skeleton branch is gone. A failed lookup is caught with `unstable_rethrow`, the same pattern the entries use, and falls back to signed out, as the client check did.
- I picked the server-session handoff over the better-auth cookie cache. The cookie cache only makes `get-session` faster on the server; the client still renders pending through hydration and the fetch. It would also let a revoked session stay valid until `maxAge`.
- Auth transitions (`auth.cjs`, network faked):
  - server signed in, client signed in: signed-in form from the first frame, no change.
  - server signed in, client says signed out (a session revoked elsewhere): signed-in form, then the signed-out prompt as soon as the check returns (824ms with a 400ms answer).
  - Sign out from the footer menu: the prompt appears right away. A later window-focus refetch while signed out does not flash the stale server user back, which is what the `checked` guard is for.
  - server signed out, client signed in: the prompt, then the form.
  - Sign in is an OAuth redirect, so it is a fresh server render.
- Footer avatar: not changed. It renders on every page, and most pages are static, so there is no server session to hand down without making every page dynamic. It was never painted on load in any measured run.
- Evidence: `before-guestbook-form-*.jpg`, `after-guestbook-form-signed-{out,in}-pending.jpg` (taken with get-session held for 2.5s: the real form already shows).

### 2. Search page
- Change: `search/page.tsx` calls `await connection()` and renders `SearchClient` directly, with no Suspense or fallback. This follows the Next 16 `useSearchParams` docs: with a dynamic route the hook works during SSR.
- Why not keep it static with a real-looking shell as the fallback: the input, tabs and "Start typing" line are `ViewAnimation` reveal items. Swapping a fallback for the client tree inserts new nodes, which the reveal script hides and fades in again, so the shell would blink. Keeping the same DOM through hydration needs a server render.
- Flow check (`searchflow.cjs`):
  - direct `/search?q=react`: input "react", All active, 36 results.
  - Blog tab: `?q=react&tag=blog`, 4 results.
  - typing "vscode": `?q=vscode&tag=blog`, 2 results.
  - Back goes to `/blog` (nuqs replaces history entries, unchanged by this work); Forward restores `vscode` with Blog active and 2 results.
- Risks:
  - `/search` is no longer served from the CDN. Client navigation from the blog and projects search boxes (`router.push`) now waits for a server render.
  - With `?q=` the input still fills right after hydration, because `useDocsSearch` starts from an empty string. That is the same as dev before.
  - `?tag=` is now active in the server HTML.

### 3. Contributions
- Change: `about/page.tsx` awaits `getGitHubContributions()` (still `unstable_cache`d for a day). `contributions.tsx` takes `Activity[]` and loses `Suspense`, `use()`, `ContributionsFallback` and the `Icons` import.
- Evidence: `about.cjs`, comparing server HTML (JS off) with the hydrated page at 320, 390, 768 and 1440 (table above). Pixel shots of about are identical to base.

### 4. Search results skeleton
- Change: a theme animation `--animate-delayed-show` in `globals.css`, a 0s `delayed-show` keyframe with a 200ms delay and `backwards` fill, so the skeleton stays transparent for its first 200ms. It is applied to `ResultsSkeleton`, which is now keyed by the query (`key={search}`), so the delay restarts on every keystroke. The skeleton only appears when results lag 200ms behind the last keystroke; normally they arrive after the 100ms debounce plus the fetch.
- Opacity is used instead of display, so the `role=status` "Searching" text is still announced. No state or timers were added.
- I did not warm the index or use a static one. The remaining dev cost is fumadocs' lazily imported fetch client and parse chunk, which are internal paths. Switching away from the deprecated `useDocsSearch` is a bigger change in a fumadocs file.

### 5. Guestbook entries
- Change: the same `animate-delayed-show` on the root of `GuestbookEntriesSkeleton`. I kept the boundary instead of removing it. Removing it would make the whole page wait for the entries query: a cold cache, or the signed-in viewer's reactions round trip, would block the first byte. With a delayed fallback the warm case never paints it and the slow case still streams. The section is `fill='contain'` (fixed 448px), so the hidden 200ms is an empty box of the same size.
- Evidence: `after-guestbook-entries-pending-{100,600}ms.jpg` (stream held 3s: empty at 100ms, skeleton at 600ms). The throwaway delay in `loadEntries` was reverted; `grep ZZ-THROWAWAY` finds nothing.

### 6. Account settings
- Change: `account/page.tsx` awaits `requireSession()` and renders `<AccountSettings user={session.user} />` outside Suspense. `ActiveSessions` takes `currentToken` from the same session and keeps its Suspense and `ActiveSessionsSkeleton`, because `listSessions` is a real database call.
- Deleted, now unused: `account-settings-section.tsx`, `active-sessions-section.tsx`, `account-settings-skeleton.tsx` (copies in `scratchpad/speed/`).
- Signed out: the redirect now happens before streaming, so it is a real `307` to `/?signin=%2Faccount` (curl) instead of a redirect inside a streamed boundary. The destination is unchanged.
- Evidence: harness `after-account-settings-server.jpg`, no skeleton painted.

### 7. Comments
- Finding: the 4px shift was not about auth timing. The widget's server placeholder (`p.h-[38px].mb-9`) reserves a 36px toolbar. Visitors end with a 40px toolbar, because the "Sign In" button is 32px against the 28px send icon. Prefetching auth could not fix that.
- Change: in `post-comments.tsx`, the comment form's toolbar row gets `min-h-10` and the placeholder gets `mb-10`, scoped to the first form under the widget root. The near-viewport hook and lazy loading are untouched.
- Result: the form is 86px in every state. Signed-out loaded clips are pixel-identical to before (1440 and 390). Signed-in loaded is 4px taller than before (toolbar 36px to 40px, send button still centered): the one intended visual change, and only signed-in visitors see it.
- Not fixed, found while measuring: the comments list loads client-side and grows about 100px when it arrives. At 390 that is a layout shift of 0.085 (`FOOTER 100/-100`), identical before and after. The list request first goes to `/api/comments/<slug>/?…`, gets redirected to the URL without the trailing slash, and that request took 1.8s in dev. Proposal: reserve the list's minimum height, or render the first page of comments on the server.

## What to verify in the production build (items 2 and 3 especially)
1. Route table:
   - `/search` must now be dynamic (ƒ), and the build must not fail with "useSearchParams() should be wrapped in a suspense boundary".
   - `/about` must still be prerendered (○ or ISR). `await getGitHubContributions()` goes through `unstable_cache` and must not make it dynamic; if it does, report it.
   - `/guestbook` and `/account` dynamic as before. Blog posts still static.
2. `curl <prod>/search?q=react&tag=blog`: the HTML contains the `Search posts and projects…` input and the scope buttons with Blog `aria-pressed="true"`, and has no `data-slot="skeleton"` and no `<template id="B:`.
3. `curl <prod>/about`: `aria-label="GitHub contributions graph"` appears twice, with no `animate-spin` and no `<template id="B:`.
4. In the browser on the production server:
   - `/search?q=react` shows the input and tabs at first paint, then results.
   - Typing shows no skeleton flash.
   - Searching from the `/blog` search box navigates acceptably now that `/search` renders per request.
   - The guestbook form shows the prompt (signed out) or the textarea (signed in) at first paint.
5. `/account` signed out returns `307` to `/?signin=%2Faccount`.

## Files changed
- src/app/(home)/guestbook/page.tsx (async page, server session to the form)
- src/app/(home)/guestbook/_components/form.tsx (`initialUser`, pending skeleton removed)
- src/app/(home)/guestbook/_components/skeleton.tsx (`animate-delayed-show`)
- src/app/(home)/search/page.tsx (`connection()`, no fallback)
- src/app/(home)/search/_components/search-client.tsx (`ResultsSkeleton`: delayed show, keyed by query). This file imports fumadocs-ui; the edit is two small lines, so a Base UI migration rebase should be trivial.
- src/app/(home)/_components/contributions.tsx, src/app/(home)/about/page.tsx
- src/app/(auth)/account/page.tsx; deleted the three files listed in item 6
- src/components/features/blog/post-comments.tsx
- src/styles/globals.css (`--animate-delayed-show` and its keyframes)

## Verification
- `bunx tsc --noEmit`: pass.
- `bun run check`: 431 files, no fixes; 1 info in the Simba panel (another agent's file).
- `bun run check:spelling`: clean.
- `node shots.cjs mine-speed` against base:
  - identical: about, blog, colophon, guestbook, notfound, project, uses, work, search (dark).
  - contact and home: a 16 to 20px icon, already present in the audit's run (not from this work).
  - search, light: a 4px scrollbar strip, already present in the audit's run.
  - simba: the panel button click timed out; that panel belongs to other agents.
  - post: 4px taller. The full-page shot captures the comments' server placeholder (the widget never loads in it), which now reserves the visitor toolbar, and the page's dashed side borders spread their dashes over the longer length. The signed-out loaded comments are identical (above).
- Harness `src/app/(home)/zz-speed/` deleted; the guestbook throwaway delay reverted.
