# Slopradar report

## Final report (rounds 1 to 4)

Four review rounds (round 2 was a sonnet round; rounds 1, 3 and 4 were Opus and are comparable), four resolve passes and verifier passes over `src`, `emails` and `scripts`. Nothing is committed beyond what is in PR #112; everything after commit 523862a is uncommitted on the `slopradar-cleanup` checkout.

### Score table (0 to 10, 10 worst)

| Scope | Round 1 (Opus) | Round 2 (sonnet) | Round 3 (Opus) | Round 4 (Opus) |
| --- | --- | --- | --- | --- |
| src/app | 5 | 3.5 | 4 | 4 |
| src/components | 5 | 4 | 4 | 4 |
| lib, server, hooks, contexts, constants, types, env, styles | 4 | 4 | 3 | 3 |
| emails, scripts, config | 4 | 2.5 | 3 | 2 |

`TODO(slopradar)` annotations: 340 after round 1, 328 before the first resolve pass, about 168 after resolve 1, about 256 after the round-4 review (it added 35, 31, 17 and 6 new ones), about 188 now. The scores stopped improving because each Opus review finds a fresh layer of small items (duplication, hand-typed paths, unused exports) rather than regressions. Verifiers found no behavior regressions in rounds 3 and 4 (one in round 2, fixed).

### Bugs fixed

Round 1 (the 11): selected-text context reaches the model; PR events read Opened/Reopened/Merged/Closed/Updated (merged is looked up with one cached search); guestbook signature instruction no longer glued onto the visitor's text; revoke-session behind BotID; check-links covers the blog and tag routes; link-preview exclusion matches whole hosts; auth client keeps its plugin types; search "other" tag label; theme toggle no longer rethrows; unreachable branch in comment moderation; GitHub failures are not cached.

Later: sign-in modal handles a failed provider; the canceled contact form shows the right icon; both email templates no longer build `//` links; `Shimmer` no longer nests a `<p>` in a `<p>`; BotID mounts only in production (its client script needs `crypto.subtle`, which a plain-http LAN address lacks, so every POST failed there); comment moderation rejects every image node shape; navigating while Simba is expanded shrinks or closes the panel; GithubRepo error path no longer rethrows; header scroll-to-top respects reduced motion; the first expand morph now animates; the panel resets to its small size after closing; ActionErrors that signal a missing server config are logged again.

Features added during the loop: Simba expand toggle (full screen, 720px column, FLIP morph), the confetti tool, json-render (supersedes draft #111).

### Open owner decisions

The 16 listed under "Owner decisions" below still stand. New ones from rounds 2 to 4:

- `unstable_cache` versus `'use cache'` (now 4 more call sites found).
- Index names without the `portfolio_` prefix and camelCase columns in `schema/comments.ts`; any change needs a migration.
- Shared `emails/theme.ts` (changes how emails look).
- Where the shared work-links schema lives (`source.config.ts` may only export collections).
- `SOURCE_MAPS` and `ANALYZE` read in `next.config.ts` outside `src/env.ts`; `ignoreBuildErrors`; reasons for disabled biome rules.
- Whether prompt text counts as "what a visitor sees or hears" (blocks prompt consolidation and the `searchDocs` full-text output).
- `getPageContent('about')` omits the commit history that `/about.md` and `llms-full.txt` include.
- Resume role with no `employmentType` shows nothing, while the timeline and llms routes say "Research".
- Dropping the redundant `router.refresh()` calls in the guestbook and revoke-session needs a signed-in browser check first.
- The ai-elements registry slice's unused `*Props` exports; `page-actions` `rel`; mobile menu focus trap; press scale; `contributions.tsx` placement.
- Merged PR labels depend on GitHub's search API; no merged PR was in the feed window to see "Merged" on the live page.

Phase 1 (annotate) and phase 2 (compile) of the slopradar pass on `portfolio-improvements` (HEAD `477673f0` plus the uncommitted sign-in modal, hero fade and About copy edits). Four reviewer agents (opus) read every file in their scope and added `TODO(slopradar)` comments; they changed no code. Phase 3 (resolve) has not started. Nothing here is committed or pushed.

Baseline and after, for the whole repo: `bun run typecheck` clean, `bun run check` clean (400 files) before and after the annotations.

## Score table

Slop score 0 to 10, 10 worst.

| Scope | Files read | Slop | Annotations |
| --- | --- | --- | --- |
| `src/app` | 130 | 5 | 131 |
| `src/components` (except `ui/`) | 128 | 5 | 97 |
| `src/lib`, `src/server`, `src/hooks`, `src/contexts`, `src/constants`, `src/types`, `src/env.ts`, `src/styles` | 113 | 4 | 72 |
| `emails/`, `scripts/`, root config | 13 | 4 | 40 |
| **Total** | | **about 4.5** | **340** |

A grep for `TODO(slopradar)` across `src`, `emails` and `scripts` finds 340 comments: `src/app` 131, `src/components` 97, `src/lib` 44, `src/server` 10, `src/hooks` 2, `src/constants` 7, `src/types` 1, `src/styles` 5, `emails` 8, `scripts` 21, matching the reviewers' totals. `package.json` and `biome.jsonc` cannot hold comments, so their findings are in the last scope report only.

## Real bugs (verify, then fix first)

1. **Assistant drops selected text.** `src/app/api/chat/route.ts:115` converts only `data-client`, so the `data-context` part (the visitor's selected text) never reaches the model, which only sees "Use the provided context."
2. **Every GitHub PR event reads "Merged".** `src/app/(home)/about/_components/feed/event.tsx:115` ignores `payload.action` and `pull_request.merged`.
3. **Guestbook moderation prompt is glued to the visitor's text.** `src/app/(home)/guestbook/actions/utils/moderation.ts:17`.
4. **Revoke-session skips BotID.** `src/app/(auth)/account/actions/revoke-session.ts:10` composes `actionClient.use(userMiddleware)` by hand instead of `userActionClient`.
5. **The link checker never validates blog links.** `scripts/lint.ts:21` uses a route key that no longer exists, so every blog slug falls back to a wildcard.
6. **Link-preview exclusion matches substrings.** `scripts/link-previews/utils.ts:44`: excluding `x.com` also excludes `netflix.com` and `dropbox.com`.
7. **`authClient` type annotation erases every plugin type.** `src/lib/auth-client.ts:13`.
8. **Unreachable branch in comment moderation.** `src/server/comments/moderation.ts:90`, `if (!output)` can never run.
9. **Search results mislabel tag `other`** as "Projects" with the work icon (`src/components/features/search/results.tsx:47`).
10. **Theme toggle rethrow** in an async click handler becomes an unhandled rejection (`src/components/layout/header/theme-toggle.tsx:74`).
11. **Swallowed errors that get cached.** The GitHub contributions fetch caches `[]` for 24 hours on failure (`src/lib/github-contributions.ts:25`); the GitHub activity fetch caches its empty failure for 5 minutes (`feed/data.ts:85`).

## Cross-scope patterns

1. **Dead fallbacks on fields the schema already requires** (`?? 'Untitled'` x12 in `src/app`, plus `json-ld.tsx`, `work-grid.tsx`, `src/lib/source/pages.ts`, `author ?? 'Unknown'`, `user.name ?? 'Guest'`). About 20 sites.
2. **Layering inversions.** `src/components` and `src/lib` import from `src/app` (`PostComments`, `PortraitChip`, the `contact` server action, the chat tools, the GitHub feed data, the `Activity` type from a component). Six sites.
3. **The same mechanism or fact written several times.** Three hand-kept registries of the `(llms)` pages, the moderation call duplicated between comments and guestbook, pagination across blog, tags and projects, three initials helpers, outside-press dismissal (x3), Lenis-or-native scroll (x3), `createTable` in three schema files, two import paths for `baseUrl`, the X handle, the reveal selector. About 60 sites.
4. **Swallowed errors and fallbacks that hide bad data.** GitHub feed (four nested catches), OG assets and fonts, the link-preview manifest, `networkidle`, `ignoreBuildErrors`, a production build with no base URL emitting localhost URLs.
5. **Unused exports, dead props, dead config and orphan files.** About 50 sites, for example `PostCard`, `MdxLayout`, the unused `SmoothCursor` props, `useTypeScriptCli`, `images.qualities` 95 and 100, six guestbook inferred types.
6. **Hand-written code where a library or platform API exists.** `Map.groupBy`, `next/form`, `useLocalStorage`, fumadocs-ui `Heading`, embla autoplay for testimonials, `safeValidateUIMessages`, ai-retry's `ModelRetryContext`, `@shikijs/transformers`, svgr.
7. **Missing attribution.** Code adapted from fumadocs-ui (header, TOC), Kibo UI (`contributions.tsx`), Delba de Oliveira (`BlurImage`), and `blog/[slug]/_components/header.tsx` (Braydon Coyer) is not in `THIRD_PARTY_NOTICES.md`; `is-active.ts` copies fumadocs JSDoc with no header; `transformerEscape` copies shiki.
8. **Comment slop.** Section banners (`env.ts` x10, `validators/guestbook.ts` x3, `json-ld.tsx` x8), narration, provenance history.

## Owner decisions (answer before phase 3 resolves these annotations)

1. **Build gate.** `typescript.ignoreBuildErrors: true` in `next.config.ts` means `next build` never type-checks; the skill's "done" step requires `bun run build`. Keep it (CI `typecheck` is the gate) or drop it?
2. **`noUnnecessaryConditions` (parked off in `biome.jsonc`).** It would flag the ~20 dead fallbacks mechanically. Adopt it?
3. **`useErrorCause` (parked off)** versus descriptive errors that keep causes. Which wins?
4. **`unstable_cache` versus `'use cache'`.** Next 16 docs recommend `'use cache'`, which needs `cacheComponents`; enabling it would remove the `dynamic` and `revalidate` segment config on about 12 routes. Adopt it or record why not?
5. **Barrels.** `noBarrelFile` is off and `cn` in `src/lib/utils.ts` is a one-line re-export of the `cn` package, while `bundle-barrel-imports` says avoid barrels. Remove `(llms)/utils/index.ts`, import `cn` directly, and turn the rule on?
6. **Attribution policy.** Should code adapted from MIT dependencies and registries (fumadocs-ui, Kibo, Delba) get `THIRD_PARTY_NOTICES.md` entries and in-file headers? Also decide whether `blog/[slug]/_components/header.tsx` is still adapted code. (Later: the owner deleted `THIRD_PARTY_NOTICES.md`; credit now lives only in the in-file headers. See SLOPRADAR-RESOLUTIONS.md.)
7. **Registry components outside `ui/`.** The Kibo contribution graph lives in `features/` and is linted as owned code. Move it into `ui/` (vendored) or own and trim it?
8. **Mobile menu focus trap.** Hand-written to avoid Safari tinting its bars, with the pill toggle outside the popup. Move to Base UI `modal='trap-focus'` (the toggle leaves the Tab cycle) or keep it and record the reason?
9. **Press scale.** The skill suggests a `static` prop on `Button`; the repo overrides with `active:scale-none` per call site. Keep the override or add a prop?
10. **Parked biome rules without a reason** (`noSvgWithoutTitle`, `useGenericFontNames`, `noBarrelFile`, `noNamespaceImport`, `noNonNullAssertion`, `noLeakedRender`; `maxAllowedComplexity: 31`). Give each a one-line constraint, or re-enable?
11. **Index names and the `portfolio_` prefix.** Index names like `comment_idx` are unprefixed and global within a Postgres schema. Does the prefix rule cover indexes?
12. **`NEXT_PUBLIC_BASE_URL` required in production.** Changes build behaviour (a missing value would fail the build instead of emitting localhost URLs).
13. **lefthook React Doctor hook always exits 0** so it never blocks. Should it block (as `--blocking warning` suggests)?
14. **comment-sicko versus the annotate phase.** The `no-comments` skill says to spawn a comment-deleting agent, while the brief forbids changing code in phase 1. All four reviewers read this as "run comment-sicko in phase 3 only". Confirm.
15. **Changes a visitor would see.** Regenerating link previews after fixing the exclusion matching brings previews back for hosts like `netflix.com` and `dropbox.com`; unifying the email theme (shared palette and fonts) would change how the emails look. Accept before those bands run.
16. **The `(llms)` text.** The colophon llms text is missing the Godly credit and the attribution intro; restoring it changes what the `.md` route says.

## Scope reports

The four reviewer reports follow, unedited. Line numbers in the findings tables are the lines of the `TODO(slopradar)` comments at the time of the pass.


---

## Report: `src/app`


**Scope:** `/Volumes/Data/Developer/DevContainers/portfolio-tip/src/app`. That is 130 lintable files plus the png, svg and woff2 assets, about 9.5k lines. I read every file in full.

**Process notes**
- I loaded desloppify (review mode), no-comments, ultracite, vercel-react-best-practices and ai-sdk from `.agents/skills/*/SKILL.md`, plus the ai-sdk references and the Next docs in `node_modules/next/dist/docs`.
- I read `.claude/CLAUDE.md`, `biome.jsonc`, `THIRD_PARTY_NOTICES.md` and the `slopradar` SKILL.md for the standing exceptions.
- I applied the no-comments rules myself instead of spawning `pstack:comment-sicko`. That agent deletes comments, and this pass may only add them.
- I only inserted comment lines. Five of them were re-indented to satisfy the Biome formatter.
- I ran no git stash, checkout, reset, restore, clean, commit or push.

## 1. Baseline and after

| Check | Before | After |
| --- | --- | --- |
| `bun run typecheck` | exit 0, 0 TS errors | exit 0, 0 TS errors |
| `bunx biome check src/app` | 130 files, 0 diagnostics | 130 files, 0 diagnostics |

`git diff --numstat` shows one deleted line, in `(home)/_components/hero.tsx`. It was already uncommitted before this pass and is not mine.

## 2. Slop score: 5 / 10

1. Route code is mostly idiomatic: typed server actions, Base UI `render` composition, `cn` used everywhere, metadata through `createMetadata`, and no `any`.
2. The slop is structural. There are three hand-kept registries of the `(llms)` pages, copy typed twice for a page and its `.md` route, fourteen dead fallbacks on required frontmatter fields, and pagination and article metadata copied across three routes.
3. There are four real bugs:
   - The assistant drops the visitor's selected-text context.
   - Every GitHub PR event reads "Merged".
   - The moderation prompt glues its instruction onto the user's message.
   - The account action skips BotID.

   Several caught errors are also swallowed and then cached.

## 3. Systemic patterns

1. **Dead fallbacks on schema-required fields** (desloppify "fallback shaping"), 14 sites. Twelve are `?? 'Untitled'` / `|| 'Untitled'` (title is a required `z.string()` in fumadocs-mdx `frontmatterSchema`). The other two are `author ?? 'Unknown'` and `user.name ?? 'Guest'`. Examples: `og/_lib/route.tsx:44`, `(home)/blog/[slug]/page.tsx:39`, `(home)/guestbook/actions/guestbook.ts:30`.
2. **Page copy and `(llms)` text hand-duplicated, or drifting** (CLAUDE.md llms rule), 10 annotations.
   - There are three separate lists of the static pages: `(llms)/llms.txt/route.ts:6`, `(llms)/utils/profile-text.ts` and `api/chat/utils/tools/get-page-content.ts:15`.
   - The colophon llms text is missing the Godly credit and the attribution intro (`(llms)/utils/colophon.ts:8`).
   - Section ids are typed by hand (`(llms)/utils/site-pages.ts:17`).
3. **Duplicated logic across routes**, about 30 annotations:
   - pagination (`(home)/blog/page.tsx:21`), article `generateMetadata` (`(home)/blog/[slug]/page.tsx:99`)
   - `groupStack` and the resume `stack` (`(llms)/utils/profile.ts:38`)
   - `absoluteLinks` and `periodDate` re-implementing `@/lib/url` and `@/lib/employment-period` (`(llms)/utils/experience.ts:5`, `profile.ts:10`)
   - three initials helpers, two date formatters, two `cacheControl` constants
   - the `(auth)` layout copying SiteShell (`(auth)/layout.tsx:7`)
4. **Local types mirroring owned types** (desloppify), 7 sites: `sitemap.ts:6` Page, `og/_lib/route.tsx:6` OgPage, `(home)/_components/testimonials.tsx:16` Testimonial, `api/chat/utils/tools/index.ts:7` (a fake searchDocs tool kept only for `InferUITools`, already drifted), `layout.tsx:74` (untyped JSON-LD while schema-dts exists), and two `Props` duplicates.
5. **Swallowed or layered error handling** (ultracite and desloppify), 8 sites. The GitHub activity fetch has four nested catch layers, and its failure is cached for 5 minutes (`(home)/about/_components/feed/data.ts:85`, `feed/index.tsx:29`, `(llms)/utils/github-commits.ts:27`). Other sites: `revoke-session.ts:23`, `newsletter.ts:67`, `revoke-session-button.tsx:15`.
6. **Unchecked casts** (desloppify "broad casts"), 4 annotations covering about 12 casts: `api/chat/route.ts:70` (`as MyUIMessage[]`; `safeValidateUIMessages` exists), `search-docs.ts:34` and `:91`, and the Octokit payload casts at `feed/data.ts:30` (8 in total).
7. **Redundant config and defaults** (ai-sdk "be minimal", Next docs):
   - `export const revalidate = false` 10 times; it is the Next default (`(llms)/colophon.md/route.ts:4`).
   - `toolChoice: 'auto'` (`api/chat/route.ts:159`).
   - `errorMapProps: {}` 3 times.
   - Metadata wrapped in a function 4 times (`(home)/colophon/page.tsx:72`).
8. **Modules in `src/app` imported by `src/components` and `src/lib`** (desloppify "misplaced logic"): `(home)/_components/portrait.tsx:20`, `(home)/blog/[slug]/page.client.tsx:122`, `api/chat/utils/tools/index.ts` (imported by `src/lib/ai/chat/types.ts`), and `feed/data.ts` (imported by `(llms)`, `(llms)/utils/github-commits.ts:1`).

## 4. Findings table

Paths are relative to `/Volumes/Data/Developer/DevContainers/portfolio-tip/src/app`. Each line number is the line of the `TODO(slopradar)` comment; the offending line is the next one.

**(auth)**

| file:line | rule | what is wrong | fix |
| --- | --- | --- | --- |
| (auth)/account/_components/account-settings.tsx:87 | redundant | AccountSchema already trims name | drop .trim() |
| (auth)/account/_components/account-settings.tsx:138 | magic-string | 32 duplicates AccountSchema's max | export the limit like CONTACT_NAME_MAX_LENGTH |
| (auth)/account/_components/active-sessions.tsx:40 | duplicate-logic | re-lists the PLATFORM_ICONS keys by hand | narrow with Object.hasOwn(PLATFORM_ICONS, platformType) |
| (auth)/account/_components/active-sessions.tsx:85 | js-tosorted-immutable | slice then sort | use sessions.toSorted(...) |
| (auth)/account/_components/revoke-session-button.tsx:15 | inconsistent-error-handling | hand-rolled serverError check | use getActionErrorMessage like every other action consumer |
| (auth)/account/actions/revoke-session.ts:10 | inconsistent | hand-composes actionClient.use(userMiddleware), which skips botIdMiddleware | use userActionClient from @/lib/safe-action |
| (auth)/account/actions/revoke-session.ts:23 | swallowed-error | the catch rewraps its own ActionError and drops the cause | check result.status outside a try, let unexpected errors reach the handler |
| (auth)/account/page.tsx:12 | unnecessary-async | static metadata in an async function | export const metadata (x4) |
| (auth)/layout.tsx:7 | duplicate-logic | copies SiteShell's HomeLayout and Header block | give SiteShell an option for this page and use it |

**(home)**

| file:line | rule | what is wrong | fix |
| --- | --- | --- | --- |
| (home)/_components/contributions.tsx:172 | unused-export | ContributionsFallback only used in this file | drop the export |
| (home)/_components/hero.tsx:67 | magic-string | owner name typed around the chip | split owner from @/constants/site |
| (home)/_components/portrait.tsx:20 | misplaced-module | PortraitChip is imported by src/components/features/blog/author-byline.tsx and the about hero | move to src/components, drop the export on Portrait |
| (home)/_components/portrait.tsx:65 | magic-string | owner name hard-coded in aria-label | use owner from @/constants/site |
| (home)/_components/portrait.tsx:153 | effect-mirrors-state | sulking and bonked are each reset by an effect watching itself | start the timeouts in bonk() (x2) |
| (home)/_components/testimonials.tsx:16 | duplicate-type | mirrors the Testimonial type in @/types | import it |
| (home)/_components/testimonials.tsx:51 | duplicate-logic | initials computed again in uses logo.tsx and hardware.tsx | one getInitials helper in src/lib/utils (x3) |
| (home)/_components/testimonials.tsx:73 | library-exists | hand-rolled autoplay plus hover and focus pause state | embla-carousel-autoplay plugin (stopOnMouseEnter, stopOnFocusIn) |
| (home)/_components/writing.tsx:8 | magic-string | hard-codes '/blog', title and a description differing from pages.blog | read pages.blog like work.tsx reads pages.projects |
| (home)/about/_components/feed/data.ts:30 | unchecked-cast | payload casts here and in event.tsx (x8) bypass the Octokit types | typed payload map or zod per event type |
| (home)/about/_components/feed/data.ts:60 | deprecated-api | unstable_cache is replaced by 'use cache' in Next 16 | adopt it with cacheComponents or record why not (owner decision) |
| (home)/about/_components/feed/data.ts:85 | swallowed-error | outage or bad token returns [] silently and the result is cached 5 min | log it and do not cache the failure |
| (home)/about/_components/feed/data.ts:94 | pass-through | getActivityItems only forwards to getCachedActivityItems | export that directly |
| (home)/about/_components/feed/event.tsx:45 | duplicate-logic | hand-rolled toLocaleDateString without a timeZone | use formatDate from @/lib/format-date |
| (home)/about/_components/feed/event.tsx:115 | bug | every PullRequestEvent reads "Merged", including opened and unmerged ones | read payload.action and pull_request.merged |
| (home)/about/_components/feed/event.tsx:274 | unclear-name | component shares the GitHubEvent type's name and is imported under an alias | rename (for example GitHubEventRow) |
| (home)/about/_components/feed/event.tsx:282 | redundant-check | data.ts already filters with isSupportedEvent, and the switch has a default | drop this guard |
| (home)/about/_components/feed/index.tsx:29 | swallowed-error | getActivityItems never throws, so this catch is dead | drop it |
| (home)/blog/[slug]/_components/header.tsx:1 | attribution | this braydoncoyer port is not in THIRD_PARTY_NOTICES.md | add it there and name the source file |
| (home)/blog/[slug]/_components/header.tsx:3 | bundle | full `motion` bypasses the LazyMotion `m` setup for a plain fade | use m or a CSS animate-in class |
| (home)/blog/[slug]/_components/header.tsx:11 | duplicate-logic | hand-rolled date formatting without UTC, while the sidebar uses formatDate | add a long variant to @/lib/format-date |
| (home)/blog/[slug]/_components/header.tsx:38 | dead-fallback | title is required by frontmatterSchema | drop the title fallbacks (x2) |
| (home)/blog/[slug]/page.client.tsx:91 | env-access | reads process.env directly | use isProduction from @/constants |
| (home)/blog/[slug]/page.client.tsx:122 | misplaced-module | PostComments is imported by src/components/content/mdx/layout.tsx | move it beside that layout |
| (home)/blog/[slug]/page.tsx:32 | redundant-conversion | lastModified and date are already Date | drop the new Date wrappers (x5, same in projects/[slug]) |
| (home)/blog/[slug]/page.tsx:39 | dead-fallback | author is required in the blog schema | drop ?? 'Unknown' and ?? owner |
| (home)/blog/[slug]/page.tsx:59 | dead-fallback | title is required | drop ?? 'Untitled' (x2) |
| (home)/blog/[slug]/page.tsx:99 | duplicate-logic | generateMetadata is near-identical to projects/[slug] | createArticleMetadata(page, image) in @/lib/metadata |
| (home)/blog/[slug]/page.tsx:129 | duplicate-logic | rebuilds page.url by hand | use page.url (x2) |
| (home)/blog/_components/newsletter-form.tsx:34 | duplicate-feedback | success shows a toast and an Alert, each with an unneeded fallback | pick one (x2 with contact-form) |
| (home)/blog/_components/newsletter-form.tsx:39 | redundant-config | empty errorMapProps is the default | drop it (x3) |
| (home)/blog/actions/newsletter.ts:35 | redundant-check | three layers of empty-name defaults | call splitName(session?.user.name) once |
| (home)/blog/actions/newsletter.ts:67 | inconsistent-error-handling | throws a plain Error only for its own catch to rewrap | throw ActionError, let unexpected errors reach the handler |
| (home)/blog/page.tsx:21 | duplicate-logic | parse, bounds, slice and canonical logic copied across blog, tags and projects | paginate(items, perPage, param) in @/lib/pagination |
| (home)/blog/page.tsx:52 | duplicate-type | Props repeats the inline props type of Page | use one type (x2) |
| (home)/blog/page.tsx:59 | dead-code | unused `_parent: ResolvingMetadata` | drop it (x3) |
| (home)/blog/page.tsx:70 | redundant-check | parsePageParam maps a missing param to 1, so `\|\| !searchParams.page` is dead (x3) | drop the second clause |
| (home)/blog/rss.xml/route.ts:10 | library-exists | feed already escapes, so escapeForXML double-escapes the image URL | drop it |
| (home)/blog/rss.xml/route.ts:52 | commented-out-code | commented-out author link | delete it or set the link |
| (home)/blog/tags/[tag]/page.tsx:22 | duplicate-logic | tag path also built in sitemap.ts and (llms)/utils/site-pages.ts | one getTagUrl in @/lib/source |
| (home)/colophon/_components/typography.tsx:16 | duplicate-logic | re-derives the borders colophonCardBorderClasses computes | give the helper a column count |
| (home)/colophon/page.tsx:45 | dead-code | every section has a title, so the ternaries are dead; the loop is copied in uses/page.tsx | one titled-sections component |
| (home)/colophon/page.tsx:72 | inconsistent | static metadata behind a function | export const metadata (x4) |
| (home)/contact/_components/contact-form.tsx:45 | dead-fallback | the action always returns this message; the fallback copy appears 3 times | show data.message |
| (home)/contact/_components/contact-form.tsx:52 | redundant-config | empty errorMapProps | drop it |
| (home)/contact/_components/contact-form.tsx:143 | magic-string | 30 duplicates the ContactSchema min | export CONTACT_MESSAGE_MIN_LENGTH |
| (home)/contact/_components/hero.tsx:34 | redundant-key | key on the render element inside a keyed ViewAnimation | drop it |
| (home)/contact/actions/contact.ts:7 | path-alias | five-level relative import into emails/ | add an @/emails alias |
| (home)/contact/actions/contact.ts:10 | comment-rule | narration comment | delete it |
| (home)/contact/actions/contact.ts:15 | magic-string | time zone and ' IST' suffix typed in | read the zone from profile constants, use timeZoneName |
| (home)/guestbook/_components/entries.tsx:12 | derivable-prop | isSignedIn is always Boolean(currentUserId) | derive it in the card |
| (home)/guestbook/_components/entry-card/index.tsx:60 | inconsistent | validates with one schema, then rechecks emptiness by hand | validate with GuestbookEditSchema once, disable Save while unchanged |
| (home)/guestbook/_components/entry-card/index.tsx:97 | cn-misuse | cn around one static string | pass the string |
| (home)/guestbook/_components/form.tsx:64 | redundant-reset | reset, clear and key remount all reset the same form | keep one |
| (home)/guestbook/_components/form.tsx:100 | redundant-check | isPending is already false here | test !user |
| (home)/guestbook/actions/guestbook.ts:30 | dead-fallback | user.name is a required string | drop ?? 'Guest' (and in form.tsx) |
| (home)/guestbook/actions/guestbook.ts:75 | magic-string | 'guestbook' cache tag repeated 5 times plus in the query | one exported constant |
| (home)/guestbook/actions/utils/moderation.ts:17 | bug | the signature instruction is glued onto the visitor's message | move it to moderationPrompt or its own text part |
| (home)/page.tsx:25 | unnecessary-async | Home awaits nothing | drop async |
| (home)/projects/[slug]/page.tsx:58 | dead-fallback | title is required | drop the title fallbacks (x2) |
| (home)/projects/[slug]/page.tsx:162 | duplicate-logic | rebuilds page.url by hand | use page.url |
| (home)/search/_components/search-client.tsx:134 | effect-mirrors-state | an effect copies q into the fumadocs search state, so the query lives in two places | drive one from the other without an effect |
| (home)/uses/_components/logo.tsx:16 | duplicate-logic | second copy of the initials helper | use the shared getInitials |
| (home)/uses/_components/software.tsx:17 | duplicate-logic | inline copy of the ShadowBox inset shadow | one utility in globals.css |
| (home)/uses/_components/software.tsx:39 | js-tosorted-immutable | copy then sort | items.toSorted(...) |
| (home)/uses/page.tsx:20 | inconsistent | static metadata behind a function | export const metadata (x4) |

**(llms)**

| file:line | rule | what is wrong | fix |
| --- | --- | --- | --- |
| (llms)/colophon.md/route.ts:4 | redundant-config | revalidate = false is the Next default | drop it (x10) |
| (llms)/colophon.md/route.ts:8 | duplicate-logic | same text/markdown Response block in 8 routes | one markdownResponse(text) helper (x8) |
| (llms)/contact.md/route.ts:4 | redundant-config | revalidate = false default | drop it (x10) |
| (llms)/contact.md/route.ts:8 | duplicate-logic | copied Response block | shared helper (x8) |
| (llms)/llms.txt/route.ts:6 | llms-parity | the Site list hard-codes each .md route; profile-text.ts and get-page-content.ts keep their own lists | one registry of { path, title, summary, getText } |
| (llms)/utils/colophon.ts:8 | llms-parity | design copy duplicated by hand; Godly credit and attribution intro missing | move the copy into constants/portfolio/colophon |
| (llms)/utils/contact.ts:5 | llms-parity | intro restates the contact hero by hand | one shared constant |
| (llms)/utils/content-index.ts:14 | inconsistent | missing description falls back to 'Project page' for work and '' for posts | pick one rule |
| (llms)/utils/create-llm-route.ts:24 | inconsistent | .mdx routes omit the charset the other routes set | share one header constant |
| (llms)/utils/experience.ts:5 | duplicate-logic | copies absoluteMarkdownLinks from @/lib/url | import it |
| (llms)/utils/experience.ts:11 | llms-parity | 'Every role so far, newest first.' typed in 3 places | one constant |
| (llms)/utils/experience.ts:22 | magic-string | 'Research' employmentType default repeated | set it once |
| (llms)/utils/github-commits.ts:1 | misplaced-module | reaches into a route's _components for the GitHub fetch | move feed/data.ts to src/lib |
| (llms)/utils/github-commits.ts:8 | redundant-check | ?? [] re-checks the filter | one flatMap |
| (llms)/utils/github-commits.ts:27 | swallowed-error | fourth catch layer for one fetch | drop it |
| (llms)/utils/index.ts:1 | pass-through | barrel that some callers bypass | import the files, delete the barrel |
| (llms)/utils/profile.ts:10 | duplicate-logic | periodDate and monthsBetween reimplement @/lib/employment-period | export and reuse it |
| (llms)/utils/profile.ts:38 | duplicate-logic | groupStack mapping rebuilt in the resume page | move it next to groupTechnologies |
| (llms)/utils/profile.ts:57 | magic-string | second 'Research' default | read the shared default |
| (llms)/utils/site-pages.ts:17 | llms-parity | section ids typed by hand, drift silently | export the ids beside the page sections |
| (llms)/utils/site-pages.ts:48 | duplicate-logic | LEADING_HASH also in navigate.ts | export one |
| (llms)/utils/site-pages.ts:63 | dead-fallback | title is required | drop ?? 'Untitled' (x2) |
| (llms)/utils/skills.ts:4 | llms-parity | 'The tools I reach for most.' also in about stack.tsx | one constant |
| (llms)/utils/uses.ts:15 | llms-parity | desk-photo sentence restates the setup.tsx caption | keep the caption in constants |

**(resume)**

| file:line | rule | what is wrong | fix |
| --- | --- | --- | --- |
| (resume)/resume/layout.tsx:6 | magic-string | light primary hsl(226, 55%, 45%) copied here and in og/_lib/template.tsx | export the light tokens once |
| (resume)/resume/page.tsx:26 | duplicate-logic | second copy of groupStack | share one |
| (resume)/resume/page.tsx:52 | magic-string | filters socials by the display name 'YouTube' | add a flag to the socials data |

**root**

| file:line | rule | what is wrong | fix |
| --- | --- | --- | --- |
| layout.tsx:11 | pass-through | baseUrl comes through the @/constants re-export in some files and from @/lib/metadata in others | import from its owner everywhere |
| layout.tsx:74 | duplicate-type | untyped JSON-LD while schema-dts and components/json-ld.tsx exist | typed WithContext<Graph> component there |
| layout.tsx:82 | magic-string | jobTitle and knowsAbout typed into the layout | read them from constants/portfolio/profile |
| sitemap.ts:6 | duplicate-type | local Page mirrors the Fumadocs page type | use BlogPage \| WorkPage |

**api**

| file:line | rule | what is wrong | fix |
| --- | --- | --- | --- |
| api/chat/route.ts:51 | duplicate-logic | error log shape copied in guestbook.ts and moderation.ts | one helper in src/lib |
| api/chat/route.ts:70 | unchecked-cast | loose zod shape cast to MyUIMessage[] | safeValidateUIMessages from ai |
| api/chat/route.ts:115 | bug | only data-client is converted, so the data-context selected text is dropped and the model sees only 'Use the provided context.' | convert data-context; declare client in ChatDataTypes |
| api/chat/route.ts:159 | redundant-config | toolChoice 'auto' is the default | drop it |
| api/chat/route.ts:161 | duplicate-logic | tool map rebuilt in tools/index.ts for typing | createChatTools(writer), infer the types from it |
| api/chat/utils/llms.ts:8 | unclear-name | getLLMsTxt builds a different document than llms.txt | rename, or build both from one composer |
| api/chat/utils/tools/get-page-content.ts:15 | llms-parity | third static page list; about omits the commit history | one shared registry |
| api/chat/utils/tools/get-page-content.ts:34 | inconsistent | raw processed markdown, while the .mdx routes use getBlogLLMText/getWorkLLMText | call those (x2) |
| api/chat/utils/tools/get-page-content.ts:38 | duplicate-logic | /work alias handled in 3 places | normalize once |
| api/chat/utils/tools/index.ts:7 | duplicate-type | stub searchDocs with a hand-copied, drifted schema | infer from createSearchDocsTool |
| api/chat/utils/tools/navigate.ts:56 | unused-export | resolveNavigation and NavigateOutput only used locally | drop the exports |
| api/chat/utils/tools/search-docs.ts:7 | library-exists | second FlexSearch index duplicating api/search | query the fumadocs search server |
| api/chat/utils/tools/search-docs.ts:23 | redundant-check | getText guaranteed by includeProcessedMarkdown | drop the guards (x2) |
| api/chat/utils/tools/search-docs.ts:34 | unchecked-cast | as CustomDocument plus a dead 'Untitled' | satisfies (x2) |
| api/chat/utils/tools/search-docs.ts:70 | duplicate-logic | union of literals | z.enum, reused in tools/index.ts |
| api/chat/utils/tools/search-docs.ts:91 | unchecked-cast | result and tag casts | type with the Document generics |
| api/chat/utils/tools/search-docs.ts:115 | dead-code | locale input never read | drop it |
| api/chat/utils/tools/show-contact-form.ts:23 | unused-export | ContactFormOutput has no importers | delete it |
| api/comments/[...comment]/route.ts:6 | commented-out-code | dead role option plus an untracked todo | delete it, or wire it and track it |
| api/link-preview/route.ts:3 | duplicate-logic | Cache-Control string copied in page-preview | share one constant |
| api/page-preview/route.ts:24 | dead-fallback | title is required | drop ?? 'Untitled' |
| api/search/route.ts:6 | duplicate-logic | blog and work blocks differ only by tag; getPageEntries builds the same rows | map one helper |

**og**

| file:line | rule | what is wrong | fix |
| --- | --- | --- | --- |
| og/_lib/route.tsx:6 | duplicate-type | OgPage restates Fumadocs page data | BlogPage \| WorkPage |
| og/_lib/route.tsx:44 | dead-fallback | 'Untitled' never renders (x12 in src/app) | pass page.data.title |
| og/_lib/template.tsx:151 | magic-string | '#ffffff' sits outside the colors map | add it to colors |

## 5. Structural verdict

**Proposed tree changes**
- Move `(home)/_components/portrait.tsx` to `src/components/portrait.tsx`.
- Move `(home)/about/_components/feed/data.ts` to `src/lib/github-activity.ts`.
- Move `PostComments` out of `blog/[slug]/page.client.tsx` to `src/components/content/mdx/`.
- Replace `api/chat/utils/tools/index.ts` with a `createChatTools(writer)` that the route and `src/lib/ai/chat/types.ts` both use.
- Add `(llms)/utils/registry.ts` as the single list of the `.md` pages, consumed by `llms.txt`, `profile-text.ts` and `get-page-content.ts`.
- Delete `(llms)/utils/index.ts`.

**Cleanup bands, in order**
1. **Bugs:**
   - Convert `data-context` in `api/chat/route.ts`.
   - Fix the PR "Merged" label in `feed/event.tsx`.
   - Split the moderation instruction out of the user text.
   - Switch `revoke-session.ts` to `userActionClient` so BotID applies.
2. **Dead fallbacks and redundant config:**
   - Remove all 12 `'Untitled'` fallbacks, plus `author` and `user.name`.
   - Remove the `new Date` wrappers.
   - Remove `revalidate = false` (x10), `toolChoice`, and `errorMapProps: {}`.
   - Switch to `export const metadata` (x4).
   - Drop the unused `_parent` and `locale` parameters.
3. **Owned types instead of local mirrors:**
   - BlogPage and WorkPage in `sitemap.ts` and `og/_lib/route.tsx`.
   - The `@/types` Testimonial.
   - `safeValidateUIMessages` for chat input.
   - Typed tool inference.
   - schema-dts for the layout JSON-LD.
4. **The `(llms)` single source of truth:** one page registry, plus shared constants for every sentence that appears on both a page and its `.md` route (colophon, contact, uses, stack, experience, section ids). Restore the missing Godly credit.
5. **Shared helpers:**
   - `paginate()` in `@/lib/pagination`
   - `createArticleMetadata()` in `@/lib/metadata`
   - `markdownResponse()`
   - `getInitials()`
   - `formatDate` long variant
   - reuse `absoluteMarkdownLinks` and the employment-period parsing
   - one `groupStack`
   - one `cacheControl`
   - one `'guestbook'` tag constant
   - one error-log helper
6. **Error handling:** collapse the four catch layers on the GitHub activity fetch to one that logs and does not cache failures. Remove the self-rewrapping try blocks in `newsletter.ts` and `revoke-session.ts`. Route every action consumer through `getActionErrorMessage`.
7. **Libraries over hand-rolled code:** embla-carousel-autoplay for testimonials. The fumadocs search server for the assistant's `searchDocs`, which lets the FlexSearch Document index go and may make `flexsearch` removable. Drop `escapeForXML` (feed already escapes).
8. **Module boundaries:** apply the four moves above, make `(auth)/layout.tsx` reuse SiteShell, and add an `@/emails` alias.
9. **React hygiene:** move the portrait timeouts and the search-param sync out of effects, derive `isSignedIn` instead of passing it, use `toSorted`, and use `m` instead of full `motion` in the blog header.

## 6. Orphans

Each was checked by grepping the whole repo (`src`).
- **Unused exports:**
  - `ContactFormOutput` (`api/chat/utils/tools/show-contact-form.ts`) has zero importers.
  - These are exported but only used inside their own file: `contactFormOutputSchema`, `resolveNavigation`, `NavigateOutput`, `ContributionsFallback`, `Portrait`, `ActivityEventItem`, `SiteSection`, `ModerateGuestbookEntryInput`.
  - `tools` (`api/chat/utils/tools/index.ts`) is used only as a type, and its `searchDocs` execute is a stub.
- **Dead code:**
  - the `locale` input in `search-docs.ts`
  - the `isSupportedEvent` guard and the switch `default` in `event.tsx`
  - the catches in `feed/index.tsx` and `github-commits.ts`
  - the commented-out `role` in `api/comments` and the author `link` in `rss.xml`
- **Unused files and dependencies:** none confirmed in scope. `flexsearch` becomes removable after band 7 if nothing outside `src/app` uses it.

## 7. What is good and should be kept

- The OG pipeline (`og/_lib/template.tsx`, `createOgRoute`) is small, typed and parallelised. Its comments name the real constraint (no CSS variables in the renderer).
- The `navigate` tool has a discriminated-union `outputSchema`, and `prepareStep` limits a reply to one navigation. That is clean use of the AI SDK.
- Server actions all go through next-safe-action clients with zod `inputSchema`. The guestbook uses `useOptimisticAction`, and the reactions toggle is atomic (delete returning, then insert on conflict do nothing).
- `GuestbookEntriesSection` uses `unstable_rethrow`, its Suspense boundaries are scoped, and the account sections stream.
- Base UI is composed with `render` throughout, `cn` is used consistently, and icons all come through `@/components/icons/icons`.
- The adapted-code headers on `story.tsx`, `story-track.tsx` and `shadow-box.tsx` match `THIRD_PARTY_NOTICES.md`.
- The constraint comments (hero AVIF, the CLS note on the contact form, the Safari `viewportFit` note, the reduced-motion `MotionConfig`) are the kind the no-comments rules allow.

## 8. Contradictions between rule sources (questions for the owner)

1. `biome.jsonc` sets `performance.noBarrelFile` off. vercel-react-best-practices `bundle-barrel-imports` says to avoid barrels. Should `(llms)/utils/index.ts` and similar barrels go, and should the rule be turned on?
2. `biome.jsonc` parks `suspicious.noUnnecessaryConditions` ("new in 2.5"). It would flag the 14 dead fallbacks that desloppify calls slop. Should it be adopted?
3. `biome.jsonc` parks `style.useErrorCause`, while the swallowed-error findings ask that causes be kept. Should causes be required?
4. The Next 16 docs say `unstable_cache` is replaced by `'use cache'` with `cacheComponents`. Enabling `cacheComponents` would remove the `dynamic` and `revalidate` segment config used by about 12 routes here. Do we adopt `cacheComponents`, or keep the previous model and record why?
5. The no-comments skill says to spawn comment-sicko, which deletes comments. The slopradar brief forbids any change beyond added comments. Should comment-sicko only run in phase 3?
6. `THIRD_PARTY_NOTICES.md` says "each adapted file carries a header", but `blog/[slug]/_components/header.tsx` has a braydoncoyer header and no NOTICES entry. Should it be added to NOTICES, or is it no longer adapted code?

Total TODO(slopradar) comments inserted: 131.

---

## Report: `src/components (except ui/)`


I read all 128 files in scope in full. I also read `ui/` for local edits, `.claude/CLAUDE.md`, `biome.jsonc`, `THIRD_PARTY_NOTICES.md`, `icons/icons.tsx`, `src/styles/globals.css` and the skills: desloppify (review mode), no-comments, ultracite, vercel-composition-patterns, make-interfaces-feel-better and react-doctor. React Doctor has no SKILL.md, so I ran its CLI with `npx react-doctor . --no-supply-chain --json`. I applied the no-comments rules myself instead of spawning comment-sicko, because that agent edits code and this pass may only add comments. The only edits are `TODO(slopradar)` comment lines. Nothing was stashed, checked out, reset, committed or pushed.

## 1. Baseline and after

| Check | Before | After |
| --- | --- | --- |
| `bun run typecheck` | exit 0, 0 errors | exit 0, 0 errors |
| `bunx biome check src/components` | 128 files, 0 errors, 0 warnings, 0 infos | same, 0 diagnostics |
| `react-doctor` (repo) | score 82, 5 warnings in 2 files | not re-run, comments only |

All 5 React Doctor warnings are standing exceptions: `prompt-input.tsx:38` no-prevent-default, and four in `ui/carousel.tsx`. Biome does not check `src/components/ui`, so typecheck is the only check covering the one annotation there.

## 2. Slop score: 5 / 10

The code is mechanically clean: no lint diagnostics, no `any`, no `transition: all`, no `asChild` or `data-state`, only a few casts, and good a11y and motion care. The slop is structural:
- props, slot APIs and config branches built for flexibility nobody uses;
- the same small mechanisms hand-written two to four times (outside-press dismiss, lenis-or-native scroll, active-link rules, chat busy checks, icon-button classes);
- components that import from `src/app`.

There is also an attribution gap for code adapted from fumadocs-ui, the Kibo UI registry and Delba de Oliveira.

## 3. Systemic patterns

1. **Dead flexibility: props, slots and config no caller uses** (desloppify: unnecessary layers). About 18 annotations.
   - `smooth-cursor.tsx:13`: four props, and the only caller passes none.
   - `features/auth/user-button.tsx:23`: a nested `classNames` API nobody passes.
   - `layout/header/index.tsx:162`: theme and search slots fixed by `site-shell.tsx`.
   - Also `json-ld.tsx:121`, `copy-button.tsx:10`, `layout/wrapper.tsx:9`, `layout/lenis.tsx:13`, `features/blog/tag-card.tsx:8`.
2. **One mechanism hand-written in several places** (duplication). About 22 annotations.
   - Outside-press and Escape dismissal: `layout/header/index.tsx:265`, `features/toc/popover.tsx:37`, `layout/header/mobile/index.tsx`.
   - Lenis-or-native scroll: `features/search/dialog.tsx:162`, `features/assistant/tools/navigate.tsx:43`.
   - Active-link rule: `layout/header/link-item.tsx:27`.
   - Icon-button classes: `layout/header/mobile/pill.tsx:41`.
   - Chat busy check: `features/assistant/input.tsx:30`.
3. **Pass-through wrappers and second names for the same thing** (one-line helpers). 8 annotations.
   - `theme-provider.tsx:6`, `layout/sections/body.tsx:10`, `json-ld.tsx:167` (five JSON-LD wrappers that only pin `type`).
   - Second names: `icons/utils.ts:7` (`Icon`), `features/assistant/mascot/constants.ts:39` (`POSES` / `SIMBA_ANIMATIONS`), `content/mdx/components.tsx:33` (`GithubRepo` / `GitHubRepo`).
4. **A library or platform API already does the job** (hand-written logic). 9 annotations.
   - `content/mdx/heading.tsx:9`: fumadocs-ui `Heading`.
   - `features/assistant/input.tsx:59`: usehooks-ts `useLocalStorage`.
   - `layout/header/mobile/index.tsx:102`: Base UI `modal='trap-focus'`.
   - `features/search/utils/groups.ts:56` and `features/blog/post-ledger.tsx:5`: `Map.groupBy`.
   - `search-redirect-input.tsx:52`: `next/form`.
5. **Layering: components import from `src/app`** (misplaced logic). 3 annotations.
   - `content/mdx/layout.tsx:2` imports `PostComments` from a route's `page.client`.
   - `features/blog/author-byline.tsx:1` imports `PortraitChip`.
   - `features/assistant/tools/contact-form.tsx:6` imports the `contact` server action.
6. **Fallbacks for data the schema already guarantees** (fallback shaping). 3 annotations.
   - `json-ld.tsx:59`: `author` branch and `title ?? 'Untitled'`. `frontmatterSchema` requires `title` and the blog schema requires `author`.
   - `features/work/work-grid.tsx:45`: `title ?? 'Untitled'`.
   - `features/work/experience-timeline.tsx:167`: a missing `employmentType` shows as "Research".
7. **Hand-copied button variants and raw palette colours instead of tokens** (shadcn extend, design tokens). 6 annotations.
   - Copied classes: `content/mdx/github-code.tsx:28`, `layout/footer/sound-toggle.tsx:24`.
   - Raw colours: `ai-elements/tool.tsx:37` (amber and green although `--color-success` exists), `layout/footer/clock.tsx:22` (neutral-400 to 600).
8. **Missing attribution for adapted code** (THIRD_PARTY_NOTICES). 4 annotations.
   - `layout/header/index.tsx:37`: fumadocs-ui `layouts/home/slots/header.js`. Verified in node_modules.
   - `features/toc/popover.tsx:15`: fumadocs-ui `layouts/docs/page/slots/toc.js`. Verified in node_modules.
   - `features/contributions.tsx:3`: Kibo UI registry component.
   - `blur-image.tsx:4`: the Delba header is misplaced and missing from the notices file.

## 4. Findings

### Root (`src/components/*.tsx`)

| file:line | rule | what is wrong | fix |
| --- | --- | --- | --- |
| blur-image.tsx:4 | attribution | Delba header sits between imports; not in THIRD_PARTY_NOTICES.md | Move it under `'use client'`; add a notice |
| blur-image.tsx:16 | boolean-prop | `lazy` duplicates next/image `loading` | Take `loading`; derive `fetchPriority` from it |
| copy-button.tsx:10 | dead-props | `doneIcon`/`errorIcon`/`idleIcon` never passed; file name differs from export | Drop them; rename the file to copy-state-icon |
| copy-button.tsx:28 | no-comments | Says "the compiler", but no React Compiler is configured | Delete |
| guestbook-cue.tsx:19 | misplaced-logic | Client component uses `usePathname` only to render on `/` | Render it from the home page (server) |
| inline-markdown.tsx:4 | library-exists | Regex link parser while react-markdown with the same `a` mapping is already used | Reuse that renderer |
| json-ld.tsx:48 | no-comments | `// --- X ---` banners (x8) | Delete |
| json-ld.tsx:51 | duplication | `PostJsonLd` and `WorkJsonLd` are near-identical | One `ArticleJsonLd` |
| json-ld.tsx:59 | dead-fallback | `author` branch and `title ?? 'Untitled'` never run | Drop them |
| json-ld.tsx:70 | duplication | WebSite ref spelled out 4 times | Hoist a `websiteRef` |
| json-ld.tsx:121 | dead-prop | `breadcrumbs` never passed | Drop it |
| json-ld.tsx:167 | pass-through-wrapper | Five wrappers that only pin `type` | One `PageJsonLd` with a `type` prop |
| numbered-pagination.tsx:61 | dead-prop | `paginationItemsToDisplay` never passed | Inline 5 |
| page-actions.tsx:21 | duplication | `useMarkdownCopy` re-implements `useCopyToClipboard` | Let the hook accept `Promise<string>` |
| page-actions.tsx:70 | unused-export | `LLMCopyButton` and `ViewOptions` are used only in this file | Drop the exports |
| page-actions.tsx:110 | dead-alias | `fullMarkdownUrl` is just `markdownUrl` | Inline it |
| page-actions.tsx:170 | redundant-aria | `aria-label` repeats visible text; `rel` differs from other external links | Drop it; share external-link props |
| preview-link.tsx:28 | unchecked-cast | `Promise<unknown>` cache cast to the caller's T | Typed cache per endpoint, or zod |
| search-redirect-input.tsx:52 | hand-written-form | Enter key + `router.push` rebuilds a GET form | `next/form` with a hidden `tag` input |
| smooth-cursor.tsx:13 | dead-props | All props unused by the only caller | Delete props and dead branches |
| smooth-cursor.tsx:158 | cn-rule | Template-literal classNames (x2) | `cn()` |
| tailwind-indicator.tsx:2 | env-rule | Reads `process.env.NODE_ENV` directly | Use `isProduction` |
| theme-provider.tsx:6 | pass-through-wrapper | Re-exports next-themes unchanged | Import next-themes directly |
| ui-sounds.tsx:31 | duplication | Tick-later comment and `setTimeout(16)` written twice | One helper and a named constant |

### `ai-elements/`

| file:line | rule | what is wrong | fix |
| --- | --- | --- | --- |
| markdown.tsx:91 | unchecked-cast | `as ReactElement` and `props as` assume the shape | Narrow with `isValidElement` |
| markdown.tsx:113 | unbounded-cache | Every streamed prefix is cached for the session | Cap it, or key by message part |
| tool.tsx:37 | token-rule | Raw amber/green colours | `text-success` and a warning token |

### `content/mdx/`

| file:line | rule | what is wrong | fix |
| --- | --- | --- | --- |
| components.tsx:33 | duplicate-alias | `GithubRepo` and `GitHubRepo` both registered | Keep one; drop the alias export |
| github-code.tsx:28 | copied-variant | Copy of the button classes, including `disabled:` on an `<a>` | `buttonVariants` |
| github-code.tsx:83 | env-rule | Reads `process.env` directly | `isProduction` |
| github-repo.tsx:107 | duplication | Link classes repeated (x2); redundant `aria-label` | Share a constant; drop the label |
| heading.tsx:9 | library-exists | Re-implements fumadocs-ui `Heading` | Use `fumadocs-ui/components/heading` |
| layout.tsx:2 | layering | Imports from `app/.../page.client` | Move `PostComments`, or take it as a slot |
| layout.tsx:20 | boolean-prop | `comments` flag plus `slug`; two className props never passed | `comments?: ReactNode` |
| layout.tsx:57 | orphan | `MdxLayout` imported nowhere | Delete it |

### `features/`

| file:line | rule | what is wrong | fix |
| --- | --- | --- | --- |
| assistant/input.tsx:30 | duplication | Busy check written four ways | `isChatBusy(status)` |
| assistant/input.tsx:59 | library-exists | Hand-written localStorage read/write | usehooks-ts `useLocalStorage` |
| assistant/input.tsx:207 | hit-area | Remove-context button is a 14px icon | Extend the hit area toward 40px |
| assistant/mascot/constants.ts:39 | double-name | `POSES` and `SIMBA_ANIMATIONS` are aliases (x2) | Export each object once |
| assistant/mascot/hooks.ts:10 | duplicate-type | Local `ChatStatus` | Import `ChatStatus` from `ai` |
| assistant/mascot/sprite.tsx:8 | duplication | `REST` frame also defined in controller.ts | Export it once |
| assistant/message-list.tsx:29 | weak-type | `Record<string,string>` plus `'unknown'` fallback | Record over the role union |
| assistant/text-selection-popup.tsx:76 | library-exists | Hand-written dismissal over floating-ui | Base UI Popover with a virtual anchor |
| assistant/tools/contact-form.tsx:6 | layering | Imports a server action from `app/` | Move it to `src/server` |
| assistant/tools/contact-form.tsx:68 | dead-config | Empty `errorMapProps` | Delete |
| assistant/tools/navigate.tsx:43 | mirrored-state | Refs synced by effects for a 10s poll; duplicates the search hash scroll | Shared `scrollToHash` helper |
| auth/user-avatar.tsx:8 | dead-api | `classNames` API unused | Drop it |
| auth/user-button.tsx:23 | dead-api | Nested `classNames` never passed | Drop it; keep `className` |
| blog/author-byline.tsx:1 | layering | Imports `PortraitChip` from `app/` | Move it to `src/components` |
| blog/post-card.tsx:13 | orphan | `PostCard` rendered nowhere; uses `text-medium`, which is not a utility | Delete it and its barrel line |
| blog/post-ledger.tsx:5 | platform-api | Manual Map grouping | `Map.groupBy` |
| blog/tag-card.tsx:8 | dead-prop | `displayCount` never passed, but its lookup runs anyway | Drop prop and lookup |
| contributions.tsx:3 | vendored-location | Kibo registry component outside `ui/`, no source header | Move to `ui/`, or own it and trim it |
| contributions.tsx:354 | duplication | Level-to-fill class list repeated (x2) | Hoist a constant |
| not-found/not-found-content.tsx:9 | no-comments | Provenance history (PR #108) | Delete |
| not-found/simba-loop.tsx:31 | duplication | Re-implements the controller's frame stepper | Reuse `SimbaController` |
| search/dialog.tsx:162 | duplication | Lenis-or-native scroll repeated; cast | Shared `scrollToTarget` |
| search/dialog.tsx:199 | redundant-call | Second `onOpenChange(false)` after `close()` | Drop it |
| search/results.tsx:15 | weak-type | Hand-typed hast nodes | hast `Root`/`Element` |
| search/results.tsx:47 | bug | Tag `'other'` is labelled "Projects" with the work icon | Record over the tag union |
| search/results.tsx:62 | duplication | `mark`/`p` component map built inline twice | Hoist a const |
| search/utils/groups.ts:56 | platform-api | Two copies of the same Map bucketing | `Map.groupBy` (Safari 17.4+) |
| toc/popover.tsx:15 | attribution | Adapted from fumadocs-ui toc slot | Source header and a notice |
| toc/popover.tsx:37 | duplication | Hand-written outside-click dismissal | Shared dismiss hook |
| work/experience-timeline.tsx:167 | fallback-shaping | `?? 'Research'` hides missing data | Make the field required, or omit the label |
| work/work-grid.tsx:45 | dead-fallback | `title ?? 'Untitled'` never runs | Pass `work.data.title` |

### `icons/`

| file:line | rule | what is wrong | fix |
| --- | --- | --- | --- |
| icons.tsx:147 | no-comments | Stale refactor history in a comment | Keep the present rule only, or delete |
| utils.ts:7 | orphan-export | `Icon` alias imported nowhere | Delete it and its re-export |
| brands/claude.tsx:4 | duplication | Eight copies of the same svg wrapper | `brandIcon()` factory |
| brands/github.tsx:6 | inconsistent-a11y | Hard-coded `aria-hidden`, no `isLabelled` check | Shared check in the factory |
| brands/github.tsx:8 | dead-code | Font Awesome `data-*` leftovers | Delete |

### `layout/`

| file:line | rule | what is wrong | fix |
| --- | --- | --- | --- |
| lenis.tsx:13 | dead-config | `root` always true, `options` always `{}`; extended props never forwarded | Inline them |
| wrapper.tsx:9 | dead-config | `lenis` prop never passed | Render `<Lenis />` directly |
| sections/body.tsx:10 | pass-through-wrapper | `SectionBody` is just `<Section fill>` | Use `Section fill` |
| sections/header.tsx:10 | redundant-type | `string \| ReactNode \| null` | `ReactNode` |
| sections/header.tsx:15 | dead-props | `titleClassName` and `descriptionClassName` unused | Drop them |
| sections/header.tsx:62 | redundant-key | Manual key derivation under `Children.map` | Drop it |
| sections/split.tsx:98 | over-abstraction | A cva with one boolean variant | `cn(inset && ...)` |
| footer/active-link.tsx:9 | duplicate-type | Restates Link props; most never passed | `ComponentProps<typeof Link>` |
| footer/clock.tsx:22 | token-rule | Raw neutral colours (x3) | Theme tokens |
| footer/clock.tsx:33 | magic-string | Time zone duplicated from `constants/portfolio/profile.ts` | Import it |
| footer/index.tsx:41 | duplication | Four controls rendered twice, so two clocks mount | One responsive set |
| footer/links.tsx:18 | dead-fields | `ListItem.external` and `ListItem.href` never set | Drop them and the dead branch |
| footer/links.tsx:83 | data-in-component | "More" links hard-coded | Move them to `constants/navigation` |
| footer/sound-toggle.tsx:24 | copied-variant | Hand-rolled outline icon button | `<Button variant='outline' size='icon'>` |
| header/index.tsx:37 | attribution | Adapted fumadocs-ui navbar, not credited | Source header and a notice |
| header/index.tsx:68 | dead-code | Function title branch and two casts | Render the string title |
| header/index.tsx:162 | dead-code | Theme and search slots never vary (x2) | Take `links` only |
| header/index.tsx:265 | duplication | Hand-written dismiss logic (x3 across files) | `useDismiss` hook |
| header/index.tsx:501 | duplication | Mobile class map restates `navItemVariants` | Add a mobile variant |
| header/link-item.tsx:8 | duplicate-type | `WithHref` mirrors the fumadocs `LinkItemType` | `Extract<LinkItemType, …>` |
| header/link-item.tsx:27 | duplication | Active rule repeated in mobile/menu.tsx | Helper in `lib/is-active` |
| header/mobile/index.tsx:102 | library-exists | Hand-written focus trap | `modal='trap-focus'` (your call) |
| header/mobile/pill.tsx:18 | duplication | Restates `linkItems` | Derive from constants |
| header/mobile/pill.tsx:41 | duplication | Same icon-button classes (x3) | Shared cva |
| header/theme-toggle.tsx:74 | inconsistent-error-handling | Rethrow in an async click handler becomes an unhandled rejection | Ignore AbortError; fall back to `update()` |

### `ui/` (local edits only)

| file:line | rule | what is wrong | fix |
| --- | --- | --- | --- |
| dropdown-menu.tsx:110 | shadcn-extend | `DropdownMenuIconItem` added inside the vendored file, used only by page-actions | Move it next to its caller |

## 5. Structural verdict: cleanup bands, in order

1. **Delete orphans and dead flexibility.**
   - Delete `PostCard`, `MdxLayout`, the `Icon` alias, the `GitHubRepo` alias and `theme-provider.tsx`.
   - Delete the unused SmoothCursor props, `classNames` APIs, `breadcrumbs`, `displayCount`, `paginationItemsToDisplay`, `titleClassName`/`descriptionClassName`, and the unused Wrapper/Lenis config and `ActiveLink` props.
   - This is pure deletion.
2. **Remove dead fallbacks and casts.** `title ?? 'Untitled'` (also in `src/lib/source/pages.ts`, which the lib reviewer annotated), the `author` branch, the header title casts, the markdown casts, the `roleName` type and `ChatStatus`.
3. **Shared mechanisms.** Add `useDismiss` (header, toc popover, mobile menu), `scrollToTarget`/`scrollToHash` (header, search dialog, navigate tool), `isLinkItemActive` in `lib/is-active`, `isChatBusy`, and one `REST` frame.
4. **Library and platform adoption.** fumadocs-ui `Heading`, `useLocalStorage`, `Map.groupBy`, `next/form` for search-redirect, and `ChatStatus` from `ai`. Base UI `trap-focus` and Popover are decisions for you (see section 8).
5. **Fix the layering.** Move `PostComments`, `PortraitChip` and the `contact` action out of `src/app` into `src/components/features` and `src/server`.
6. **Icon cleanup.** One `brandIcon` factory replaces the 8 brand files, applies the same `isLabelled` check and drops the Font Awesome leftovers.
7. **Variants and tokens.**
   - Use `buttonVariants` in github-code and `Button` in sound-toggle.
   - Use status tokens in `tool.tsx` and `clock.tsx`.
   - Merge the mobile class map into `navItemVariants`, add a shared pill icon-button cva, and move `DropdownMenuIconItem` out of `ui/`.
8. **Merges.**
   - `PostJsonLd` + `WorkJsonLd` become `ArticleJsonLd`.
   - The five JSON-LD wrappers become one `PageJsonLd`.
   - Replace `SectionBody` with `<Section fill>`.
   - Render the footer controls once.
   - `simba-loop` reuses `SimbaController`.
9. **Attribution and vendored code.** Add notices for fumadocs-ui (header, TOC) and Delba (BlurImage). Either move `contributions.tsx` into `ui/` as the Kibo registry file or own and trim it.
10. **Last.** Run no-comments over the result: json-ld banners, stale history comments, the copy-button compiler comment.

Proposed placement changes: `features/contributions.tsx` to `ui/contribution-graph.tsx`; `copy-button.tsx` to `copy-state-icon.tsx`; `guestbook-cue.tsx` either merges into the home page or is renamed to match `GuestbookBand`.

## 6. Orphans (verified by grep across `src`, `emails`, `scripts`)

- **Files and components:**
  - `features/blog/post-card.tsx`: only reached through the `blog/index.ts` barrel.
  - `MdxLayout`, the default export of `content/mdx/layout.tsx`.
  - `export { GithubRepo as GitHubRepo }`: no `<GitHubRepo` in `content/`.
- **Types:** `Icon` (`icons/utils.ts`, re-exported from `icons.tsx`); `SmoothCursorProps`, `UserButtonClassNames`, `UserButtonProps` and `UserAvatarProps`, none referenced elsewhere.
- **Exports used only internally:** `LLMCopyButton`, `ViewOptions` (page-actions.tsx).
- **Upstream-style props types:** The ai-elements files (AI Elements convention) and the Kibo `contributions.tsx` export `*Props` types nobody imports. These are kept, not flagged.
- **Dependencies:** `@floating-ui/react-dom` has exactly one user, `text-selection-popup.tsx`. It becomes removable if that moves to Base UI Popover. Dependency-level orphans are for the root-config reviewer.

## 7. What is good and should be kept

- **Mascot system** (`controller.ts`, `use-look.ts`, `presence.ts`, `rig.tsx`): a store driven by `useSyncExternalStore`, one shared pointer listener, CSS-variable look tracking with no re-renders, and per-instance SVG id scoping.
- **Motion and a11y care throughout:**
  - reduced-motion paths everywhere;
  - `IconSwapItem` uses the exact spring with bounce 0;
  - hit areas extended with pseudo-elements in most controls;
  - `trap-focus` and return focus in AssistantPanel;
  - IME-safe Enter handling in prompt-input;
  - the iOS 16px zoom guard and `scrollbar-gutter` handling in `globals.css`.
- **Comments that explain real constraints:** Safari bar-tint remounts, Base UI vs Radix Escape bubbling, BlurImage cached-image hydration, the Mermaid figure-not-region choice.
- **Base UI usage follows the rules:** `render` prop, `data-starting-style`/`data-ending-style`, `--anchor-width`. No `asChild` or `data-state` anywhere in scope.
- **Search dialog lazy-mount** (`search/index.tsx`) keeps the markdown pipeline out of first load while still playing the enter transition.
- **The `InlineMarkdown` idea** (one source string for the page and the llms routes) is right even if the parser moves.

## 8. Contradictions and questions for the owner

1. **Mobile menu focus trap.** CLAUDE.md says to use Base UI for overlays. `layout/header/mobile/index.tsx` hand-writes a focus trap and outside-click handling to avoid Safari tinting its bars from a backdrop, and its pill toggle sits outside the popup. Should it move to `modal='trap-focus'`, accepting that the toggle leaves the Tab cycle, or stay hand-written with the reason recorded?
2. **Attribution policy.** THIRD_PARTY_NOTICES credits chanhdai, braydoncoyer and others, but not fumadocs-ui (header and TOC adapted from its dist), Kibo UI (`contributions.tsx`) or Delba de Oliveira (BlurImage, which has an in-file header). Should adapted code from MIT dependencies get notices too? I believe `ai-elements/markdown.tsx` (`rehypeWrapWords`/`createProcessor`) may come from the Fumadocs docs app, but I did not verify that, so it is not annotated.
3. **Registry components outside `ui/`.** `biome.jsonc` excludes `src/components/ui` as vendored, but the Kibo contribution graph lives in `features/` and gets linted and reviewed as owned code. Which rule applies to registry components outside `ui/`?
4. **Scale on press.** The make-interfaces-feel-better skill says to add a `static` prop to opt out of press scale. The repo instead overrides with `active:scale-none` per call site (page-actions, more-link). Keep the override pattern or add a Button prop?
5. **No-comments skill vs this pass.** The skill wants the comment-sicko agent to delete comments, but this reviewer pass may only add comments. I applied its rules by hand and annotated only clear violations. Confirm comment-sicko runs in phase 3 instead.

Total TODO(slopradar) comments inserted: 97.

---

## Report: `src/lib, src/server, src/hooks, src/contexts, src/constants, src/types, src/env.ts, src/styles`


Repo: `/Volumes/Data/Developer/DevContainers/portfolio-tip`. I read all 113 files in scope in full, plus the required reads (`.claude/CLAUDE.md`, `biome.jsonc`, `THIRD_PARTY_NOTICES.md`, `src/server/db/schema/index.ts`, `src/env.ts`). I applied the desloppify (review mode), no-comments, ultracite and ai-sdk rules. I checked AI SDK claims against `node_modules/ai/src`, and Next claims against `node_modules/next/dist/docs`. The only edits are `// TODO(slopradar):` lines (`/* */` in CSS). No code changed and no git commands were run.

## 1. Baseline and after

| Check | Baseline | After annotating |
| --- | --- | --- |
| `bun run typecheck` | pass, 0 errors | pass, 0 errors |
| `bunx biome check <scope>` | 113 files, 0 errors, 0 warnings, 0 infos | 113 files, 0 errors, 0 warnings, 0 infos |

## 2. Slop score: 4 / 10

The code is typed, lint-clean and mostly uses package APIs correctly: current AI SDK (`Output.object`, `customProvider`), zod-validated env, and a layered safe-action client. The slop is accumulation rather than bad design:
- about 14 unused exports and dead branches;
- facts copied across files (table creator, baseUrl import path, the X handle, page titles and paths, the reveal selector);
- a handful of swallowed errors that hide broken assets or cache empty results for a day.

Two findings are real type or behaviour defects:
- The `authClient` annotation erases every plugin type.
- The comment-moderation `if (!output)` branch can never run.

## 3. Systemic patterns

1. **Unused exports and dead code** (14). Examples: `src/lib/validators/guestbook.ts:67` (six unused inferred types), `src/lib/ai/chat/confirmation.ts:10` (`ToolName`), `src/server/comments/moderation.ts:90` (unreachable `if (!output)`), `src/lib/ai/prompts/chat/index.ts:25` (`.filter(Boolean)` on constants).
2. **The same fact in more than one file** (12). Examples: `src/server/db/schema/auth.ts:3` (`createTable` x3), `src/server/comments/moderation.ts:74` (moderation call duplicated in the guestbook action), `src/constants/search.tsx:8` (restates `constants/pages.ts`), `src/constants/index.ts:3` (two import paths for `baseUrl`), `src/lib/metadata.ts:89` (X handle).
3. **Swallowed errors and fallbacks that hide bad data** (7). Examples: `src/lib/og.ts:27` and `:109`, `src/lib/github-contributions.ts:25` (caches `[]` for 24h), `src/lib/metadata.ts:7` (localhost in production), `src/lib/source/pages.ts:15` (`?? 'Untitled'` on a required field).
4. **Layering inversions and misplaced types** (4). Examples: `src/lib/ai/chat/types.ts:4` (lib imports from `src/app/api`), `src/lib/github-contributions.ts:5` (lib imports from a component), `src/lib/ai/chat/types.ts:20` (`CustomDocument`), `src/lib/validators/guestbook.ts:39` (`ModerationResultSchema`).
5. **Hand-written types or casts where a package type exists** (6). Examples: `src/lib/ai/providers.ts:14` (ai-retry exports `ModelRetryContext`), `src/lib/auth-client.ts:13`, `src/lib/toast.ts:7`, `src/lib/github-code.ts:24`, `src/env.ts:8`.
6. **Comment slop** (5). Examples: `src/env.ts:6` (x10 section banners), `src/lib/validators/guestbook.ts:3` (x3 banners), `src/lib/employment-period.ts:20`, `src/styles/globals.css:61`, `src/lib/is-active.ts:8` (copied fumadocs JSDoc with no attribution).
7. **Two mechanisms for one concern** (3). Examples: `src/lib/audio/preferences.ts:76` (imperative sound gate next to the `SoundProvider` gate), `src/lib/auth-client.ts:7` (raw sonner toast next to the sound-wrapped `@/lib/toast`), `src/hooks/use-reduced-motion.ts:10` (re-implements motion's hook).
8. **Unclear names and wrong file extensions** (6). Examples: `src/lib/ai/chat/types.ts:17` (`MyUIMessage`), `src/constants/portfolio/skills.tsx:4` (`s`, `t`), `src/constants/portfolio/uses.ts:3` (`hw`, `sw`, `swt`), `src/hooks/use-mobile.tsx:1` (.tsx with no JSX, x4).

## 4. Findings table

### src/env.ts
| file:line | rule | what is wrong | fix |
| --- | --- | --- | --- |
| src/env.ts:6 | no-comments | Section banners (`// App` and so on, x10) restate the key names | Delete them |
| src/env.ts:8 | redundant assertion | `z.url().min(1)`: url already rejects an empty string | Drop `.min(1)` |
| src/env.ts:45 | env default in caller | `GITHUB_CONTRIBUTIONS_API_URL` default lives in the caller as a `\|\|` fallback | Use `z.url().default(...)` here |

### src/server
| file:line | rule | what is wrong | fix |
| --- | --- | --- | --- |
| src/server/auth/index.ts:37 | redundant async/await | `async () => await x` (also `revokeSession`) | Return the promise directly |
| src/server/comments/moderation.ts:66 | ai-sdk | A single text part is wrapped in `UserContent` plus `messages` | Use `prompt` |
| src/server/comments/moderation.ts:74 | duplication | Same generateText, schema, logging and fallback message as `guestbook/actions/utils/moderation.ts` | Extract one shared `moderate()` and one message constant |
| src/server/comments/moderation.ts:90 | dead code | `result.output` throws `NoOutputGeneratedError`, so `!output` is never true | Delete the branch |
| src/server/db/index.ts:10 | dead config | `casing: 'snake_case'` does nothing: every column has an explicit name and drizzle.config sets no casing | Drop it, or set casing in both and drop the names |
| src/server/db/queries/guestbook.ts:67 | redundant fallback | `row.signature ?? null` on a nullable column | Drop it |
| src/server/db/queries/guestbook.ts:117 | boolean parameter | Positional `isAdmin = false` | Use an options object, or split into two functions |
| src/server/db/queries/guestbook.ts:138 | verbose | `deleted.length > 0 ? deleted[0] : null` | `deleted[0] ?? null` |
| src/server/db/schema/auth.ts:3 | duplication | `pgTableCreator` declared in 3 schema files | Export one shared `createTable` |
| src/server/db/schema/comments.ts:13 | duplication | Second copy of that creator | Import the shared one |

### src/lib
| file:line | rule | what is wrong | fix |
| --- | --- | --- | --- |
| src/lib/ai/chat/confirmation.ts:10 | unused export | `ToolName` has no importers and equals `keyof ChatTools` | Delete it |
| src/lib/ai/chat/types.ts:4 | layering | lib imports tools from `src/app/api/chat` | Move the tools into lib, or move the types next to the route |
| src/lib/ai/chat/types.ts:17 | unclear name | `MyUIMessage` | Rename to `ChatUIMessage` |
| src/lib/ai/chat/types.ts:20 | misplaced | `CustomDocument` is used only by `search-docs.ts` | Move it there as `SearchDocument` |
| src/lib/ai/prompts/chat/index.ts:25 | dead code | `.filter(Boolean)` on non-empty constants; trimming is inconsistent across parts | Drop the filter and trim the parts |
| src/lib/ai/prompts/moderation/index.ts:6 | dead code | Same `.filter(Boolean)`; parts are already trimmed | Drop the filter and the outer trim |
| src/lib/ai/providers.ts:14 | duplicate type | Hand-typed `onError` context | Use ai-retry's `ModelRetryContext` |
| src/lib/audio/preferences.ts:76 | two gates | `playSound` re-implements the enabled and reduced-motion checks that `SoundProvider` already applies | Keep one gate |
| src/lib/auth-client.ts:7 | inconsistent | Raw sonner toast, so the 429 toast plays no sound | Import toast from `@/lib/toast` |
| src/lib/auth-client.ts:13 | type erasure | `ReturnType<typeof createAuthClient>` is `ReactAuthClient<BetterAuthClientOptions>`, which drops the admin, multiSession and additional-field types. With `noEmit` the TS2742 error from better-auth issue #1391 cannot occur | Drop the annotations |
| src/lib/employment-period.ts:20 | no-comments | Comment narrates the branch | Delete it |
| src/lib/files.ts:18 | magic number | `5` is `'data:'.length` | Name the prefix |
| src/lib/get-llm-text.ts:8 | dead option | `'subsection'` is never passed and the union is spelled twice | Use a record and drop the switch |
| src/lib/get-llm-text.ts:46 | magic string | Branch `main` hard-coded here and in `blog/[slug]/page.tsx` | Add a `githubBranch` constant |
| src/lib/github-code.ts:24 | duplicate type | Inline return type restates `ParsedGitHubFileUrl['lineRange']` | Use that type |
| src/lib/github-code.ts:41 | redundant checks | `Number.isNaN` after a `\d+` capture | Drop both guards |
| src/lib/github-contributions.ts:5 | layering | lib imports the `Activity` type from a component | Export the inferred type from lib |
| src/lib/github-contributions.ts:25 | swallowed error | Failure returns `[]`, which `unstable_cache` keeps for 24h | Throw, and render the fallback at the caller |
| src/lib/is-active.ts:8 | attribution | Copied from fumadocs-ui `utils/urls.ts` with its JSDoc and no header | Add an adapted-from header and drop the JSDoc |
| src/lib/link-preview.ts:13 | unused export | Type re-export has no importers | Delete it |
| src/lib/link-preview.ts:28 | redundant guard | `existsSync` before a try that already handles a missing file | Drop it |
| src/lib/link-preview.ts:34 | unchecked cast | `JSON.parse` result (`any`) trusted as the manifest type | Parse with zod |
| src/lib/metadata.ts:7 | fallback shaping | A production build without a base URL emits localhost URLs | Require the variable in production in env.ts |
| src/lib/metadata.ts:89 | magic string | X handle duplicated in `social.tsx` | One constant |
| src/lib/og.ts:18 | magic string | `replace()` silently no-ops if the svg attributes change | Keep the size next to `PORTRAIT_CHIP_VIEW_BOX` |
| src/lib/og.ts:27 | swallowed error | Missing portrait is silent | Log or throw |
| src/lib/og.ts:39 | comment placement | Tracing comment sits above `LATIN`, not `FONT_FILES` | Move it |
| src/lib/og.ts:109 | swallowed error | Missing font is silent | Log or throw |
| src/lib/resend.ts:32 | bad error message | Can throw "Failed to update contact: undefined" | Branch on `error` first |
| src/lib/reveal-script.ts:7 | duplicated selector | Same selector in `globals.css` | Define it once |
| src/lib/safe-action/index.ts:4 | unused re-exports | Middleware and `ActionContext` re-exports have no importers | Drop them |
| src/lib/source/blog.ts:11 | unused export | `Post` | Delete it |
| src/lib/source/blog.ts:34 | duplication | Comparator repeated | Reuse `getSortedByDatePosts` |
| src/lib/source/pages.ts:15 | dead fallback | `?? 'Untitled'` on a required title (x2); the two maps are near-identical | One helper |
| src/lib/toast.ts:7 | redundant assertion | `as SonnerToast` on an already-typed Proxy | Drop the cast |
| src/lib/toast.ts:15 | duplication | Three identical branches | Sound lookup record |
| src/lib/validators/comments.ts:21 | unused exports | Two types | Delete them |
| src/lib/validators/contact.ts:16 | duplicated literal | `'5,000'` restates the constant | Interpolate it |
| src/lib/validators/guestbook.ts:3 | no-comments | Section banners (x3) | Delete them |
| src/lib/validators/guestbook.ts:39 | misplaced | `ModerationResultSchema` is shared with comments | Move it to `validators/moderation.ts` |
| src/lib/validators/guestbook.ts:46 | type-only schema | Output schemas are never parsed | Plain types, or derive from the Drizzle select |
| src/lib/validators/guestbook.ts:67 | unused exports | Six inferred types | Delete them |
| src/lib/validators/newsletter.ts:6 | unused export | `Newsletter` | Delete it |
| src/lib/validators/session.ts:7 | unused export | `RevokeSession` | Delete it |

### src/hooks
| file:line | rule | what is wrong | fix |
| --- | --- | --- | --- |
| src/hooks/use-mobile.tsx:1 | wrong extension | No JSX (x4 in scope) | Rename to `.ts` |
| src/hooks/use-reduced-motion.ts:10 | library exists | Re-implements `motion/react`'s `useReducedMotion` | Adopt it, or name why the `true` server snapshot matters |

### src/constants and src/types
| file:line | rule | what is wrong | fix |
| --- | --- | --- | --- |
| src/constants/index.ts:3 | two import paths | `baseUrl` re-exported here and also imported from lib/metadata | Pick one owner |
| src/constants/portfolio/experiences.tsx:1 | wrong extension | No JSX | Rename to `.ts` |
| src/constants/portfolio/skills.tsx:4 | unclear names | `s`, `t` | Descriptive names |
| src/constants/portfolio/skills.tsx:161 | spread in accumulator | Copies the array on every item | Push into the existing array |
| src/constants/portfolio/uses.ts:3 | unclear names | `hw`, `sw`, `swt` | Descriptive names |
| src/constants/search.tsx:8 | duplication | Titles and paths restate `pages.ts` and `links.tsx` | Build from `pages` |
| src/constants/search.tsx:142 | unclear mapping | let-and-overwrite, keyed by display title | Record lookup |
| src/types/uses.ts:1 | duplicate type | `Logo` is the same shape as `TechStackItem['icon']` | One `ThemedImage` type |

### src/styles
| file:line | rule | what is wrong | fix |
| --- | --- | --- | --- |
| src/styles/globals.css:61 | no-comments | `/* fonts */` banner | Delete it |
| src/styles/globals.css:80 | fragmented layer | Three `@layer base` blocks | Merge them |
| src/styles/globals.css:343 | shadowed utility | Redefines Tailwind's `border-border` | Own token or utility name |
| src/styles/globals.css:414 | dead rule | `.dark ::selection` is identical to `::selection` | Delete it |
| src/styles/simba.css:40 | magic numbers | Rig origins repeated | Custom properties |

## 5. Structural verdict (ordered cleanup bands)

1. **Delete the dead code.** Remove all unused exports and types, the `if (!output)` branch, `.filter(Boolean)`, the dead `?? 'Untitled'`, `?? null` and `Number.isNaN` guards, the `existsSync` check, and the duplicate `::selection` rule.
2. **Comments.** Remove the env and validator banners, the narration in employment-period, and `/* fonts */`. Add an attribution header to `is-active.ts`. Move the OG tracing comment above `FONT_FILES`.
3. **Moderation.** Write one `moderate(content)` in `src/lib/ai/moderation/`, owning the prompt, `ModerationResultSchema`, the error constant and the call. Use it from both comments and guestbook.
4. **Layering.** Move the chat tools (or the `ChatTools` and `ChatUIMessage` types) so lib does not import from app. Export the contributions type from lib. Move `CustomDocument` next to `search-docs.ts`.
5. **One owner per fact.**
   - `schema/table.ts` holds `createTable`.
   - `baseUrl` lives in `@/lib/metadata` only.
   - The X handle, `githubBranch`, a `ThemedImage` type and the reveal selector each get one constant.
   - Command-menu pages are built from `constants/pages.ts`.
6. **Types.**
   - Drop the `authClient` and `signIn`/`signOut`/`useSession` annotations.
   - Use ai-retry's `ModelRetryContext`.
   - Drop the `toast` cast.
   - Validate the link-preview manifest with zod.
   - Turn the guestbook output schemas into plain types.
7. **Error handling.** Log or throw in the OG asset loaders. Contributions should throw instead of caching `[]`. Fix the resend `updateContact` message. Requiring `NEXT_PUBLIC_BASE_URL` in production is an owner decision, because it changes build behaviour.
8. **Libraries and mechanisms.** Pick one sound gate (`SoundProvider` vs `playSound`). Route the auth-client toast through `@/lib/toast`. Consider `motion/react`'s `useReducedMotion`. Moving from `unstable_cache` to `'use cache'` (which the Next 16 docs recommend) needs `cacheComponents`, so it is an owner decision.
9. **Renames.** `MyUIMessage` becomes `ChatUIMessage`. Rename `.tsx` files with no JSX to `.ts`: `use-mobile`, `use-theme-shortcut`, `experiences`, `skills`. Give the single-letter path helpers real names.
10. **CSS tidy.** Merge the `@layer base` blocks, replace the `border-border` override with a token, and add simba origin custom properties.

Proposed additions to the tree: `src/lib/ai/moderation/{prompt.ts,schema.ts,moderate.ts}` (absorbing `prompts/moderation/*` and `ModerationResultSchema`), `src/server/db/schema/table.ts`, and `src/lib/ai/chat/tools/` if the tools move out of the route. Nothing in scope should be deleted wholesale.

## 6. Orphans (checked by grep across src, emails, scripts and root configs)

- **Files:** none. Every file in scope has an importer.
- **Unused exports:**
  - `ToolName`
  - `Post`
  - `CommentImageContent`, `CommentMentionContent`
  - `GuestbookEntry`, `GuestbookReaction`, `GuestbookEdit`, `GuestbookDelete`, `GuestbookBanUser`, `GuestbookModerationResult`
  - `Newsletter`, `RevokeSession`
  - the type re-export in `link-preview.ts`
  - the middleware and `ActionContext` re-exports in `safe-action/index.ts`
- **Exported but only used in their own file** (could be made non-exported): `CoverBlob`, `SearchPage`, `AccountAction`, `Author`, `ExperiencePositionItemType`, `StoryPhoto`.
- **Dependencies:** not assessed here (root-config scope). `BETTER_AUTH_URL` and `BLOB_READ_WRITE_TOKEN` are validated in env.ts but never read through it, because their libraries read `process.env` themselves. That is acceptable.

## 7. What is good and should be kept

- `env.ts` validation, including the production-only required `BETTER_AUTH_SECRET`.
- The safe-action chain: public, then user, then admin middleware, with the error message kept apart from the server-only code.
- The guestbook query: one cached shared read, with the viewer's reactions merged per request.
- AI SDK usage is current: `customProvider`, `Output.object`, `instructions`, ai-retry fallbacks.
- The deterministic cover PRNG.
- The `reveal-script.ts` and `globals.css` comments that record browser quirks (iOS observer timing, iOS input zoom, react-remove-scroll).
- The attribution header in `audio/minimal.ts`.
- Consistent `portfolio_` table prefixes.
- No `any`, a biome-ignore with a stated reason, and zod-parsed contribution data.

## 8. Contradictions between rule sources (questions for the owner)

1. **`cn` barrel.** CLAUDE.md says to use `cn` from `src/lib/utils.ts`, but that file is a one-line re-export of the `cn` package. Ultracite says to avoid barrel files, and `noBarrelFile` is parked off. Keep the re-export, or import `cn` directly?
2. **no-comments skill vs this brief.** The no-comments skill says to spawn comment-sicko and apply its edits, but the brief says change no code. I applied its rules by hand and did not spawn it. Is that the intended reading for review passes?
3. **`noUnnecessaryConditions`.** It is parked off in biome.jsonc, yet desloppify flags dead fallbacks like `?? 'Untitled'` and `if (!output)`. Adopt the rule so these are caught mechanically?
4. **`unstable_cache`.** Next 16 docs say it is replaced by `'use cache'`, which needs `cacheComponents`. Adopt that, or keep `unstable_cache` as a standing exception?
5. **Index names.** CLAUDE.md requires the `portfolio_` prefix for tables, but index names like `comment_idx` are unprefixed and global within a Postgres schema. Does the prefix rule cover indexes?
6. **`useErrorCause`.** It is parked off, while ultracite asks for descriptive errors. `resend.ts` inlines `JSON.stringify(error)` instead of passing `cause`. Which should win?

Total TODO(slopradar) comments inserted: 72.

---

## Report: `emails/, scripts/, root config`


Scope: `emails/contact-notification.tsx`, `emails/newsletter-welcome.tsx`, `scripts/lint.ts`, `scripts/generate-portrait.ts`, `scripts/link-previews/{config,fix,generate,types,utils}.ts`, `next.config.ts`, `source.config.ts`, `biome.jsonc`, `package.json`. I read every file in full, plus `.claude/CLAUDE.md`, `biome.jsonc`, `THIRD_PARTY_NOTICES.md`, the `package.json` scripts, the ultracite core/react/next presets, the Next 16 docs under `node_modules/next/dist/docs`, and the `next-validate-link` source.

Skills: `desloppify` (review mode) and `ultracite` were read from `.agents/skills/` because the Skill tool did not list them. For `no-comments`, I applied its rules from the brief myself. I did not spawn `pstack:comment-sicko`, because that agent deletes comments and this pass may only add them.

The only edits are added `TODO(slopradar)` lines. No git commands that change state were run.

## 1. Baseline and after

| Check | Baseline | After annotating |
| --- | --- | --- |
| `bun run typecheck` | exit 0, 0 errors | exit 0, 0 errors |
| `bunx biome check emails scripts next.config.ts source.config.ts biome.jsonc package.json` | 13 files, 0 diagnostics | 13 files, 0 diagnostics |

One edit dropped a space in `generate-portrait.ts` and biome flagged it. I put the space back and re-ran both checks clean.

I also ran `SKIP_ENV_VALIDATION=true bun run check:links` (read-only). It reported "collected 29 URLs, 2 fallbacks; 0 errors". The 2 fallbacks are the bug in pattern 1.

## 2. Slop score: 4 / 10

The scope is small and lint-clean, and most of it is intentional. But it contains two real correctness bugs:
- The link checker never validates blog-post links.
- The link-preview exclusion list matches substrings, so `x.com` also excludes `netflix.com` and `dropbox.com`.

Around those sit config entries that do nothing, a link-preview tool split into two near-identical scripts with a types file that only restates config, and email templates with stale preview data, a dead image fallback and repeated fonts and colours.

## 3. Systemic patterns

1. **Silent failure in the tooling (4).** The link check passes no matter what (`scripts/lint.ts:21`). `loadManifest` turns any error into `null` (`scripts/link-previews/utils.ts:153`). The `networkidle` error is thrown away (`utils.ts:202`). `ignoreBuildErrors` means `next build` never type-checks (`next.config.ts:135`).
2. **Config that does nothing (6).**
   - `useTypeScriptCli: true` is already the default (`next.config.ts:23`).
   - Unused image qualities and remote patterns, and `port: ''` repeated four times (`next.config.ts:31`, `:33`).
   - A duplicate `/work` redirect (`next.config.ts:80`).
   - `serverExternalPackages` entries Next already includes (`next.config.ts:115`).
   - An always-empty `detection.components` (`scripts/link-previews/config.ts:72`).
3. **Copies of code or types that something else already owns (5).**
   - `transformerEscape` is a verbatim copy of shiki's `transformerRemoveNotationEscape` with no attribution (`source.config.ts:52`).
   - An inline mdast node type (`utils.ts:69`).
   - The newsletter `posts` type restates the blog page data (`emails/newsletter-welcome.tsx:21`).
   - `scripts/link-previews/types.ts:6` only restates the config.
   - `dateSchema` is `z.coerce.date()` written the long way (`source.config.ts:14`).
4. **Duplicated flows (4).** `fix.ts` and `generate.ts` repeat each other (`scripts/link-previews/fix.ts:13`, `generate.ts:14`). The two `populate` entries repeat one mapper (`scripts/lint.ts:31`). The Font blocks repeat across both email templates (`emails/newsletter-welcome.tsx:76`).
5. **Magic strings and numbers (5).** A hard-coded Chrome 120 user agent (`utils.ts:180`), `'.jpeg'`/`'.png'` (`utils.ts:258`), `'/previews/'` (`utils.ts:276`), a `45_000` timeout (`fix.ts:25`), and inline hex colours (`emails/contact-notification.tsx:25`).
6. **Hand-written code where a library or platform feature exists (3).** jiti is used to load env in `next.config.ts` (`:8`). SVG-to-JSX is done with regexes instead of svgr (`scripts/generate-portrait.ts:13`). The shiki transformer is copied (`source.config.ts:52`).
7. **Names that do not say what they are (3).** `scripts/lint.ts` only checks links (`lint.ts:1`). The config export is just called `content` (`config.ts:7`). The `--all` flag actually means "also retry failed" (`fix.ts:40`).

## 4. Findings table

### Root config

| file:line | rule | what is wrong | fix |
| --- | --- | --- | --- |
| next.config.ts:8 | platform-api | jiti plus a dynamic import only to load `src/env` | Use a top-level `import './src/env'`, check that `bun dev` still validates env, then drop jiti |
| next.config.ts:23 | dead-config | `useTypeScriptCli` is the Next 16 default, and does nothing while `ignoreBuildErrors` is on | Delete the block and its comment |
| next.config.ts:31 | dead-config | `qualities` 100 and 95 are never requested; only 75 and 85 are used | `[75, 85]` |
| next.config.ts:33 | dead-config | The `avatars.githubusercontent.com` and `fumadocs.dev` patterns match no `next/image` src; `port: ''` (x4) is the default | Delete them |
| next.config.ts:80 | duplication | `/work/:path*` already matches `/work` | Delete the `/work` entry |
| next.config.ts:115 | dead-config | `ts-morph`, `typescript` and `shiki` are already in Next's built-in external list | Drop them |
| next.config.ts:131 | undeclared-dependency | The `framer-motion` alias targets a package that is only there as a dependency of `motion` | Declare `framer-motion` 14.2.0 in package.json |
| next.config.ts:135 | swallowed-errors | `ignoreBuildErrors: true`: the build never type-checks | Owner decision: drop it, or keep it and give a one-line reason |
| next.config.ts:151 | indirection | A reduce over two plugins, `withBotId` applied outside it, and `createNextConfig` returning a local | Compose `withBotId(mdxPlugin(bundleAnalyzerPlugin(cfg)))` directly |
| source.config.ts:14 | redundant-schema | A string/date union piped into `z.coerce.date()` | `z.coerce.date()` |
| source.config.ts:52 | library-exists | Verbatim copy of shiki's `transformerRemoveNotationEscape`, with no attribution | Add `@shikijs/transformers` and import it, or add an attribution header and a THIRD_PARTY_NOTICES entry |

### scripts/

| file:line | rule | what is wrong | fix |
| --- | --- | --- | --- |
| scripts/lint.ts:1 | unclear-name | The file only checks links | Rename to `scripts/check-links.ts` |
| scripts/lint.ts:21 | stale-route (**bug**) | The `'(home)/(blog)/blog/[slug]'` key no longer exists, so blog slugs and tags fall back to wildcards and post links are never validated | Use `'(home)/blog/[slug]'` and also fill in `'(home)/blog/tags/[tag]'` |
| scripts/lint.ts:31 | duplication | One mapper written twice; `Promise.all` wraps values that are not promises (x2) | Extract `toParams(pages)` and drop the `await Promise.all` |
| scripts/generate-portrait.ts:13 | library-exists | Regex SVG-to-JSX: only single-hyphen attributes are camelCased, no style or xlink handling | `@svgr/core` with svgo's `prefixIds` |
| scripts/link-previews/types.ts:6 | duplicate-types | The interfaces only restate config.ts | Use `as const` / `satisfies` and delete the file |
| scripts/link-previews/config.ts:7 | unclear-name | The export is just called `content` | `contentGlobs` |
| scripts/link-previews/config.ts:72 | dead-code | `components: {}` is always empty, so the MDX JSX branch in `extractUrls` never runs | Delete both, or list real components |
| scripts/link-previews/utils.ts:26 | unused-export | Three functions are exported but only used inside the file (x3) | Drop `export` |
| scripts/link-previews/utils.ts:44 | bug | `hostname.includes(d)` is a substring match (`x.com` also excludes `netflix.com`) | `hostname === d \|\| hostname.endsWith('.' + d)` |
| scripts/link-previews/utils.ts:58 | unchecked-cast | `file.data as Record<string, unknown>` | Parse with a small zod object |
| scripts/link-previews/utils.ts:69 | duplicate-types | The inline node type restates the mdast and mdx-jsx types | `visit(tree, 'link', …)` so the node type is narrowed for you |
| scripts/link-previews/utils.ts:153 | swallowed-errors | Every error becomes `null`, so a malformed manifest gets silently overwritten | Return `null` only for ENOENT; validate with zod next to `LinkPreviewManifest` |
| scripts/link-previews/utils.ts:180 | magic-string | Hard-coded Chrome 120 user agent; the viewport is copied field by field | Use `devices['Desktop Chrome']` and `viewport: screenshot.viewport` |
| scripts/link-previews/utils.ts:193 | floating-promise | The `route.abort()` / `route.continue()` promises are dropped | Return them |
| scripts/link-previews/utils.ts:202 | swallowed-errors | The `networkidle` error is discarded; a magic 3000 ms extra wait | Keep the first error; move the wait into config |
| scripts/link-previews/utils.ts:258 | magic-string | `'.jpeg'`/`'.png'` restate the format type | Derive from `screenshot.image.format` |
| scripts/link-previews/utils.ts:276 | magic-string | `'/previews/'` restates `paths.output` | Add `paths.publicPath` to config |
| scripts/link-previews/fix.ts:13 | duplication | `captureMissing` and `main` repeat generate.ts | Merge into one script with a mode, and one package.json entry |
| scripts/link-previews/fix.ts:25 | magic-number | A `45_000` timeout overrides the 60_000 in config with no reason given | Use the config value, or name a retry timeout there |
| scripts/link-previews/fix.ts:40 | unclear-name | `--all` means "also retry failed" | Rename to `--retry-failed` and read it with `util.parseArgs` |
| scripts/link-previews/generate.ts:14 | duplication | Same capture loop as fix.ts | Merge (see fix.ts:13) |

### emails/

| file:line | rule | what is wrong | fix |
| --- | --- | --- | --- |
| emails/contact-notification.tsx:25 | magic-string | Four inline hex colours; the other template uses a different palette and fonts | Put palette and fonts in a shared `emails/theme.ts` |
| emails/contact-notification.tsx:71 | narration-comment | The comment restates `whitespace-pre-wrap` | Delete it |
| emails/newsletter-welcome.tsx:21 | duplicate-types | The `posts` type restates `BlogPage['data']`; `author`, `date` and `tags` are never read | `Pick<BlogPage['data'], 'title' \| 'description' \| 'image'> & { url }` |
| emails/newsletter-welcome.tsx:40 | inconsistent-scale | Arbitrary px values next to scale classes in the same file (x12) | Use the Tailwind scale |
| emails/newsletter-welcome.tsx:45 | a11y | `alt='Post image'` is the only text of that link | Use the post title |
| emails/newsletter-welcome.tsx:46 | dead-fallback | `src/lib/resend.ts` always passes `${baseUrl}${image}`, so a post without an image gets `/undefined` and the placeholder never shows | Pass `image` through unchanged in resend.ts |
| emails/newsletter-welcome.tsx:76 | duplication | Versioned gstatic Font blocks (x3 across both templates) | Move them to `emails/theme.ts` |
| emails/newsletter-welcome.tsx:152 | stale-fixture | PreviewProps use template posts and `/posts/...` URLs that do not exist; they are the only users of three images | Use real posts and delete those images |

### Report-only findings (package.json and biome.jsonc cannot hold comments)

| file | rule | what is wrong | fix |
| --- | --- | --- | --- |
| package.json `dependencies` | undeclared-dependency | `framer-motion` is aliased in next.config but not declared | Add `"framer-motion": "14.2.0"` |
| package.json `dependencies.jiti` | unused-dependency (once next.config is fixed) | Only used by the env workaround | Remove after next.config.ts:8 |
| package.json `fix-previews` / `generate-previews` | duplication | Two scripts for one tool | One script plus a flag, after merging fix.ts and generate.ts |
| package.json `check:links` | unclear-name | Points at `scripts/lint.ts` | Update with the rename |
| biome.jsonc:11-17 | dead-config | `vcs.useIgnoreFile` already ignores `node_modules`, `.next` and `.vercel`. `!pnpm-lock.yaml` is dead (the repo uses bun, there is no pnpm lock). `!**/*.grit` matches no file | Drop those includes |
| biome.jsonc:47 | dead-config | `useUniqueElementIds: off` is already off in the ultracite preset | Delete |
| biome.jsonc:34-35, 55, 57, 61, 67 | missing-reason | These are disabled with no reason, unlike the "new in 2.5" block: `noSvgWithoutTitle`, `useGenericFontNames`, `noBarrelFile`, `noNamespaceImport`, `noNonNullAssertion`, `noLeakedRender` ("graduated" is not a reason) | Give each a constraint, or re-enable |
| biome.jsonc:42 | magic-number | `maxAllowedComplexity: 31` versus the preset's 20, with no reason | Name the function that needs it, or lower it |
| biome.jsonc:71 | over-broad-override | `noUnknownAttribute` is off repo-wide only for `tw` in OG images | Move it to an `overrides` entry for `src/app/og/**` |

## 5. Structural verdict: ordered cleanup bands

1. **Fix the link checker.** Correct the route key, fill in the tags route, and drop the `Promise.all` calls (`scripts/lint.ts:21`, `:31`). Then rename the file to `scripts/check-links.ts` and update the `check:links` script. Expect it to surface broken blog links it has been hiding.
2. **Fix the link-preview correctness issues.** Domain matching (`utils.ts:44`), manifest errors handled only for ENOENT plus a zod schema (`:153`), the dropped route promises (`:193`), and the discarded `networkidle` error (`:202`). After band 4 this is a visible change on the site: previews return for hosts like `netflix.com` and `dropbox.com`. The owner should accept that before regenerating.
3. **Clean up `next.config.ts`.** Static env import and drop jiti; remove `useTypeScriptCli`, the unused qualities and patterns, the duplicate `/work` redirect, and the duplicate external packages; compose the plugins directly; declare `framer-motion`. `ignoreBuildErrors` is an owner decision.
4. **Merge the link-preview scripts.** One `scripts/link-previews/index.ts` with a mode. Delete `types.ts` (use `as const` config), the dead `detection.components` and its MDX JSX branch, and the unneeded exports. Use playwright `devices`, and put the derived paths and extensions in config. Target layout: `scripts/link-previews/{config.ts, capture.ts, index.ts}`.
5. **`source.config.ts`.** Switch to `z.coerce.date()`, and adopt `@shikijs/transformers` (or add attribution).
6. **Emails.** Add a shared `emails/theme.ts` (palette and Font blocks); narrow the `posts` type with `Pick`; fix the alt text; fix the image URL in `src/lib/resend.ts` (outside my scope, needs the `src/lib` owner); refresh PreviewProps and delete the three orphan images; use Tailwind scale classes. The theme consolidation could change how the emails look, so it is an owner decision.
7. **`biome.jsonc` tidy-up.** Remove the redundant includes and `useUniqueElementIds`; give every parked rule a reason; scope `noUnknownAttribute` to OG images.
8. **`generate-portrait`.** Adopt `@svgr/core` with `prefixIds` (low priority; works today because `portrait.svg` has no multi-hyphen, style or xlink attributes).

## 6. Orphans (verified by grep over `src emails scripts content` and root configs)

- **Files:** `public/images/blog/pages.png`, `markdown-examples.png` and `using-mdx.png` are only referenced by the newsletter PreviewProps. `public/images/placeholder.png` is only referenced by the newsletter's dead fallback.
- **Exports:** `shouldGeneratePreview`, `extractUrls`, `extractSourceUrls` (in `scripts/link-previews/utils.ts`). The `ScreenshotConfig`, `ExclusionsConfig`, `DetectionConfig` and `CaptureScreenshotResult` interfaces are only used to annotate their own literals.
- **Dependencies:** none unused today. Every declared package has an import or a CLI/config use (I checked `postcss-load-config`, `@commitlint/types` and `@floating-ui/react-dom` by hand). `jiti` becomes unused after band 3, and `framer-motion` is the one used but undeclared.
- **Config entries:** `images.qualities` 100 and 95; the `avatars.githubusercontent.com` and `fumadocs.dev` remote patterns; `detection.components`.

## 7. What is good and should be kept

- The `motion/react` → `framer-motion` alias comment and the TS7 comment explain real platform constraints (only the setting itself is redundant).
- The `contact-notification` header comment states intent a name cannot carry.
- The "new in 2.5" parked block in `biome.jsonc` is the right model for documenting disabled rules.
- `generate-portrait.ts` writes a "generated, do not edit" header, and the package script formats its output.
- The link-preview pipeline gets the important parts right: hashed file names, orphan cleanup, per-URL failure entries, and closing the browser and context in `finally`.
- `source.config.ts` loads its plugins with lazy `Promise.all` imports.
- The work `order` JSDoc documents the sort contract.
- `contact-notification` is a clean, minimal template.

## 8. Contradictions in the rulebook (questions for the owner)

1. **Build gate.** SLOPRADAR's "done" step requires `bun run build` to pass, but `next.config.ts` sets `typescript.ignoreBuildErrors: true`, so the build cannot fail on types. Should the build gate types, or is CI's `bun typecheck` the only gate?
2. **No-comments versus documented rules.** `no-comments` treats unexplained configuration as debt and `biome.jsonc` documents the 2.5 rules, yet six other rules are off with no reason. Should each disabled rule carry a constraint comment, or is the preset diff self-explanatory?
3. **lefthook React Doctor hook.** The `pre-commit` hook (`lefthook.yml`) always exits 0 even when React Doctor fails, so it never blocks a commit. Is it meant to block, as `--blocking warning` suggests?
4. **Comment-sicko.** `no-comments` says to spawn comment-sicko, which deletes comments, but the reviewer brief forbids changing code. I applied its rules by hand. Should reviewers skip spawning it during annotate, as I did?

Total TODO(slopradar) comments inserted: 40.

---

# Round 2

Run after the resolve pass: 328 of the round-1 annotations were worked down to 112 (skipped or declined, each with a reason in SLOPRADAR-RESOLUTIONS.md), three sonnet verifiers tried to refute the resolutions (one regression found and fixed), then four **sonnet** reviewers re-annotated. Round 1 used opus reviewers, so these scores are **not strictly comparable** with round 1: sonnet read every file again from scratch and found many new, mostly small items.

## Score table

| Scope | Round 1 score | Round 1 annotations | Round 2 score | Left from round 1 | New in round 2 | Total now |
| --- | --- | --- | --- | --- | --- | --- |
| src/app | 5 | 131 | 3.5 | 49 | 42 | 91 |
| src/components | 5 | 97 | 4 | 42 | 75 | 117 (+1 in ui/) |
| lib, server, hooks, types, constants, env, styles | 4 | 72 | 4 | 16 | 26 | 42 |
| emails, scripts, config | 4 | 40 | 2.5 | 4 | 17 | 21 |
| **Total** | | **340** | | **111** | **160** | **     268** |

Round 1 annotations were reduced from 340 to about 111 (11 bugs fixed, the rest resolved or logged as skipped/declined). The 160 new ones are mostly small duplication and naming items that the first pass did not flag, plus a few left by the resolve pass itself.

## Fixed after round 2 (real findings)

- `src/lib/resend.ts`: newsletter email links were `https://host//blog/...` (baseUrl is a URL object); now built with `url()`, and a post without an image passes `undefined` so the template's placeholder works.
- Chat prompts: the `searchDocs` input list no longer mentions the removed `locale`; the selected-context directive now describes the real `[Selected Context: {json}]` and `[Client Context: {json}]` blocks.

## What the reviewers flagged that is worth deciding

- **Behaviour or bug-class (left annotated):** `sign-in-modal.tsx` catch is unreachable because better-auth resolves `{ error }` instead of throwing (buttons stay disabled on API failure); `contact-form.tsx` shows the success check on a canceled state; `getPageContent('about')` omits the commit history that `about.md` and `llms-full.txt` include, so the assistant and the public `.md` differ; `searchDocs` returns full page text to the model although the prompts route text through `getPageContent`; `streamText` has no `abortSignal: request.signal` (reviewer unsure if needed in AI SDK 7).
- **Owner decisions added:** index names without the `portfolio_` prefix and camelCase columns in `schema/comments.ts` (any rename needs a migration); `SOURCE_MAPS` and `ANALYZE` read in `next.config.ts` outside `src/env.ts`; every disabled biome rule carrying a reason; `unstable_cache` to `use cache` (four more call sites found); keep or remove the unused exported `*Props` types in the `ai-elements` registry slice; `page-actions` `rel` (Referer) versus one shared external-link constant.
- **Package hygiene (report-only):** `remark-mdx` and `schema-dts` belong in devDependencies; version pinning is inconsistent; `framer-motion` is pinned exact while `motion` is a caret range.
- Reviewers could not load `react-doctor`, `vercel-composition-patterns`, `desloppify` or `ultracite`, so the components and app rounds applied those rules from the brief only.

The four reviewer reports (full findings tables) are in the session transcript; every finding is a `TODO(slopradar)` comment in the source, so `grep -rn "TODO(slopradar)" src emails scripts` is the worklist.

---

# Round 3 (Opus review)

Four Opus reviewers on the tree after the round-1 resolve pass, the sonnet round-2 review and fixes, the perf pass, the json-render merge and the merged-PR feed change. Opus, same scale as round 1, so these scores are comparable with round 1.

| Scope | Round 1 | Round 3 (Opus) | Left from earlier | New this round | Total now |
| --- | --- | --- | --- | --- | --- |
| src/app | 5 | 4 | 91 | 20 | 111 |
| src/components | 5 | 4 | 115 | 18 (+1 ui/) | 134 |
| lib, server, hooks, types, constants, env, styles | 4 | 3 | 38 | 19 | 57 |
| emails, scripts, config | 4 | 3 | 20 | 6 | 26 |
| **Total** | | | | **63** | **328** |

Round 1 gave 340 annotations; most of the 328 now are leftovers from earlier rounds (owner decisions, cross-scope moves, declined items) plus 160 sonnet-round findings that this pass has not resolved yet. Scores are one point better in every scope.

Findings worth acting on this round: `Shimmer` renders a `<p>` inside the tools' status `<p>` (React hydration warning on every chat), `transition-filter` is not a Tailwind utility (the uses-page desk photo snaps), the search page's inline `Item` component remounts every result per keystroke, both email templates still build `${baseUrl}/...` URLs with a double slash, `renderPortfolio` reintroduced two `?? 'Untitled'` fallbacks, `new URL(x, baseUrl)` is rebuilt about 11 times instead of `url()`, `StoryTrack`/`header`/`mermaid` swallow or cast, and dead CSS/exports in lib/styles.
