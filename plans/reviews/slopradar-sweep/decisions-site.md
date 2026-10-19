# decisions-site: owner picks applied (site side)

Scratch evidence lives in `scratchpad/decisions-site/` (session scratchpad) and the llms snapshots in `scratchpad/llms-snapshots/decisions-before` and `decisions-after`.

## Picks

### 2. Testimonials and colophon intros in the llms text
- New shared copy: `testimonialsIntro` {title, description} in `src/constants/portfolio/testimonials.ts`, and `typographyIntro` and `attributionIntro` in `src/constants/portfolio/colophon.ts`. The Godly line uses the existing `designInspiration`.
- The pages read them: `(home)/_components/testimonials.tsx`, `colophon/_components/typography.tsx`, `colophon/_components/attribution.tsx`. The rendered text is the same.
- The llms text reads them: `(llms)/utils/testimonials.ts` adds `## What others are saying` and the intro, and the testimonial headings move down one level (`##` to `###`) so they sit under it. `(llms)/utils/colophon.ts` adds the Typography intro, plus the Attribution intro with "Some design ideas also come from [Godly](https://godly.website/)."
- Evidence: the llms diff below. Home and colophon screenshots are identical to the previous run.

### 3. Newsletter success: alert only
- `blog/_components/newsletter-form.tsx`: dropped the `onSuccess` toast. The success Alert and the error path (toast plus Alert) are unchanged.
- Not submitted live, because a real submit adds a contact to the Resend audience. The change only removes code. The blog page screenshots are identical.

### 4. Failed sign-out stays on the page
- `(auth)/account/_components/account-logout-button.tsx`: `const { error } = await signOut()`. On error it shows `toast.error("You're still signed in. Check your connection and try again.")` (the `@/lib/toast` pattern from account-settings) and returns without navigating. A 429 is skipped there because the auth client already toasts it.
- Not run live: there is no session, and I can't sign in.

### 5. GitHub feed uses pullRequestLabel
- `about/_components/feed/event.tsx`: `describePullRequest` now builds "<Verb> <pullRequestLabel>[ by <user>] on <repo>". `pullRequestLabel` moved above it. Using "by user" in place of "user's" avoids "user's a pull request" when the title and number are missing.
- Today's live feed has no titles or users ("Updated pull request #52 on techwithanirudh/gorkie"), so the text is unchanged and the about shots are identical. The llms text has no PR wording, and about.md is byte-identical.

### 6. One initials helper
- Compared all three on 28 names: real guestbook names, the session name and email, emoji, a flag, accents, hyphens, three words, CJK, Greek, blank. The table is in `scratchpad/decisions-site/initials.png` (and `initials.cjs`).
- Chose user-avatar's rule: first and last word, grapheme-safe, or a single word's first two letters. The other two split emoji and flags into broken surrogates, give one letter for single names, and "VSC"/"JCP" for three words.
- `src/lib/initials.ts` now holds the helper (uppercased in JS). `user-avatar.tsx` (its CSS `uppercase` class dropped), `testimonial-author.tsx` and `uses/_components/logo.tsx` all use it.
- Evidence: with testimonial images blocked, the fallbacks read LR, VG, KN, the same as before. The uses fallback is not rendered today, since every software item has a logo.

### 7. Contact intro
- `contactIntro` in `src/constants/portfolio/intro.ts` is read by `contact/_components/hero.tsx` and `(llms)/utils/contact.ts`. The llms text now uses the page wording, so the "contact form" and guestbook sentence is gone.

### 8. /skills.md is now /stack.md
- Moved `src/app/(llms)/skills.md` to `stack.md`, and `markdown-pages.ts` now uses the path `/stack.md` (llms.txt link). `next.config.ts` adds a permanent redirect `/skills.md` to `/stack.md`. No sitemap, robots or nav reference existed.
- Verified: `/skills.md` returns 308 to `/stack.md`, `/stack.md` returns 200, and the stack.md body is byte-identical to the old skills.md.

### 9. RSS
- `next.config.ts`: the `/rss.xml` rewrite is now a permanent redirect to `/blog/rss.xml`. `constants/search.tsx` (RSS command) and `footer/links.tsx` point at `/blog/rss.xml`.
- Verified: `/rss.xml` returns 308 to `/blog/rss.xml`, which returns 200.

### 12. 429 toast through @/lib/toast
- `src/lib/auth-client.ts` imports `toast` from `@/lib/toast` instead of `sonner`. As intended, it now plays the error sound and uses the 8 s error duration.

### 14. Error page
- `src/components/features/error-page.tsx`: removed the all-caps "Error" eyebrow, since the heading already says it.
- Blank band: it is not a layout bug. The band is the footer, which the reveal script keeps at opacity 0 until it scrolls into view. A full-page capture never scrolls, so the footer never reveals. The same band is in the baseline full-page shots of every page (`base-notfound-1440-light.png`, `base-about-*`). Scrolled for real, or with a scroll pass before the full-page capture, the footer sits directly under the error section (`after-scrolled-error-*`). So no class change was made.
- Evidence (throwaway route `src/app/(home)/zz-error-preview/page.tsx` that throws after mount, Next overlay hidden): `cmp-error-{1440,390}-{light,dark}.jpg` (left is before, right is after with a scroll pass). The route was deleted, and `git status` and `.next/types` show no trace.

### 18. use cache note
- `plans/reviews/slopradar-sweep/use-cache-note.md`.

### 19. NEXT_PUBLIC_BASE_URL required in production
- `src/env.ts`: `process.env.NODE_ENV === 'production' ? z.url() : z.url().optional()`, the same pattern as `BETTER_AUTH_SECRET`. The Vercel `VERCEL_PROJECT_PRODUCTION_URL` fallback still feeds it.
- Verified with bun against `src/env.ts`:
  - production unset fails on `NEXT_PUBLIC_BASE_URL`
  - production set passes
  - production with only `VERCEL_PROJECT_PRODUCTION_URL` passes
  - production with `SKIP_ENV_VALIDATION=1` passes
  - development unset passes
- `.env.example` has the var. CI's setup action writes it. The local `.env` does not, so local `next typegen`/`bun run typecheck`/`next build` (production mode) need it in the shell, e.g. `NEXT_PUBLIC_BASE_URL=http://localhost:3000`. I did not edit `.env`: in dev, better-auth's `baseURL` would then pin to :3000 and break auth on :3111 and LAN.

### 20. One sound gate, and pageEnter on back
- `src/lib/audio/preferences.ts`: `canPlaySound()` (unlocked, enabled, and not reduced motion) is the one gate. `playSound` checks it on each call. `useCanPlaySound()` (useSyncExternalStore) feeds `SoundProvider enabled` in `src/app/provider.tsx`, so every `useSound` follows the same rule. Unlock and reduced-motion changes notify the store. `useSoundEnabled` is kept for the footer toggle, which shows the preference.
- Behavior change (approved): hook sounds now also wait for the first gesture.
- Verified with Playwright (`gate.cjs`, `gate-first.cjs`), counting AudioContext sources:

  | Case | no-preference | reduce |
  | --- | --- | --- |
  | Load, no gesture | 0 | 0 |
  | Hover | 0 | 0 |
  | Theme toggle (hook) | 2 | 0 |
  | Nav click | 1 | 0 |
  | Back (pageEnter) | 1 | 0 |
  | Cmd+K (hook) | 3 | 0 |
  | Muted: nav click | 0 | 0 |
  | Muted: Cmd+K | 0 | 0 |
  | Mute / unmute toggle | 2 / 2 | 0 |

  A first-ever keystroke still plays its hook sound: `d` gives 2 and Cmd+K gives 2. Microtasks run between the window capture listener and the document listener, so the provider has re-rendered by then.
- pageEnter on back, root cause: not our sound code. The earlier sound test clicked a native `<a href="#fx">` first. A native fragment navigation creates a history entry with `history.state === null`. Next's `handlePopState` returns early on a null state (`node_modules/next/dist/client/components/app-router.js:62`, its own TODO). So the back traversal is ignored: `usePathname` never changes, and no pageEnter plays.
- With the temporary spy (`back.cjs`, `back-hash*.cjs`), without a hash link, back fires `popstate` then `pathEffect` and plays pageEnter on 2 of 2 runs. With a hash link first, `popstate` fires and nothing follows.
- This is also a real visitor bug: on `/blog/vscode-setup`, click a heading anchor (`#setup-at-a-glance`), go to About, press back. The URL becomes the post, but the page still shows "About me." (`back-real.cjs`).
- Not fixed: it is Next behavior, triggered by native hash links (heading anchors, fumadocs TOC, skip link), and a fix changes scrolling and history handling (see Owner follow-ups). The spy lines were removed (`rg SPYTMP src` is empty).

### 27. ignoreBuildErrors dropped
- `next.config.ts`: removed `typescript.ignoreBuildErrors` and its comment. The LAN `allowedDevOrigins` lines are untouched. The production build result is in Verification.

### 13, 15, 17, 21, 22, 29
- Left as they are (no work).

## Also: components agent's leftover owner decisions

Applied:
- `hooks/use-copy-to-clipboard.ts`: dropped the hook's own success and error sounds. Its only caller (blog ShareMenu) toasts, and the toast wrapper plays the same sounds, so a copy played twice. Verified: "Copy link" now starts 2 oscillators, which is one two-layer success sound (it was two).

Skipped, with reasons:
- Icon near-duplicates (experience/work briefcases, page/post files, desktop Tv02 vs tv Tv01, Octicons star vs Hugeicons featured): none are the same glyph, and each pair sits side by side on purpose (search groups, session device list, theme toggle). Merging them is a visible change.
- `ai-elements/sources.tsx` easings, `ai-elements/tool.tsx` colors: visible motion and color changes. The ai-elements files also feed the assistant.
- `page-actions.tsx` useMarkdownCopy migration (adds haptics, swaps the sound) and rel `noreferrer` (changes Referer): behavior changes.
- `numbered-pagination` ellipsis, `footer` single row, `sound-toggle` outline Button, `clock` hand tokens, `github-code` buttonVariants, `user-button` icon items, `experience-timeline` pixel tokens, `hero.tsx` falsy children, `work-card` sizes: visible changes.
- `search-redirect-input` next/form, `mobile` trap-focus, `footer/links` headings, `wrapper` Lenis, guestbook band move: behavior or a11y-outline changes.
- `smooth-cursor` px and `mdx/heading` (the proposal was to keep ours), `experience-timeline` employmentType (pick 29): no change needed.
- Assistant paw vs brain: pick 16, owned by decisions-simba.

## Verification
- llms snapshots (30 URLs plus stack.md): `diff -r decisions-before decisions-after` shows only:
  - colophon.md: the two intros
  - contact.md: the page wording
  - testimonials.md: the title, the intro and the `###` item headings
  - llms-full.txt: the same three changes
  - llms.txt: the `/stack.md` link
  - skills.md: now a redirect
  - stack.md: was a 404, now byte-identical to the old skills.md
  - about.md: identical
- Screenshots: `node shots-sub.cjs mine-decisions` (home, about, blog, contact, uses and colophon at 1440 and 390, light and dark), 24 of 24 pixel-identical to `mine-deferred-*`. Against `base-*` the only diffs are the known 20px GitHub icon boxes on home and contact.
- `bunx tsc --noEmit`: pass. This needed `next typegen` with `NEXT_PUBLIC_BASE_URL` set to refresh `.next/types`, because the stale validator still pointed at skills.md.
- `bun run check`: clean (433 files). `bun run check:spelling`: clean. `bun run check:links`: 32 URLs, 0 errors.
- `bun run doctor`: 68/100 (it was 83 on 2026-10-18). The new findings are all in files I did not change; they come from today's sweep edits:
  - `effect-needs-cleanup` x2: false positives. `story-track.tsx:180` returns `progress.on(...)`'s unsubscribe directly. `ui-sounds.tsx:78` has the submit `setTimeout`, which was inlined into the effect.
  - `only-export-components` x4: contributions, not-found-content, mobile/item, static-portrait-chip.
  - `anchor-has-content` at `page-actions.tsx:166`: a false positive, since the content comes through the `render` prop.
- Production build (pick 27, run last, after the other agent's files were quiet for 5 min): `NEXT_PUBLIC_BASE_URL=http://localhost:3000 bun run build` exit 0. It compiled, then "Running TypeScript ... Finished TypeScript in 12.3s", and generated 102/102 static pages. The route list has `/stack.md` and `/blog/rss.xml`. Log: `scratchpad/decisions-site/build.log`.
- Then restarted dev as in the brief (killed :3111, cleared `.next/dev` and `.next/cache/turbopack`, ran `bunx fumadocs-mdx`, then `next dev -p 3111 -H 0.0.0.0`). Smoke checks: `/` 200, `/contact` 200, `/stack.md` 200, `/skills.md` 308, `/rss.xml` 308.

## Owner follow-ups
- Back after a hash link shows the wrong page (Next ignores popstate onto null-state entries from native fragment navigation). Proposal: one client listener that captures same-document `a[href^="#"]` clicks and records them with `history.pushState(null, '', hash)`. Next's patched pushState copies `__NA` and the tree into the entry. Scroll and `:target` behavior would need checking with Lenis.
- Local `.env` has no `NEXT_PUBLIC_BASE_URL`, so local production-mode commands (`bun run typecheck`, `bun run build`) now need it in the shell, or `SKIP_ENV_VALIDATION=1`.
- react-doctor fell from 83 to 68 because of other sweep edits (listed above), not these picks.
