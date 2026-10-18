# Slopradar resolutions

## Round 1: the 11 real bugs

| # | File | Rule | What changed |
|---|------|------|--------------|
| 1 | `src/app/api/chat/route.ts` (convertDataPart), `src/lib/ai/chat/types.ts` | bug | `data-context` (the visitor's selected text) was dropped by `convertToModelMessages`; it is now converted to a text part like `data-client`, and `client` is declared in `ChatDataTypes`. |
| 2 | `src/app/(home)/about/_components/feed/event.tsx` (PullRequestEvent) | bug | Every PR event read "Merged". Wording now follows `payload.action` and `pull_request.merged`: Opened, Reopened, Merged, Closed, otherwise Updated. Caveat found by the verifier: GitHub's public Events API sends `pull_request` without `merged` (and without title/user), so a merged PR also reads "Closed"; "Merged" appears only if a payload ever carries `merged: true`. Telling merged from closed needs an extra API call (owner decision). |
| 3 | `src/app/(home)/guestbook/actions/utils/moderation.ts` | bug | The signature instruction was appended to the visitor's message after `. `. It is now its own text part, sent only when a signature is attached. |
| 4 | `src/app/(auth)/account/actions/revoke-session.ts` | inconsistent | Hand-composed `actionClient.use(userMiddleware)` skipped BotID; now `userActionClient` from `@/lib/safe-action`. |
| 5 | `scripts/lint.ts` | stale-route | Route key `(home)/(blog)/blog/[slug]` -> `(home)/blog/[slug]`, and `(home)/blog/tags/[tag]` populated from `getTags()`. `check:links` goes from 2 fallbacks to 0, 32 URLs collected. |
| 6 | `scripts/link-previews/utils.ts` | bug | Exclusion used `hostname.includes(d)`; now `hostname === d \|\| hostname.endsWith('.' + d)`. |
| 7 | `src/lib/auth-client.ts` | type erasure | Dropped the `ReturnType<typeof createAuthClient>` annotations on `authClient` and `signIn`/`signOut`/`useSession`; plugin types (admin, multiSession, inferAdditionalFields) are inferred again. tsc is clean. |
| 8 | `src/server/comments/moderation.ts` | dead code | Removed the unreachable `if (!output)` (`result.output` throws `NoOutputGeneratedError`, default-generate-text-result.ts:122); that error already lands in the existing catch. |
| 9 | `src/components/features/search/results.tsx` | bug | Tag `other` was labelled "Projects" with the work icon. Heading and icon now come from a `tagMeta` record; unknown tags read "Pages" with the page icon. |
| 10 | `src/components/layout/header/theme-toggle.tsx` | error handling | A non-AbortError no longer rethrows (unhandled rejection from the click handler); it falls back to `update()`. AbortError is still ignored. |
| 11 | `src/lib/github-contributions.ts`, `feed/data.ts` | swallowed error | Failures were cached ([] for 24h and 5 min). The cached functions now throw on failure and a thin wrapper (`getGitHubContributions`, `getActivityItems`) catches and returns [], so a failure is not cached. Success cache times unchanged. The activity failure is now logged. |

Checks: `tsc --noEmit` clean, `bun run check` clean, `bun run check:links` 0 errors / 0 fallbacks, `/`, `/about`, `/blog`, `/guestbook`, `/account`, `/projects` return 200 on :3111. Uncommitted.

# Round 1: resolve pass

Per-scope logs, merged verbatim. Skipped and declined annotations stay in the code with their reason listed.

## src/app

# Slopradar resolutions: `src/app`

Paths are relative to `src/app`. Line numbers are the line of the `TODO(slopradar)` comment before this round. Band 1 (bugs) was resolved in Round 1 of `SLOPRADAR-RESOLUTIONS.md`.

## Band 2: dead fallbacks and redundant config

| # | file:line | rule | what changed |
|---|-----------|------|--------------|
| 1 | (home)/blog/[slug]/page.tsx:32 | redundant-conversion | `lastModified` and `date` are already `Date` (`.source` types, `dateSchema`). Dropped the `new Date` wrappers in the page and in `generateMetadata` (`(lastModified ?? date).toISOString()`); same in `projects/[slug]/page.tsx` `generateMetadata`. |
| 2 | (home)/blog/[slug]/page.tsx:39 | dead-fallback | `author` is `z.string()` in the blog schema. Dropped `?? 'Unknown'` and `?? owner` (and the now unused `owner` import). |
| 3 | (home)/blog/[slug]/page.tsx:59 | dead-fallback | `title` is required by `pageSchema` (fumadocs-core `source/schema.js`). Dropped both `?? 'Untitled'`. |
| 4 | (home)/projects/[slug]/page.tsx:58 | dead-fallback | Dropped `?? 'Project cover image'` and `?? 'Untitled'`. |
| 5 | (home)/blog/[slug]/_components/header.tsx:38 | dead-fallback | Dropped `?? 'Blog cover image'` and `?? 'Untitled'`. |
| 6 | (llms)/utils/site-pages.ts:63 | dead-fallback | Dropped both `?? 'Untitled'`. |
| 7 | api/page-preview/route.ts:24 | dead-fallback | Dropped `?? 'Untitled'`. |
| 8 | og/_lib/route.tsx:44 | dead-fallback | `title={page.data.title}`. |
| 9 | api/search/route.ts:6 | duplicate-logic, dead-fallback | One `toIndex(tag)` mapper over posts and work pages, typed `BlogPage \| WorkPage`; the two `?? 'Untitled'` are gone. Same rows, same order. (`getPageEntries` lacks `structuredData`, so it could not be reused as is.) |
| 10 | api/chat/utils/tools/search-docs.ts:23 | redundant-check | `getText` is on the page type (`includeProcessedMarkdown`); dropped the guard, the `null` returns and the null filtering. |
| 11 | api/chat/utils/tools/search-docs.ts:34 | unchecked-cast, dead-fallback | `as CustomDocument` -> `satisfies CustomDocument` (x2), dropped `?? 'Untitled'` (x2). |
| 12 | api/chat/utils/tools/search-docs.ts:70 | duplicate-logic | `z.union` of literals -> `z.enum(['all', 'blog', 'projects'])`. The reuse in `tools/index.ts` is part of the skipped tool-typing item below. |
| 13 | api/chat/utils/tools/search-docs.ts:91 | unchecked-cast | Dropped the `raw as Array<{ doc }>` and `as Record<string, string>` casts: `searchAsync({ enrich: true, merge: true })` now infers `MergedDocumentSearchResults<CustomDocument>`; the loop skips a missing `doc`, which `store: true` never produces. Return value unchanged. |
| 14 | api/chat/utils/tools/search-docs.ts:115 | dead-code | Dropped the never-read `locale` input. |
| 15 | (home)/guestbook/actions/guestbook.ts:30 | dead-fallback | `users.name` is `notNull` and better-auth types it `string`; inserts `user.name` directly. |
| 16 | (home)/guestbook/_components/form.tsx:100 | redundant-check | `isPending` already returned above, so `!(user \|\| isPending)` -> `!user`; `user` is narrowed, so `Posting as {user?.name ?? 'Guest'}` -> `{user.name}` (the form.tsx half of #15). |
| 17 | (home)/guestbook/_components/form.tsx:64 | redundant-reset | Kept `form.reset` (form state lives above the keyed `<form>`) and the key remount (it recreates `SignaturePad`, canvas and history included); dropped `signaturePad.current?.clear()`, the ref and the `SignaturePadHandle` import. |
| 18 | (llms)/colophon.md/route.ts:4, (llms)/contact.md/route.ts:4 | redundant-config | `revalidate = false` is the default (`caching-without-cache-components.md`, route segment config). Dropped at all 10 sites: colophon, contact, experience, skills, testimonials, uses, llms.txt, blog.mdx, work.mdx, blog/rss.xml. `dynamic = 'force-static'` kept. |
| 19 | api/chat/route.ts:163 | redundant-config | Dropped `toolChoice: 'auto'`; `prepareToolChoice` maps `undefined` to `{ type: 'auto' }` (ai `dist/index.js`). |
| 20 | (home)/blog/_components/newsletter-form.tsx:39, (home)/contact/_components/contact-form.tsx:52 | redundant-config | Dropped `errorMapProps: {}` in the three forms (guestbook too); the adapter only reads `props?.joinBy`. |
| 21 | (home)/colophon/page.tsx:72, (home)/uses/page.tsx:20, (auth)/account/page.tsx:12 | inconsistent, unnecessary-async | Static `generateMetadata` -> `export const metadata: Metadata = createMetadata(...)` on colophon, uses, account and resume. `createMetadata` is pure. |
| 22 | (home)/blog/page.tsx:59 | dead-code | Dropped the unused `_parent: ResolvingMetadata` (blog, blog/tags/[tag], projects). |
| 23 | (home)/blog/page.tsx:70 | redundant-check | `parsePageParam` maps a missing param to 1 and `''` to 0 (404 above), so `\|\| !searchParams.page` was dead (x3); `isFirstPage ? 1 : pageIndex` collapsed to `pageIndex` for the same reason. |
| 24 | (home)/blog/page.tsx:52 | duplicate-type | One `Props` for `Page` and `generateMetadata` (blog and projects). |
| 25 | (home)/page.tsx:25 | unnecessary-async | `Home` awaits nothing; dropped `async`. |
| 26 | (auth)/account/_components/account-settings.tsx:87 | redundant | `zodResolver` (non-raw) hands `onSubmit` the parsed values and `AccountSchema` trims; dropped `.trim()`. |
| 27 | (home)/blog/[slug]/page.tsx:129, (home)/projects/[slug]/page.tsx:162 | duplicate-logic | OpenGraph `url` -> `page.url` (the loaders' `baseUrl` is `/blog` and `/projects`, so the string is identical). |
| 28 | og/_lib/template.tsx:150 | magic-string | `'#ffffff'` -> `colors.white`, added to the token map. |

## Band 3: owned types instead of local mirrors

| # | file:line | rule | what changed |
|---|-----------|------|--------------|
| 29 | sitemap.ts:6 | duplicate-type | Local `Page` interface -> `type Page = BlogPage \| WorkPage` from `@/lib/source`. |
| 30 | og/_lib/route.tsx:6 | duplicate-type | `OgPage` (with optional title and date) -> `BlogPage \| WorkPage`. |
| 31 | (home)/_components/testimonials.tsx:16 | duplicate-type | Imports `Testimonial` from `@/types`. |
| 32 | layout.tsx:11 | pass-through | `baseUrl` now comes from its owner `@/lib/metadata` in every `src/app` file (layout, blog/[slug], rss.xml, resume, (llms)/utils/about.ts). The `@/constants` re-export itself is the constants scope's to delete. |

## Band 4: local cleanups (round 2)

Line numbers are the line of the `TODO(slopradar)` comment before this round.

| # | file:line | rule | what changed |
|---|-----------|------|--------------|
| 33 | (home)/contact/_components/contact-form.tsx:45 | dead-fallback | The action always returns `{ message, success: true }`; the toast and the success Alert now show `data.message` directly. The fallback copy lives only in `contact.ts`. |
| 34 | (home)/contact/_components/hero.tsx:34 | redundant-key | Dropped the `key` on the `render` anchor (the keyed `ViewAnimation` is the list item). |
| 35 | (home)/contact/actions/contact.ts:10 | comment-rule | Deleted the narrating comment above `sentAtFormat`. |
| 36 | (home)/colophon/page.tsx:45 | dead-code | Every colophon section has a title: dropped the title guard and the ternary delays (`baseDelay`, `baseDelay + 0.05`, same values). The uses page keeps its guard, since its first section has no title; no shared component was extracted for that reason. |
| 37 | (home)/colophon/_components/typography.tsx:16 | duplicate-logic | `colophonCardBorderClasses(index, columns = 3)`; Typography calls it with 2 columns, so the same classes apply (the lg classes only when 3). |
| 38 | (home)/about/_components/feed/event.tsx:47 | duplicate-logic | `EventDate` uses `formatDate`. It prints in UTC, the old call used the server's zone (identical on Vercel, which runs in UTC; only a non-UTC dev machine near midnight UTC differs). |
| 39 | (home)/about/_components/feed/event.tsx:288 | unclear-name | Component renamed `GitHubEventRow`; the import alias in `feed/index.tsx` is gone. |
| 40 | (home)/about/_components/feed/event.tsx:296 | redundant-check | Dropped the `isSupportedEvent` guard (data.ts already filters) and the unused import; the switch default still returns null. |
| 41 | (home)/uses/_components/software.tsx:39 | js-tosorted-immutable | `items.toSorted(...)`. |
| 42 | (home)/blog/rss.xml/route.ts:8 | library-exists | Dropped `escapeForXML`: `feed` sanitizes URLs itself (`sanitizeUrl`). Verified the served RSS is byte-identical before and after. |
| 43 | (home)/blog/rss.xml/route.ts:50 | commented-out-code | Deleted the commented-out author link. |
| 44 | (home)/blog/actions/newsletter.ts:35 | redundant-check | `splitName(session?.user.name)` once; `splitName` returns `firstName ?? ''` so the empty-name result is unchanged. |
| 45 | (home)/blog/[slug]/page.client.tsx:91 | env-access | `!isProduction` from `@/constants` (a shared env value, already used by client-side components). |
| 46 | (home)/blog/[slug]/_components/header.tsx:3 | bundle | `motion/react-client` `motion.div` -> `motion/react-m` `m.div` under the existing `LazyMotion`. Checked in the browser: the same SSR `opacity:0` and the fade still ends at `opacity: 1`. |
| 47 | (home)/_components/portrait.tsx:65 | magic-string | `aria-label={\`Portrait of ${owner}\`}`; same string. |
| 48 | (home)/_components/writing.tsx:8 | magic-string | `href` reads `pages.blog.path`. The title ('Writing') and description are different copy from `pages.blog`, so they stay (changing them is visible). |
| 49 | (home)/guestbook/_components/entries.tsx:12 | derivable-prop | Dropped `isSignedIn` from the page, `GuestbookEntries` and the card; the card uses `!!currentUserId`. |
| 50 | (home)/guestbook/_components/entry-card/index.tsx:97 | cn-misuse | Plain `className` string; dropped the `cn` import. |
| 51 | (home)/_components/contributions.tsx:172 | unused-export | `ContributionsFallback` no longer exported. |
| 52 | api/comments/[...comment]/route.ts:6 | commented-out-code | Deleted the commented-out `role` option. |
| 53 | api/chat/utils/llms.ts:8 | unclear-name | `getLLMsTxt` -> `getAssistantContext` (one importer, the chat route). The file keeps its path. |
| 54 | api/link-preview/route.ts:3 | duplicate-logic | Both preview routes read `previewCacheControl` from the new `api/_lib/cache-control.ts`. Header value unchanged. |
| 55 | (auth)/account/_components/active-sessions.tsx:40 | duplicate-logic | `isPlatformType` guard over `Object.hasOwn(PLATFORM_ICONS, value)` replaces the hand-listed keys. |
| 56 | (auth)/account/_components/active-sessions.tsx:85 | js-tosorted-immutable | `sessions.toSorted(...)`. |
| 57 | (auth)/account/actions/revoke-session.ts:20 | swallowed-error | Removed the try/catch; `result.status` is checked directly. Unexpected throws now reach the safe-action handler, and the button's `getActionErrorMessage` fallback turns them into the same 'Failed to revoke session.' toast. |
| 58 | (auth)/account/_components/revoke-session-button.tsx:15 | inconsistent-error-handling | `getActionErrorMessage(error, 'Failed to revoke session.')`. |
| 59 | (llms)/utils/experience.ts:16, (llms)/utils/profile.ts:57 | magic-string | One `DEFAULT_EMPLOYMENT_TYPE = 'Research'` exported from `profile.ts`, used in both. |

## Skipped or declined (annotation left in place)

| file:line | reason |
|-----------|--------|
| layout.tsx:73 | Needs a typed component in `src/components/json-ld.tsx` (outside `src/app`). |
| layout.tsx:81 | `jobTitle` and `knowsAbout` are not in the constants; adding them is a constants-scope edit. |
| (home)/contact/_components/contact-form.tsx:141, (auth)/account/_components/account-settings.tsx:137 | Need exported limits in `src/lib/validators` (outside). |
| (home)/contact/actions/contact.ts:7 | Needs a `tsconfig` path alias (config). |
| (home)/contact/actions/contact.ts:15 | Declined: `timeZoneName: 'short'` prints `GMT+5:30` for `Asia/Kolkata` in en-US, not 'IST', so the email text would change. |
| (home)/about/_components/feed/data.ts:30 | Declined: Octokit types `payload` loosely; a typed payload map is the same casts moved, and a zod schema per event adds runtime validation. Needs its own change. |
| (home)/about/_components/feed/data.ts:60, (llms)/utils/index.ts:1 | Owner decisions 4 and 5. |
| (home)/uses/_components/logo.tsx:16, (home)/_components/testimonials.tsx:42 | `getInitials` belongs in `src/lib/utils` (outside). |
| (home)/_components/testimonials.tsx:64 | New dependency (`embla-carousel-autoplay`) and carousel is a standing exception. |
| (home)/blog/page.tsx:23, (home)/blog/tags/[tag]/page.tsx:22, (home)/blog/[slug]/page.tsx:94 | Need helpers in `src/lib` (outside). |
| (home)/uses/_components/software.tsx:17 | Needs a `globals.css` utility (outside). |
| (home)/blog/actions/newsletter.ts:67 | Declined: the rewrap is what gives the visitor 'Something went wrong while subscribing...'; an unhandled throw would show the generic unexpected-error text instead. |
| (home)/blog/_components/newsletter-form.tsx:34 | Declined: dropping the toast or the Alert is a visible change. |
| (home)/blog/[slug]/page.client.tsx:122, (home)/_components/portrait.tsx:20 | Move files into `src/components` (cross-scope). |
| (home)/blog/[slug]/_components/header.tsx:1 | Owner decision 6 (attribution). |
| (home)/blog/[slug]/_components/header.tsx:11 | Needs a long variant in `@/lib/format-date` (outside). |
| (home)/search/_components/search-client.tsx:126 | Declined: `useDocsSearch` owns the search state and has no initial value option, so the effect is the only way to seed it from `?q=`. |
| (home)/_components/portrait.tsx:144 | Declined: the `bonked` effect does not restart its timer on repeat bonks (the state does not change); an event-started timeout would need a guard to keep that timing. Animation-sensitive, left alone. |
| (home)/_components/hero.tsx:66 | Declined: `{first} <Chip /> {last}` makes SSR emit extra text nodes and comment markers, a DOM change. |
| (home)/guestbook/_components/entry-card/index.tsx:60 | Declined: disabling Save or dropping the 'No changes' toast is a visible change. |
| (home)/guestbook/actions/guestbook.ts:72 | The tag constant lives in `src/server/db/queries` (outside). |
| (resume)/resume/page.tsx:25, (llms)/utils/profile.ts:38 | `groupStack` belongs in `constants/portfolio/skills` (outside). |
| (resume)/resume/page.tsx:51 | Needs a flag in the socials data (constants). |
| (resume)/resume/layout.tsx:6 | Needs a shared token in `src/lib/theme-color` (outside). |
| api/chat/route.ts:51 | Needs a helper in `src/lib` (outside). |
| api/chat/route.ts:70 | Declined: `safeValidateUIMessages` is async and validates tool parts and data schemas, so it can reject conversations that pass today. Behaviour change. |
| api/chat/route.ts:163, api/chat/utils/tools/index.ts:7 | `src/lib/ai/chat/types.ts` imports the `tools` value for `ChatTools`; the factory needs that file edited (outside). |
| api/chat/utils/tools/get-page-content.ts:20 | Declined: changes the text the model reads (visible in assistant answers). |
| api/chat/utils/tools/get-page-content.ts:24 | The alias lives in `navigate.ts` and `next.config.ts` redirects; one place means editing config. |
| api/chat/utils/tools/search-docs.ts:7 | Declined: swapping the search engine can change which pages the assistant finds. |
| (auth)/layout.tsx:7 | Needs a `SiteShell` option in `src/components`. |
| (llms)/utils/contact.ts:5, experience.ts:5, skills.ts:4, uses.ts:15, colophon.ts:8 | Shared copy constants live in `src/constants` and the page components; colophon also changes the (llms) text (owner decision 16). |
| (llms)/utils/content-index.ts:13 | Declined: unifying the fallback changes (llms) text for pages without a description. |
| (llms)/utils/site-pages.ts:17 | Needs ids exported from four section components in `(home)`; larger cross-file change. |
| (llms)/utils/github-commits.ts:1 | Moves `feed/data.ts` to `src/lib` (outside). |
| (llms)/utils/profile.ts:10 | Needs exports from `@/lib/employment-period` (outside). |
| (llms)/utils/create-llm-route.ts:24 | Declined: adding a charset changes the response header on the `.mdx` routes. |

Verification: `bunx tsc --noEmit` and `bun run check` clean; `/`, `/blog`, `/blog/vscode-setup`, `/contact`, `/colophon`, `/uses`, `/about`, `/guestbook`, `/account`, `/resume`, `/projects`, `/search`, `/llms.txt`, `/blog/rss.xml` and `/api/page-preview` return 200 on localhost:3111.

## src/components

# Slopradar resolutions: `src/components` (except `ui/`)

Phase 3 for the components scope, worked band by band in the order of section 5 of the scope report. Line numbers are the lines of the `TODO(slopradar)` comment before this pass. Every resolved row is behaviour-preserving: the server-rendered HTML of `/`, `/about`, `/blog`, `/blog/hello-world`, `/blog/gorkie-sandboxes`, `/blog/tags/intro`, `/projects`, `/projects/portfolio`, `/contact`, `/guestbook`, `/uses`, `/colophon`, `/search`, `/account` and a 404 was captured on :3111 before the first edit and diffed (scripts and generated ids stripped) after each band; the JSON-LD blocks were compared byte for byte.

## Band 1: orphans and dead flexibility

| File:line | Rule | What changed |
| --- | --- | --- |
| `features/blog/post-card.tsx:13` | orphan | Deleted `post-card.tsx` and its line in `features/blog/index.ts` (the barrel still exports `TagCard`, which `blog/[slug]/_components/header.tsx` imports). |
| `content/mdx/layout.tsx:57` | orphan | Deleted `MdxLayout`, `MdxLayoutProps` and the `Section`/`SectionBody` imports only it used. |
| `icons/utils.ts:7` | orphan-export | Deleted the `Icon` type alias and its re-export from `icons.tsx`. |
| `content/mdx/components.tsx:33` | duplicate-alias | Dropped the `GitHubRepo` registration and the `export { GithubRepo as GitHubRepo }` alias; `content/` only uses `<GithubRepo`. |
| `smooth-cursor.tsx:13` | dead-props | Removed `SmoothCursorProps` (`cursor`, `cursorType`, `disableRotation`, `disableSmooth`), `SNAPPY_SPRING` and the `'pointer'`/rotation branches; `SmoothCursor` takes no props, as its only caller renders it. |
| `smooth-cursor.tsx:155` | cn-rule | The inner ring's template literal became a plain string (its only conditional was the dead rotation class) and the outer `m.div` uses `cn()`; the resulting class strings were checked equal for both `visible` states. |
| `copy-button.tsx:10` | dead-props | Dropped `doneIcon`/`errorIcon`/`idleIcon`; the icon map is a module constant. Renamed the file to `copy-state-icon.tsx` to match its export (only `page-actions.tsx` imports it). |
| `copy-button.tsx:28` | no-comments | Deleted the false React Compiler comment with the fallbacks. |
| `features/auth/user-button.tsx:23` | dead-api | Removed `UserButtonClassNames` and the `classNames` prop and every `classNames?.…` merge; `className` stays. Props interfaces are no longer exported (nothing imported them). |
| `features/auth/user-avatar.tsx:8` | dead-api | Removed `UserAvatarClassNames` and the `classNames` prop. |
| `json-ld.tsx:117` | dead-prop | Dropped `breadcrumbs` from `PageJsonLdProps` and the `extraCrumbs ??` branch. |
| `numbered-pagination.tsx:58` | dead-prop | Dropped `paginationItemsToDisplay`; `itemsToDisplay: 5` is inline. |
| `features/blog/tag-card.tsx:8` | dead-prop | Dropped `displayCount`, the per-card `getPostsByTag` lookup, the count span and the `className = ''` default. |
| `layout/sections/header.tsx:15` | dead-props | Dropped `titleClassName` and `descriptionClassName`. |
| `layout/sections/header.tsx:10` | redundant-type | `description` and `title` are `ReactNode`; same for `caption`, `description` and `title` in `sections/hero.tsx`. |
| `layout/sections/header.tsx:62` | redundant-key | Dropped the manual key derivation and its comment; `Children.map` keys each element from the child's own key. `toArray` and the truthiness guard stay so the stagger index and the skipped `''`/`0` children are unchanged. |
| `layout/lenis.tsx:13` | dead-config | `Lenis` takes no props; `root` and the options (`anchors`, `autoRaf: false`, `lerp: 0.18`, `prevent`) are inline. |
| `layout/wrapper.tsx:9` | dead-config | Dropped the `lenis` prop and its union; `Wrapper` renders `<Lenis />`. |
| `layout/footer/active-link.tsx:9` | duplicate-type | Props are `ComponentProps<typeof Link> & { href: string }`; dropped `nested` and pass `false` to `isActive` (whose default is `true`), as before. |
| `layout/footer/links.tsx:18` | dead-fields | Dropped `ListItem.external`/`href` and the dead `<Link>` title branch; the title renders as `<p>` as it always did. |
| `features/assistant/tools/contact-form.tsx:68` | dead-config | Deleted `errorMapProps: {}`; the adapter only reads `errorMapProps?.joinBy`. |
| `page-actions.tsx:70` | unused-export | `LLMCopyButton` and `ViewOptions` are no longer exported. |
| `page-actions.tsx:110` | dead-alias | Inlined `fullMarkdownUrl`. |

## Band 2: small fixes (second pass)

| File:line | Rule | What changed |
| --- | --- | --- |
| `tailwind-indicator.tsx:2` | env-rule | Reads `isProduction` from `@/constants` instead of `process.env.NODE_ENV`. |
| `ui-sounds.tsx:31` | duplication | One `afterClickHandlers` helper and a named `CLICK_SETTLE_DELAY` (16 ms) replace the two `setTimeout(..., 16)` blocks; the "read it a tick later" comment lives once, in the helper. |
| `layout/footer/clock.tsx:33` | magic-string | `timeZone: profile.timeZone` (same `'Asia/Kolkata'`). |
| `preview-link.tsx:28` | unchecked-cast | `createJsonFetcher<T>()` gives each endpoint its own typed cache; the `request as Promise<T \| null>` cast is gone (one `response.json() as Promise<T>` remains at the fetch boundary). |
| `layout/sections/split.tsx:98` | over-abstraction | `SplitSectionContent` uses `cn(inset && 'px-6 py-8', className)`; the one-variant cva is gone. The sidebar cva stays: it has two variants (`background`, `inset`). |
| `features/not-found/not-found-content.tsx:9` | no-comments | Deleted the PR #108 provenance comment. |
| `layout/header/index.tsx:68` | dead-code | `renderNavTitle` only renders string titles (`baseOptions.nav.title` is a string in both callers); the function branch and the `title as ReactNode` branch are removed. Output is identical. |
| `features/search/results.tsx:15` | weak-type | `rehypeCustomElements` is typed with hast `Root`/`Element` and `visit(tree, 'element', ...)`. |
| `features/search/results.tsx:73` | duplication | The `mark`/`p` component map is one hoisted `markdownComponents` constant (same JSX, used twice). |
| `ai-elements/markdown.tsx:115` | unbounded-cache | The text cache is capped at 200 entries (oldest evicted, hits refreshed); the current text is always the newest entry, so rendering is unchanged. |
| `content/mdx/github-code.tsx:83` | env-rule | `!isProduction` instead of `process.env.NODE_ENV !== 'production'`. |
| `content/mdx/github-repo.tsx:107` | duplication | `repoLinkClassName` and `externalLinkProps` are shared by the fallback link and the hover-card trigger (identical class string, `rel`, `target`). Dropped the trigger's `aria-label`, which repeated its visible text (the accessible name is unchanged). |
| `icons/icons.tsx:144` | no-comments | Deleted the stale "mix the site had before" comment. |

## Skipped or declined (annotation left in place)

| File:line | Verdict | Reason |
| --- | --- | --- |
| `theme-provider.tsx:6` | skip, cross-scope | The fix edits `src/app/layout.tsx`. |
| `layout/sections/body.tsx:10` | skip, cross-scope | Three call sites are in `src/app`. |
| `blur-image.tsx:4` | skip, owner decision 6 | Attribution and `THIRD_PARTY_NOTICES.md`. |
| `blur-image.tsx:16` | skip, cross-scope | `lazy` is passed from `src/app` (projects, uses, blog header). |
| `inline-markdown.tsx:4` | decline | react-markdown wraps text in a `<p>` and parses `*`/`_`, so DOM and copy would change. |
| `guestbook-cue.tsx:19` | skip, cross-scope | Rendering it from the home page edits `src/app`, and moving the band changes where it sits relative to the footer. |
| `page-actions.tsx:21` | skip, cross-scope | Needs a `Promise<string>` overload in `src/hooks/use-copy-to-clipboard.ts`. |
| `page-actions.tsx:166` | skip | Unifying `rel` to `noopener noreferrer` changes what the browser sends (Referer) to ChatGPT, Claude and GitHub. |
| `search-redirect-input.tsx:51` | skip | `next/form` changes the DOM and no-JS behaviour. |
| `json-ld.tsx:152` | skip, cross-scope | Every page call site is in `src/app`. |
| `ui/dropdown-menu.tsx:109` | skip | `ui/` is excluded from this scope. |
| `layout/footer/index.tsx:41` | skip | One responsive set changes the DOM, and the order of the controls on mobile. |
| `layout/footer/sound-toggle.tsx:24` | skip | `<Button variant='outline' size='icon'>` has different classes (visible). |
| `layout/footer/clock.tsx:22` | skip | Theme tokens change the colours (visible). |
| `layout/footer/links.tsx:77` | skip, cross-scope | The data would move into `src/constants/navigation`. |
| `layout/header/mobile/index.tsx:99` | skip, owner decision 8 | Mobile menu focus trap. |
| `layout/header/index.tsx:37`, `features/toc/popover.tsx:15` | skip, owner decision 6 | Attribution. |
| `layout/header/index.tsx:160` | skip, cross-scope | The slots are removed by changing the two `Header` callers in `src/app` (`site-shell` is in scope, `(auth)/layout.tsx` is not). |
| `layout/header/index.tsx:263`, `features/toc/popover.tsx:37` | decline | The three dismissals differ: `pointerdown` plus Escape on the header, `click` on `window` in the TOC popover, capture-phase `click` with `preventDefault` plus a desktop media query in the mobile menu. One hook would change behaviour. |
| `layout/header/index.tsx:499` | skip | A `mobile` variant in `navItemVariants` changes the class strings. |
| `layout/header/mobile/pill.tsx:18` | skip, cross-scope | Needs `src/constants/navigation`, whose labels and icons differ from the pill's. |
| `layout/header/mobile/pill.tsx:41` | skip | Sharing a class constant across pill, toggle and `item.tsx` reorders the class strings. |
| `features/contributions.tsx:3`, `:353` | skip, owner decision 7 | Registry component placement. |
| `features/assistant/input.tsx:58` | decline | `useLocalStorage` JSON-serialises and would not read the existing raw `simba:draft` strings, and it changes SSR hydration. |
| `features/assistant/input.tsx:206` | skip | A hit-area pseudo-element adds classes to the button (visible/behavioural change). |
| `features/assistant/mascot/constants.ts:35` | decline | The `Record<PoseName, Pose>` / `Record<AnimationName, Frame[]>` annotations widen the `satisfies` literals so consumers can narrow the `Pose` union; the second name carries the type. |
| `features/assistant/text-selection-popup.tsx:75` | skip | Base UI Popover with a virtual anchor changes focus and dismissal behaviour; owner call. |
| `features/not-found/simba-loop.tsx:30` | decline | `SimbaController` has no loop-with-pause and shows the rest pose, not frame 0, under reduced motion. |
| `features/assistant/tools/contact-form.tsx:6`, `features/blog/author-byline.tsx:1`, `content/mdx/layout.tsx:2`, `:11` | skip, cross-scope | The layering band moves code out of `src/app`. |
| `features/assistant/tools/navigate.tsx:44` | decline | The refs feed a 10 s poll that has to read the live Lenis instance; `scrollToTarget` is already shared with the search dialog, and replacing the poll changes scroll timing. |
| `features/work/experience-timeline.tsx:152` | skip | Omitting the label is visible; requiring the field edits `src/types`. |
| `content/mdx/heading.tsx:9` | skip | fumadocs-ui `Heading` renders a different anchor and icon (visible). |
| `content/mdx/github-code.tsx:28` | skip | `buttonVariants` has different classes (visible). |
| `ai-elements/tool.tsx:37` | skip | Status tokens change the colours (visible). |
| `icons/brands/claude.tsx:4`, `github.tsx:6`, `github.tsx:8` | skip | The eight brand files differ in `focusable`, `preserveAspectRatio`, fill and path count, so a shared factory or the `aria-hidden` check changes the SVG attributes; the Font Awesome `data-*` attributes are DOM attributes. |

## Checks after this pass

`bunx tsc --noEmit` is clean. `bun run check` reports two format errors, both in `src/app` (`about/_components/feed/event.tsx`, `guestbook/_components/entry-card/index.tsx`), files other agents are editing. `src/components` is clean. `/`, `/about`, `/blog`, `/blog/hello-world`, `/projects`, `/contact`, `/guestbook`, `/uses`, `/colophon` and `/search` return 200 on :3111 and a bad path returns 404.

## src/lib, src/server, src/hooks, src/contexts, src/constants, src/types, src/env.ts, src/styles

# Slopradar resolutions: `src/lib, src/server, src/hooks, src/contexts, src/constants, src/types, src/env.ts, src/styles`

Phase 3, worked band by band in the order of the scope report's structural verdict. Line numbers are the current lines after the change (the annotation lines no longer exist). 53 annotations resolved, 14 skipped, 2 declined (left in place). Not committed.

## Band 1: dead code

| File:line | Rule | What changed |
|---|---|---|
| `src/lib/ai/chat/confirmation.ts:3` | unused export | Deleted `ToolName` (no importers; equals `keyof ChatTools`). |
| `src/lib/source/blog.ts:11` | unused export | Deleted `Post`. |
| `src/lib/validators/comments.ts:21` | unused exports | Deleted `CommentImageContent`, `CommentMentionContent`. |
| `src/lib/validators/guestbook.ts` (end) | unused exports | Deleted `GuestbookEntry`, `GuestbookReaction`, `GuestbookEdit`, `GuestbookDelete`, `GuestbookBanUser`, `GuestbookModerationResult` (grepped `src emails scripts`, including the `@/lib/validators` barrel). |
| `src/lib/validators/newsletter.ts:6` | unused export | Deleted `Newsletter`. |
| `src/lib/validators/session.ts:6` | unused export | Deleted `RevokeSession`. |
| `src/lib/link-preview.ts:6` | unused export | Deleted the type re-export; all importers read `link-preview.shared`. |
| `src/lib/link-preview.ts:21` | redundant guard | Dropped `existsSync`; a missing file (ENOENT) still returns null in the catch. |
| `src/lib/safe-action/index.ts:4` | unused re-exports | Dropped the middleware and `ActionContext` re-exports; `ActionError`/`actionClient` and the three clients stay. |
| `src/lib/ai/prompts/moderation/index.ts:5` | dead code | Dropped `.filter(Boolean)` and the outer `.trim()`; all three parts are already trimmed, so the string is byte-identical. |
| `src/lib/ai/prompts/chat/index.ts:24` | dead code | Dropped `.filter(Boolean)` and the outer `.trim()`; added `.trim()` to `core.ts`, `directives.ts`, `tools.ts` like the other parts. The system prompt now has a uniform blank line between parts (was two blank lines after core, directives and tools). |
| `src/lib/github-code.ts:38` | redundant checks | Dropped both `Number.isNaN` guards (the regex captures `\d+` only). |
| `src/lib/source/pages.ts:11` | dead fallback + duplication | Dropped `?? 'Untitled'` x2 (tsc confirms `title` is `string`) and replaced the two identical map blocks with one `toPageEntry(tag)` helper; entry key order unchanged. |
| `src/server/db/queries/guestbook.ts:67` | redundant fallback | `row.signature ?? null` -> `row.signature`. |
| `src/server/db/queries/guestbook.ts:137` | verbose | `deleted.length > 0 ? deleted[0] : null` -> `deleted[0] ?? null`. |
| `src/styles/globals.css:392` | dead rule | Deleted `.dark ::selection` (identical declarations; no other `::selection` rule in our CSS or the imported presets). |

## Band 2: comments

| File:line | Rule | What changed |
|---|---|---|
| `src/env.ts:6` | no-comments | Deleted the remaining `// App` banner (the other banners were already gone). |
| `src/lib/validators/guestbook.ts:1` | no-comments | Deleted the remaining `// Input schemas` banner. |
| `src/lib/employment-period.ts:20` | no-comments | Deleted the narrating comment. |
| `src/styles/globals.css` (`@theme`) | no-comments | Deleted `/* fonts */`. |
| `src/lib/og.ts:81` | comment placement | Moved the output-file-tracing comment directly above `FONT_FILES`. |

## Band 3: moderation

| File:line | Rule | What changed |
|---|---|---|
| `src/server/comments/moderation.ts:74` | ai-sdk | Single text part now goes through `prompt:`; dropped the `UserContent` array, the `messages` wrapper and the `UserContent` import. Same user text. |
| `src/lib/validators/moderation.ts:3` (was `validators/guestbook.ts:39`) | misplaced | Moved `ModerationResultSchema` to its own `validators/moderation.ts`, re-exported from the `validators/index.ts` barrel, so both importers (`@/lib/validators`) keep working unchanged. The shared `moderate()` helper is not done (see skipped). |

## Band 5: one owner per fact

| File:line | Rule | What changed |
|---|---|---|
| `src/server/db/schema/table.ts:3`, `auth.ts:2`, `comments.ts:11`, `guestbook.ts:11` | duplication (x2 annotations) | One `createTable` in `schema/table.ts` (not re-exported from `schema/index.ts`). Verified by dumping every table, column, index, PK and FK name before and after: identical. No migration. |
| `src/server/db/index.ts:9` | dead config | Dropped `casing: 'snake_case'`. Verified every column in the schema has an explicit name (`keyAsName` false for all), so runtime casing never applied. |
| `src/constants/site.ts:7`, `src/lib/metadata.ts:89`, `src/constants/navigation/social.tsx:17` | magic string | Added `xHandle`; the Twitter `creator` and the X social URL derive from it. Output strings identical. The link-preview scanner's regex no longer sees the X URL in `social.tsx`, but `x.com` is excluded from previews and absent from the manifest, so nothing changes. |
| `src/constants/config/github.ts:3`, `src/lib/get-llm-text.ts:35` | magic string | Added `githubBranch = 'main'`, used in the llms Source URL. `src/app/(home)/blog/[slug]/page.tsx:52` still hard-codes `main` (app scope). |
| `src/lib/get-llm-text.ts:7` | dead option | `{ page: '#', section: '##' }` record, `level` typed as its keys, switch and `'subsection'` removed. Callers only pass `'section'`. |
| `src/types/themed-image.ts:1`, `src/types/skill.ts:6`, `src/types/uses.ts:3` | duplicate type | One `ThemedImage` type, used by `TechStackItem['icon']` and `SoftwareItem['logo']`; exported from the `@/types` barrel. `Logo` stays as an alias of it because `src/app/(home)/uses/_components/logo.tsx` imports `Logo` (app scope can switch to `ThemedImage` and then the alias goes). |
| `src/constants/search.tsx:14` | duplication | Page command titles and URLs come from `pages.<key>.title/path` (Experience uses `${pages.about.path}#experience`). Strings identical. |
| `src/constants/search.tsx` (`commandKinds`) | unclear mapping | `Record<CommandItem['kind'], CommandKind>` lookup replaces let-and-overwrite. The map is still keyed by title because `src/components/features/search/footer.tsx` reads it by `state.value` (components scope). |
| `src/lib/resend.ts:3` | two import paths (partial) | The only in-scope `@/constants` importer of `baseUrl` now imports from `@/lib/metadata`. Annotation left in place (see skipped). |

## Band 6: types

| File:line | Rule | What changed |
|---|---|---|
| `src/env.ts:6` | redundant assertion | `z.url().min(1)` -> `z.url()` (checked: `z.url()` rejects `''`). |
| `src/lib/ai/providers.ts:18` | duplicate type | `onError` typed with ai-retry's `ModelRetryContext<LanguageModel>`. |
| `src/lib/toast.ts:7` | redundant assertion + duplication (x2 annotations) | Dropped `as SonnerToast`; the three branches are one `variantSounds` record lookup behind an `isVariant` guard. The variant method is read when the property is accessed, not when it is called; sonner's methods are arrow-function fields, so this is equivalent. |
| `src/lib/link-preview.shared.ts:34`, `src/lib/link-preview.ts:21` | unchecked cast | The manifest goes through `linkPreviewManifestSchema` (in `link-preview.shared.ts`, `satisfies z.ZodType<LinkPreviewManifest>`). The current manifest parses (159 entries). A missing file still returns null without a log; a malformed file now logs `console.error` and returns null. It does not throw, so visitors see the same result as before. |
| `src/lib/validators/guestbook.ts:37` | type-only schema | `GuestbookReactionItemSchema`/`GuestbookEntryItemSchema` (never parsed, never imported) became plain `GuestbookReactionItem`/`GuestbookEntryItem` interfaces with the same names and shape. |
| `src/lib/github-code.ts:24` | duplicate type | `parseLineRange` returns `ParsedGitHubFileUrl['lineRange']`. |

## Band 7: error handling

| File:line | Rule | What changed |
|---|---|---|
| `src/lib/og.ts:27`, `:107` | swallowed error (x2 annotations) | Both catches log the error (`console.error`) and still return null, so OG output is unchanged. |
| `src/lib/og.ts:12` | magic string | The root `<svg ...>` tag is replaced by pattern (`SVG_OPEN_TAG`) instead of matching the exact `width/height/viewBox` string. Verified the generated portrait data URL is byte-identical before and after. |
| `src/lib/resend.ts:33` | bad error message | Branches on `error` first (not_found -> null); missing `data` without an error now throws `Resend returned no data.` instead of `undefined`. |
| `src/lib/validators/contact.ts:16` | duplicated literal | Message interpolates `CONTACT_MESSAGE_MAX_LENGTH.toLocaleString('en-US')`; verified it still reads "Message must be under 5,000 characters." |

## Band 9: renames

| File:line | Rule | What changed |
|---|---|---|
| `src/hooks/use-mobile.ts`, `src/hooks/use-theme-shortcut.ts` | wrong extension | Renamed from `.tsx` (no JSX); importers use extensionless paths. `experiences.tsx` and `skills.tsx` stay `.tsx` (see skipped). |
| `src/constants/portfolio/skills.tsx:4` | unclear names | `s`/`t` -> `stackIcon`/`themedStackIcon`. |
| `src/constants/portfolio/skills.tsx:165` | spread in accumulator | Push into the existing group array. |
| `src/constants/portfolio/uses.ts:3` | unclear names | `hw`/`sw`/`swt` -> `hardwareImage`/`softwareLogo`/`themedSoftwareLogo`. Verified `technologies`, `groupTechnologies()` and every `uses` export serialize byte-identically before and after. |

## Band 10: CSS

| File:line | Rule | What changed |
|---|---|---|
| `src/styles/globals.css:78` | fragmented layer | The three `@layer base` blocks are merged into the first, in their original order. Only unlayered rules and `@theme` blocks sat between them, and neither depends on source order relative to `base`. |
| `src/styles/simba.css:1` | magic numbers | `--simba-base-origin` / `--simba-head-origin` on `.simba-rig`; the 5 uses read them. All five elements are descendants of the `.simba-rig` svg (`mascot/rig.tsx`). |

## Band 8 and other server items

| File:line | Rule | What changed |
|---|---|---|
| `src/server/auth/index.ts:38`, `:43` | redundant async/await | Dropped the outer `await` in `listSessions` and `revokeSession`. `async` stays because `await headers()` is still needed. |
| `src/lib/files.ts:6` | magic number | `DATA_URL_PREFIX = 'data:'`, used for both the check and the slice. |
| `src/lib/source/blog.ts:32` | duplication | `getPostsByTag` = `getSortedByDatePosts().filter(...)` (same order, because `toSorted` is stable). |

## Skipped (annotation left in place)

| File:line | Rule | Reason |
|---|---|---|
| `src/lib/is-active.ts:8` | attribution | Owner decision 6 (attribution policy: in-file headers for code adapted from MIT deps). The JSDoc drop goes with the header. |
| `src/lib/metadata.ts:7` | fallback shaping | Owner decision 12 (`NEXT_PUBLIC_BASE_URL` required in production). |
| `src/lib/auth-client.ts:7` | inconsistent toast | Routing the 429 toast through `@/lib/toast` makes it play a sound, which visitors hear. That is a visitor-facing change, so it goes to the owner (decision 15 class). |
| `src/lib/ai/chat/types.ts:4` | layering | Cross-scope: moving the tools out of `src/app/api/chat`, or moving these types next to the route, crosses scopes (lead named it). |
| `src/lib/ai/chat/types.ts:18` | unclear name `MyUIMessage` | Cross-scope rename: the 9 importers are in `src/app` and `src/components`. Keeping both names would add a second name for one type. |
| `src/lib/ai/chat/types.ts:21` | misplaced `CustomDocument` | Cross-scope: the target is `src/app/api/chat/utils/tools/search-docs.ts`. |
| `src/lib/github-contributions.ts:5` | layering | Cross-scope: the fix is "lib exports the inferred `Activity`, the component imports it", and `src/components/features/contributions` has to change in the same step. Otherwise the type is duplicated and the `satisfies` link is lost. |
| `src/lib/reveal-script.ts:7` | duplicated selector | CSS cannot import a TS constant. The two single-source options are a data attribute on the first section (a `src/components`/`src/app` edit) or injecting the hidden-state CSS from the inline script (moves a render-critical rule out of the stylesheet and risks a flash before the script runs). Skipped as cross-scope or visitor-risk. |
| `src/lib/audio/preferences.ts:76` | two sound gates | Cross-scope: `SoundProvider` is in `src/app/provider.tsx` and `useSound` callers are in `src/app` and `src/components`. Picking one gate also changes when sounds play (the imperative path has its own `unlocked` gate), which visitors hear. |
| `src/server/comments/moderation.ts:66` | duplication with guestbook moderation | Cross-scope: the other copy is `src/app/(home)/guestbook/actions/utils/moderation.ts`. A shared `moderate()` with one in-scope caller would be premature. `ModerationResultSchema` is already in `validators/moderation.ts`, ready for it. |
| `src/server/db/queries/guestbook.ts:116` | boolean parameter | Cross-scope signature change: the caller is `src/app/(home)/guestbook/actions/guestbook.ts`. |
| `src/constants/portfolio/experiences.tsx:1` (and `skills.tsx`, from the x4 note) | wrong extension | `scripts/link-previews/config.ts:16-17` lists both files by their `.tsx` path, so renaming them would silently drop them from the link-preview scan. That needs a coordinated scripts edit. |
| `src/constants/index.ts:3` | two import paths for `baseUrl` | The remaining `@/constants` importers (`src/components/json-ld.tsx`, plus the app layout and rss per the note) are cross-scope. Every in-scope importer now uses `@/lib/metadata`; once the others move, delete the re-export. |
| `src/styles/globals.css:326` | shadowed `border-border` | Changing the token changes the light-mode border colour everywhere `--color-border` is read (`bg-dashed`, scrollbar thumb, `* { border-border }`). Renaming the utility needs every component call site changed. Both are visitor-visible or cross-scope. |

## Declined (annotation left in place, reason written)

| File:line | Rule | Why declined |
|---|---|---|
| `src/env.ts:36` | env default in caller | With `SKIP_ENV_VALIDATION`, `createEnv` returns the raw runtime env, so a zod `.default()` never applies. Moving the default into the schema would make `new URL(path, undefined)` throw and the contributions graph fall back to `[]` in skip-validation environments. The caller fallback is the one that always holds. |
| `src/hooks/use-reduced-motion.ts:10` | library exists | Motion's `useReducedMotion` (`framer-motion/dist/es/utils/reduced-motion/use-reduced-motion.mjs`) reads the preference once into `useState` and does not react to changes ("TODO See if people miss automatically updating"). It returns `null` on the server, so the first render animates. The local hook follows changes via `useSyncExternalStore` and uses `true` as the server snapshot. Renaming it to say so is an exported-symbol rename with 9 importers in `src/app`/`src/components`. |

## Notes for other scopes

- `scripts/link-previews/utils.ts:154` keeps its own copy of the manifest schema; it can import `linkPreviewManifestSchema` from `@/lib/link-preview.shared`.
- `src/app/(home)/blog/[slug]/page.tsx:52` can use `githubBranch` from `@/constants/config`.
- `src/app/(home)/uses/_components/logo.tsx` can import `ThemedImage`, after which `Logo` in `src/types/uses.ts` can be deleted.

Checks after the last band: `bunx tsc --noEmit` clean, `bun run check` clean (402 files, 0 errors). Earlier bands showed format errors only in `src/app` and `src/components` files edited by other agents; they cleared by the final run.

## emails, scripts, root config

# Slopradar resolutions: `emails/`, `scripts/`, root config

Line numbers are the `TODO(slopradar)` lines as they stood before this round (after the lead's round 1 fixes to `scripts/lint.ts` and `scripts/link-previews/utils.ts`).

## Band 1: link checker

| # | File | Rule | What changed |
|---|------|------|--------------|
| 1 | `scripts/lint.ts:1` | unclear-name | Renamed to `scripts/check-links.ts`; `check:links` in `package.json` points at it. No other reference to the old path outside `plans/reviews`. |
| 2 | `scripts/lint.ts:30` | duplication | The blog and projects `populate` entries share a `toParams(pages)` mapper; the two `await Promise.all` calls over plain objects are gone. `check:links` still reports 32 URLs, 0 fallbacks, 0 errors. |

## Band 2: link-preview correctness

| # | File | Rule | What changed |
|---|------|------|--------------|
| 3 | `scripts/link-previews/utils.ts:153` | swallowed-errors | `loadManifest` returns `null` only for `ENOENT`; any other read error, malformed JSON or a manifest that fails the new zod schema now throws, so `generate` can no longer rebuild from `{}` and overwrite it. The schemas live beside `loadManifest` (not in `src/lib/link-preview.shared.ts`, which is outside this scope) and are tied to the interfaces with `satisfies z.ZodType<LinkPreviewEntry>` / `<LinkPreviewManifest>`, so they cannot drift. The current manifest (159 entries) parses. |
| 4 | `scripts/link-previews/utils.ts:193` | floating-promise | The route handler returns `route.abort()` / `route.continue()`. |
| 5 | `scripts/link-previews/utils.ts:202` | swallowed-errors | The `networkidle` error is kept: if the `domcontentloaded` fallback also fails, the first error is what the entry records. The extra 3000 ms is `screenshot.waitAfterFallback` in config. One edge: a `goto` that resolves `null` without throwing no longer triggers the fallback; that only happens for same-document navigations, never on a fresh page. |

## Band 3: `next.config.ts`

Verified by loading the old and new config through Next's own `loadConfig` (dev and build phases) in a scratch copy of the project, then diffing the resolved values; only the intended keys changed. The dev server on :3111 reloaded itself once when the file was written (Next restarts on a config change; it was not killed or restarted by hand), and `/`, `/blog`, `/projects`, `/about` and `/blog/hello-world` return 200 on the new process.

| # | File | Rule | What changed |
|---|------|------|--------------|
| 6 | `next.config.ts:8` | platform-api | `jiti` and the dynamic import are gone; `import './src/env'` at the top. Next's legacy `next.config.ts` loader compiles it to `require('./src/env')` and its require hook transpiles `env.ts` (Node 24 can `require` the ESM-only `@t3-oss/env-nextjs`). Checked: with no env the new config fails with "Invalid environment variables" exactly like the old one, with `.env` it loads, and `SKIP_ENV_VALIDATION=true` still skips. `jiti` removed from `dependencies` with `bun remove`; it stays installed transitively (`@tailwindcss/node`, `react-doctor`), and `bun install --frozen-lockfile` reports no changes. |
| 7 | `next.config.ts:23` | dead-config | Removed `experimental.useTypeScriptCli` and its TS7 comment. `config-shared.js` defaults it to `true` and `useTypeScriptCli.md` says the CLI checker is the default; the resolved config still reports `true`. |
| 8 | `next.config.ts:31` | dead-config | `images.qualities` is `[75, 85]`. Only `IMAGE_QUALITY = 85` (`blur-image.tsx`, `work-card.tsx`) and the default 75 are requested in `src` and `content`. |
| 9 | `next.config.ts:33` | dead-config | Partly declined. Removed the `avatars.githubusercontent.com` and `fumadocs.dev` patterns: no `next/image` src uses them (user and testimonial avatars go through the Base UI `Avatar`, a plain `img`; the only remote image in `content` is on `raw.githubusercontent.com/techwithanirudh`). Kept `port: ''`, which is not the default: `match-remote-pattern.js` skips the port check only when `port` is undefined, so `''` limits the pattern to the default port and dropping it would let any port match. |
| 10 | `next.config.ts:80` | duplication | Removed the `/work` redirect. Next's `getPathMatch('/work/:path*')` matches `/work` with an empty `path` and `prepareDestination` gives `/projects`; on :3111 `/work` still answers 308 to `/projects` and `/work/gorkie` 308 to `/projects/gorkie`. |
| 11 | `next.config.ts:115` | dead-config | Declined. The built-in list (`next/dist/lib/server-external-packages.jsonc`) is only read by `build/webpack-config.js`. This app builds with Turbopack, and neither Next's JS nor the Turbopack binary (`next-swc.darwin-arm64.node`, byte search) contains that list, so nothing shows Turbopack would externalize `ts-morph`, `typescript` or `shiki` without these entries. Annotation removed, entries kept. |
| 12 | `next.config.ts:131` | undeclared-dependency | `framer-motion` declared as `14.2.0` (exact, the same version `motion@14.2.0` depends on per `bun.lock`) with `bun add --exact`. The alias comment stays. |
| 13 | `next.config.ts:151` | indirection | Without jiti nothing in the config is async, so `createNextConfig`, the `NextApp` wrapper and the reduce are gone: `export default withBotId(mdxPlugin(bundleAnalyzerPlugin(nextConfig)))`, the same order the reduce applied. The LAN `allowedDevOrigins` entries are kept as they were. |

## Band 4: emails, scripts, source.config

Checked by rendering `NewsletterWelcomeEmail` with its PreviewProps before and after and diffing the HTML.

| # | File | Rule | What changed |
|---|------|------|--------------|
| 14 | `emails/newsletter-welcome.tsx:21` | duplicate-types | `posts` is `(Pick<BlogPage['data'], 'title' \| 'description' \| 'image'> & { url: string })[]` (type-only import from `@/lib/source`, erased at compile). `sendWelcomeEmail` still type-checks. |
| 15 | `emails/newsletter-welcome.tsx:45` | a11y | The post image `alt` is the post title. The only HTML diff is the three `alt` values. |
| 16 | `emails/newsletter-welcome.tsx:152` | stale-fixture | PreviewProps use the three real posts in `content/blog` (`/blog/<slug>` URLs, their real images and descriptions). Deleted `public/images/blog/{pages,markdown-examples,using-mdx}.png`; nothing else referenced them. |
| 17 | `emails/contact-notification.tsx:69` | narration-comment | Deleted the comment and the line it annotated. |
| 18 | `source.config.ts:52` | library-exists | `transformerEscape` replaced by `transformerRemoveNotationEscape` from `@shikijs/transformers`, added with `bun add --exact` at shiki's version (4.5.0). The implementation and name string are identical to the removed copy. |

### Declined (annotation removed, reason)

| File | Rule | Why |
|------|------|-----|
| `emails/newsletter-welcome.tsx:40` | inconsistent-scale | Rendering shows scale classes emit `rem` (`1rem`, `1.5rem`) while the arbitrary classes emit `px`. Clients that ignore `rem` (Outlook) would lose the spacing, and the markup would change. The arbitrary values are kept on purpose. |
| `scripts/link-previews/utils.ts:140` | magic-string | `devices['Desktop Chrome']` is a Windows UA on a newer Chrome with extra context options, so sites could serve different pages and previews would change on regeneration (owner decision 15). Kept the explicit UA. |
| `scripts/generate-portrait.ts:11` | library-exists | `portrait.svg` has no `style`, `xlink` or multi-hyphen attributes, so the regexes are correct for the only input. `@svgr/core` and `svgo` would add two dependencies and rewrite the generated `src/.../portrait-face.tsx` (outside this scope). |
| `source.config.ts:14` | redundant-schema | Not equivalent: `z.coerce.date()` also accepts `null`, numbers and booleans, so an empty `date:` in frontmatter would silently become 1970. The string\|Date union is what rejects those. |

### Skipped (annotation left in place)

| File | Reason |
|------|--------|
| `emails/contact-notification.tsx:25` | Shared email palette and fonts change how emails look (owner decision 15). |
| `emails/newsletter-welcome.tsx:66` | Same: shared `emails/theme.ts` fonts. |
| `emails/newsletter-welcome.tsx:36` | Fix is in `src/lib/resend.ts` (outside scope, other agents edit `src/`). Once `image` is passed through, the placeholder fallback can go. |
| `next.config.ts:99` | Build gate, owner decision 1. |

## Verifier findings

- Bug 2 (PR wording): GitHub's public Events API omits `merged`, so merged PRs also read "Closed".
- Bug 4 (revoke-session): now has the BotID check like every other user action (behaviour change).
- `scripts/link-previews/config.ts`: frontmatter schema fields made independent again (`.catch(undefined)`), restoring the old per-field check.
- `scripts/link-previews/{generate,fix,types}.ts` were merged into `index.ts` and the `fix-previews` script removed (`--all` is now `--retry-failed`).
- `searchDocs` tool lost its unused `locale` input (the schema the model sees changed).
- Chat system prompt parts are separated by one blank line instead of two.

# Round 2 fixes

| File | Rule | What changed |
|------|------|--------------|
| `src/lib/resend.ts` | bug | Newsletter links were `https://host//blog/...` (baseUrl is a URL object); built with `url()`; a post without an image passes `undefined` so the template placeholder shows. Removes the `emails/newsletter-welcome.tsx` dead-fallback annotation too. |
| `src/lib/ai/prompts/chat/tools.ts`, `directives.ts` | stale-prompt | Removed the `locale` input from the searchDocs prompt; selected-context directive now describes the real `[Selected Context: {json}]` and `[Client Context: {json}]` blocks. |
| `src/components/features/auth/sign-in-modal.tsx` | swallowed-error | `signIn.social` resolves `{ error }` instead of throwing; the result is now checked, so buttons re-enable and a toast shows on an API failure. |
| `src/components/features/assistant/tools/contact-form.tsx` | wrong-icon | Canceled state shows `Icons.info` instead of the success check. |

# Perf pass (production build, Lighthouse mobile, 6 pages)

Before -> after: home 73 -> 73, about 74 -> 74, projects 80 -> 80, blog 80 -> 80, post 76 -> 76, contact 79 -> 79. Home page weight 1592 KB -> 1459 KB (others unchanged). LCP/FCP differences are within run noise.

Applied (behaviour-preserving):
- `public/images/testimonials/{1,2,3}.jpg`: were 400px/240px images (two were PNGs named .jpg, 77 KB, 46 KB, 21 KB) shown at 24px; replaced with 96x96 progressive JPEGs (2.7 KB, 2.5 KB, 3.7 KB), 4x the displayed size. Saves 133 KB on the home page. Originals are in the session scratchpad.

# Bug 2 follow-up: merged PRs read Merged

GitHub's public Events API omits `merged`, so `src/app/(home)/about/_components/feed/data.ts` now makes one extra request per feed fetch: `search.issuesAndPullRequests` with `is:pr is:merged author:<githubUser>` (100 newest by update), cached with the same 5 minute revalidate under its own key. Closed `PullRequestEvent`s whose `owner/repo#number` is in that set get `merged: true` and `event.tsx` reads "Merged"; otherwise "Closed". The search runs only when the feed contains a closed PR event, never per PR. On a search failure the error is logged, an empty set is used (so rows read "Closed") and, because the cached function throws, the failure is not cached.

Verification: tsc clean. In the current public events none of the 11 closed PR events (#97-#109) is merged (checked with `gh pr view`), so /about correctly shows "Closed" for #109 and "Opened" for #111; no merged PR is in the feed window to show "Merged" in the browser. The key format (`techwithanirudh/portfolio#95`) was checked to match between the events payload and the search results.

# Incident: source.config.ts export

During the Opus resolve round an agent exported a shared `workLinks` zod object from `source.config.ts`. fumadocs-mdx treats every export of that file as a collection and throws `Unknown export "workLinks", you can only export collections from source configuration file`, which put a Build Error on the dev server (content/blog/gorkie-sandboxes.mdx). Fixed within minutes: `source.config.ts` exports only `blog`, `work` and the default config, `github`/`website` use `z.url().optional()` inline, and the `scripts/link-previews/config.ts` duplicate-schema annotation was restored (skipped). Rule for all resolves: `source.config.ts` may only export collections.

# Incident: "Simba lost the scent" over the LAN address

Cause: the BotID client script (`botid/client`, rendered in `src/app/layout.tsx`) patches `fetch` for POST routes and signs requests with `crypto.subtle.importKey`. `http://192.168.0.100:3111` is not a secure context, so `crypto.subtle` is undefined there and every POST `fetch` threw `TypeError: Cannot read properties of undefined (reading 'importKey')` before any request left the browser. Simba's useChat saw a failed send and showed the error state; no request ever reached the server, which is why the dev log had no /api/chat error. The same break hit every other POST (guestbook, contact, sign-in) on that address. localhost is a secure context, which is why headless and localhost runs passed.

Fix: `<BotIdClient>` renders only when `isProduction`. Production is https, so its behaviour is unchanged; in development the server-side `checkBotId` already returns HUMAN without a bypass setting. Verified: POST /api/chat from http://192.168.0.100:3111 now returns a response (400 for an empty body, 200 with a full stream for "render his las t5 proejct", cards rendered, no error).

# Round 3: Opus resolve pass

Per-scope logs merged verbatim. Skipped and declined annotations stay in the code with their reasons listed.

## src/app

# Slopradar resolutions: `src/app`, round 3

Paths are relative to `src/app`. Line numbers are the lines of the `TODO(slopradar)` comment before this pass. 111 annotations at the start, 57 left at the end: 53 resolved, 1 declined with the annotation removed, the rest skipped (left in place). Nothing outside `src/app` was edited. Not committed.

## Band 1: Opus-round findings

| # | file:line | rule | what changed |
|---|-----------|------|--------------|
| 1 | api/chat/utils/tools/render-portfolio.ts:54 | unused-export | `RenderPortfolioOutput` is no longer exported. |
| 2 | api/chat/utils/tools/render-portfolio.ts:60 | duplicate-logic | `navigate.ts` exports `parseSitePath(target)` (its own `parseTarget` + `toPathAndHash`: trims, drops trailing slashes, maps `/work` to `/projects`), and `resolveNavigation` uses it. `render-portfolio` `toSlugs(value, section)` and `get-page-content` `getText` split its `path`. The `/work` alias is now written once (`WORK_PREFIX`); `findWork` matches only `projects`, `getText` drops `section === 'work'` and its own `QUERY_OR_HASH` regex. Same results for bare slugs, `/projects/x`, `/work/x`, trailing slashes, `?`/`#`. Edge: `getPageContent` now also accepts a full URL (`https://host/blog/x`), where before the scheme became the "section" and returned "Page not found". |
| 3 | api/chat/utils/tools/get-page-content.ts:24 | duplicate-logic | Resolved by #2 (the code copies of the alias are one; the `next.config` redirect is the visitor-facing one and stays). |
| 4 | api/chat/utils/tools/render-portfolio.ts:120 | dead-fallback | Dropped both `?? 'Untitled'`. |
| 5 | api/chat/utils/tools/render-portfolio.ts:229 | pass-through | `execute: buildSpec`. |
| 6 | api/chat/route.ts:78 | magic-string | The tool map is built once per request as `tools` (passed to `streamText`); `toolsAfterNavigation = Object.keys(tools).filter(name !== 'navigate')` with a type guard. Same four names in the same order. The `:168` annotation moved with the map (still skipped, see below). |
| 7 | sitemap.ts:14 | duplicate-logic | Local `url` removed; imports `url` from `@/lib/url` (`toString()` equals `href`). |
| 8 | sitemap.ts:46 | magic-string | Static entries read `pages.<key>.path` (home, blog, projects, about, contact, resume, uses, colophon, guestbook) and tag URLs `${pages.blog.path}/tags/...`; order, frequency and priority kept. Local array renamed `staticEntries` (it shadowed nothing but read like `pages`). |
| 9 | robots.ts (no own annotation, named by sitemap.ts:14) | duplicate-logic | `sitemap: url('/sitemap.xml')`. |
| 10 | (home)/blog/rss.xml/route.ts:25 | duplicate-logic | All six `new URL(x, baseUrl).href` -> `url(x)`; `/blog/rss.xml` is one module constant `feedUrl`. `id`/`link` stay `baseUrl.href`. |
| 11 | (home)/blog/[slug]/page.tsx:51 | magic-string | GitHub link interpolates `githubBranch`. |
| 12 | (home)/blog/[slug]/page.tsx:53 | duplicate-logic | `markdownUrl={url(['blog.mdx', params.slug])}`, `ShareMenu url={url(page.url)}`; `baseUrl` import dropped. |
| 13 | (home)/blog/[slug]/page.tsx:134 | inconsistent | `generateStaticParams` uses the same `flatMap` form as projects. |
| 14 | (home)/search/_components/search-client.tsx:214 | nested-component | Hoisted to module-level `SearchResultItem` (typed with fumadocs' `SearchItemType`), same markup. Correction to the finding: fumadocs calls `Item(props)` and `Empty()` as plain functions (`dialog/search.js:293-297`), not as elements, so nothing remounted; this is a readability change only. |
| 15 | (home)/search/_components/search-client.tsx:74 | duplicate-logic | `emptyLinkByScope` table (`all: null`, `blog: undefined` = the default link, `projects: {...}`) and one `Empty` wrapping `CenteredEmpty`/`PostEmpty`. |
| 16 | (home)/uses/_components/setup.tsx:17 | dead-class | Deleted the dead `transition-filter` class instead of the suggested `transition-[filter]`. On closer look the hover fade already works: `BlurImage` puts `transition-[filter,scale]` on the image, and the `duration-300` here wins via tailwind-merge. `transition-[filter]` would have made tailwind-merge drop `transition-[filter,scale]`, so the load-in `scale-[1.02]` -> 1 would snap. Checked with `cn()`; the served class string only loses `transition-filter`. No visible change. |
| 17 | (home)/uses/_components/logo.tsx:3 | duplicate-type | Imports `ThemedImage` from `@/types`. The `Logo` alias in `src/types/uses.ts` can now be deleted (types scope; its annotation is there). |
| 18 | (home)/projects/[slug]/page.tsx:19 | unclear-name | `WorkPage` imported under its own name; same for `BlogPage` in `blog/[slug]/_components/header.tsx`. |
| 19 | (home)/projects/[slug]/page.tsx:84 | dead-fallback | `{page.data.description}` here and in the blog header (`?? ''` rendered nothing either way). |
| 20 | (home)/contact/actions/contact.ts:10 | no-comments | Deleted the narration above `sentAtFormat`. |
| 21 | (auth)/account/_components/account-settings.tsx:177 | redundant-conversion | `formatAccountDate(date: Date)`, no `new Date`. The user comes from the server session (drizzle `Date`, no cookie cache) and React Flight keeps `Date`. |
| 22 | (auth)/account/_components/account-settings.tsx:55 | dead-fallback | `<EditNameDialog name={user.name} />`. |
| 23 | (auth)/account/_components/active-sessions.tsx:62 | redundant-conversion | `b.updatedAt.getTime() - a.updatedAt.getTime()` and `format(session.updatedAt, ...)` in `SessionCard`. |
| 24 | (auth)/account/_components/active-sessions.tsx:73 | swallowed-error | `console.error('Failed to list sessions:', error)` before the same fallback card. |
| 25 | (auth)/account/_components/active-sessions-skeleton.tsx:4 | dead-prop | `count` prop removed; `const items = [1, 2, 3]`. |
| 26 | (home)/about/_components/feed/data.ts:17 | unused-export | `ActivityEventItem` no longer exported. |
| 27 | (home)/guestbook/actions/utils/moderation.ts:7 | unused-export | `ModerateGuestbookEntryInput` no longer exported. |
| 28 | (llms)/utils/site-pages.ts:5 | unused-export | `SiteSection` no longer exported. |
| 29 | (llms)/utils/markdown-pages.ts:9 | unused-export | `MarkdownPage` no longer exported. |

## Band 2: older leftovers

| # | file:line | rule | what changed |
|---|-----------|------|--------------|
| 30 | (home)/contact/_components/contact-form.tsx:78 | library-exists | `action.isExecuting` / `action.hasSucceeded` instead of comparing `status` (contact-form, newsletter-form). In next-safe-action 8.7.3 these are exactly `status === 'executing'` / `'hasSucceeded'` (`getActionShorthandStatusObject`). |
| 31 | (home)/guestbook/_components/reactions.tsx (named by #30) | library-exists | `useOptimisticAction` `isExecuting` replaces `status === 'executing'` (x2). |
| 32 | (home)/guestbook/_components/form.tsx:118 | library-exists | `const { isExecuting } = action`; `action.hasSucceeded`. |
| 33 | (home)/guestbook/_components/entry-card/use-entry-actions.ts:65 | library-exists | `isBusy = edit.isExecuting \|\| remove.isExecuting \|\| ban.isExecuting`. |
| 34 | (home)/guestbook/_components/reactions.tsx:109 | redundant-annotation | Dropped `: GuestbookReactionItem` on the map callback. |
| 35 | (home)/colophon/_components/technology.tsx:10 | magic-number | `COLOPHON_COLUMNS = 3` exported from `colophon-grid.tsx`, used for the default `columns`, the lg border math and the filler count. `lg:grid-cols-3` stays literal (Tailwind needs it). |
| 36 | (home)/about/_components/story-track.tsx:41 | unchecked-cast | `node.offsetParent instanceof HTMLElement ? node.offsetParent : null`. |
| 37 | (home)/about/_components/story-track.tsx:54 | unchecked-cast | `for (const [index, current] of rest.entries())` and `if (!(previous && next))`; `previous` is always defined, so the path string is unchanged. |
| 38 | (home)/about/_components/feed/data.ts:86 | swallowed-error | `console.error('GitHub compare commits failed:', error)`, still returns `[]`. The merged-PR search added by the other agent is untouched. |
| 39 | (home)/about/_components/feed/event.tsx:6 | misplaced-type | `GitHubEvent` and `PushCommit` moved into `feed/event-types.ts` (the non-view file `data.ts` already imports); `event.tsx` and `data.ts` import them from there. |
| 40 | (home)/about/_components/feed/event.tsx:82 | duplicate-logic | The twelve wrapper components and the JSX switch became `describeEvent(event, commits, merged)` returning `{ description, icon }` (helpers for push, PR, issue, issue comment, create, delete; one-liners inline), and `GitHubEventRow` renders one `EventRow`. Every description string and icon is the same as before; the PR wording annotation (`:134`, owner call) moved with `describePullRequest`. The payload-type reuse the note mentions is left with the declined `data.ts:60` typed-payload item. Checked `/about`: the feed rows read the same ("Pushed 1 commit to ...", "Opened pull request #111 on ..."). |
| 41 | (home)/blog/[slug]/_components/header.tsx:86 | duplicate-logic | The eight corner ticks map over a `cornerTicks` table of `[position, size]`; class strings are built in the original token order, so the SSR markup is byte-identical (checked). |
| 42 | (home)/_components/portrait.tsx:108 | duplicate-logic | One `BlinkingEyes({ fill })` group used by `Portrait` (no fill, the outer group sets it) and the still chip (`fill={PORTRAIT_EYE_FILL}`). Same markup. |
| 43 | (home)/_components/hero.tsx:80 | magic-string | `href={pages.projects.path}`; the other route literals it lists: `_components/about.tsx` and `resume/page.tsx` `pages.about.path`, `_components/experience.tsx` `${pages.about.path}#experience`, `about/_components/experience.tsx` `pages.resume.path`. (`stack.tsx` had none left.) Served hrefs unchanged. |
| 44 | (home)/_components/cta.tsx:34 | magic-string | `href={pages.contact.path}`. |
| 45 | (home)/guestbook/_components/entries.tsx:46 | duplicate-logic | `EntriesNotice({ children })` used by the empty state and `GuestbookEntriesError`. |
| 46 | (home)/_components/contributions.tsx:45 | unchecked-cast | `event.target instanceof Element ? event.target.closest(...) : null`. |
| 47 | (resume)/resume/page.tsx:166 | redundant-conversion | `project.data.date.getFullYear()`. |
| 48 | api/chat/utils/llms.ts:8 | unclear-name | Renamed to `api/chat/utils/context.ts`; the chat route imports it. |
| 49 | og/_lib/route.tsx:15 | unclear-name | Renamed to `og/_lib/create-og-route.tsx`; both OG routes import it. `/og/blog/<slug>/image.webp` and `/og/work/<slug>/image.webp` still 200 `image/webp`. |
| 50 | (home)/guestbook/_components/entry-card/actions/index.tsx:56 | unclear-name | Flattened to `entry-card/card-actions.tsx` (folder removed); `entry-card/index.tsx` imports `./card-actions`. |
| 51 | (llms)/utils/profile-text.ts:4 | unclear-name | `getProfileText` -> `getSiteText`, file `site-text.ts`; barrel line, `llms-full.txt` and `api/chat/utils/context.ts` updated. The `about.md` annotation's path reference updated. |
| 52 | (llms)/utils/profile.ts:76 | nested-logic | `experienceLength` and `firstRoleStart` computed beside `sinceFirst` and interpolated; `/about.md` still reads "about 4 years since the first role in Apr 2022 (...)". |
| 53 | (llms)/utils/site-pages.ts:57 | duplicate-logic | One `toSitePage(page: BlogPage \| WorkPage)` for both lists. |
| 54 | api/chat/utils/tools/search-docs.ts:20 | duplicate-logic | `toDocument(tag)` mapper over `blogSource` and `workSource` (`Promise<CustomDocument>` return type replaces `satisfies`). Same documents, same order. |
| 55 | (auth)/account/_components/account-settings.tsx:42 | duplicate-logic | New `account-field.tsx` `AccountField({ label, children })` (the label/value column) used by the four rows of `AccountSettings` and of `AccountSettingsSkeleton`; the differing outer row wrappers stay. Same markup. |

## Declined (annotation removed)

| file:line | reason |
|-----------|--------|
| (home)/blog/[slug]/page.client.tsx:110 | `Promise.withResolvers()` is Safari 17.4+/Chrome 119+/Firefox 121+, while Next 16 targets Safari 16.4 and Chrome/Firefox 111 (`docs/03-architecture/supported-browsers.md`) and SWC does not polyfill built-ins. The call runs at module load, so the blog post page would throw on Safari 16.4-17.3. |

## Skipped (annotation left in place)

| file:line | reason |
|-----------|--------|
| api/chat/route.ts:168 (now :130), api/chat/utils/tools/index.ts:8 | `src/lib/ai/chat/types.ts` does `import type { tools }` and `typeof tools`; a `createChatTools(writer)` factory or dropping the stub needs that lib file changed. |
| api/chat/utils/tools/search-docs.ts:83 | Changes what the model reads back from `searchDocs` (assistant answers), same class as the declined `get-page-content.ts:20`. Owner call. |
| (llms)/about.md/route.ts:12 | The three compositions differ (`about.md`: facts + about + commits; `site-text`: about + commits, no facts; `getPageContent('about')`: facts + about, no commits). One helper changes the text the model or the `.md` route serves (round-2 flag). Owner call. |
| (llms)/utils/markdown-pages.ts:35 | Picking one name changes either the `/skills.md` route or the names `getPageContent` advertises to the model. Visible. |
| (home)/_components/portrait.tsx:94 | The only `still` caller is `src/components/features/blog/author-byline.tsx` (components scope). |
| All other remaining annotations | Unchanged reasons from the round 1 log: owner decisions (unstable_cache `feed/data.ts:91`, `(llms)/utils/index.ts` barrel, attribution `header.tsx:1`, PR wording `event.tsx:134`, `(llms)` text items), needs edits outside `src/app` (`@/lib` helpers for pagination, tags, metadata, format-date, initials, error log, theme tokens, validators limits, constants for socials/profile/copy, queries module, `SiteShell`, tsconfig alias, file moves to `src/components`/`src/lib`), or declined then (`contact.ts:15`, `feed/data.ts:60`, `newsletter.ts:63`, `newsletter-form.tsx:34`, `search-client.tsx:127`, `portrait.tsx:146`, `hero.tsx:66`, `entry-card/index.tsx:57`, `route.ts:71`, `get-page-content.ts:20`, `search-docs.ts:7`, `content-index.ts:13`, `create-llm-route.ts:24`, `testimonials.tsx:64`). |

## Verification

- `bunx tsc --noEmit`: no errors in `src/app`. At the last runs, errors appeared only in `src/components/search-redirect-input.tsx` and `src/components/ui-sounds.tsx` (another agent's work in progress).
- `bun run check`: clean for `src/app`. The only findings were in `src/components` (other agents).
- `/sitemap.xml`, `/robots.txt`, `/blog/rss.xml`, `/llms.txt` and `/blog.mdx/vscode-setup` are byte-identical to what they served before the first edit.
- With scripts and dev stack traces stripped, the SSR HTML of `/blog/vscode-setup`, `/projects/anikode` and `/search` is identical before and after. `/uses` differs only by the removed `transition-filter` token. The remaining blog diff is `z-[100]` -> `z-100` from `src/components` edits.
- `/`, `/about`, `/blog`, `/projects`, `/uses`, `/search`, `/guestbook`, `/contact`, `/llms.txt`, `/llms-full.txt`, `/about.md`, `/blog/rss.xml`, `/sitemap.xml`, `/robots.txt`, `/resume`, `/colophon`, `/account`, a blog post, a project and both OG images return 200 on :3111.

## src/components

# Slopradar resolutions, round 3: `src/components` (except `ui/`)

Line numbers are the `TODO(slopradar)` lines before this pass. Paths are relative to `src/components`. 133 annotations at the start, 72 at the end: 61 resolved and removed, one rewritten after a partial fix (`search/dialog.tsx`), and the rest skipped or declined below.

How it was checked: `bunx tsc --noEmit` and `bun run check` after each band (both clean at the end). Playwright (headless shell) against :3111 compared the body HTML of `/`, `/about`, `/blog` and `/projects` and the Simba experience card before and after, ignoring the live clock. The only differences are the intended z-index class names and a new live GitHub event on /about. It also checked the theme toggle, the search dialog (empty, typed, cleared, "theme" queries give the same groups, counts and first selection), the Simba panel ("where has he worked" renders the experience card, plus project and post cards), the mobile header z-indexes and skip link (computed 30/32/100), the JSON-LD on a post, a project and a tag page, and the 404 links.

## Band 1: Simba tool parts (Opus round)

| File:line | Rule | What changed |
| --- | --- | --- |
| `features/assistant/tools/navigate.tsx:115`, `tools/portfolio.tsx:112` | invalid-nesting | The pending line renders `Shimmer as='span'`, so the `<p>` inside `<p>` hydration warning is gone (checked in the console). The ellipsis is now `…`, like the other Simba lines. The span is a flex item, so it gets blockified like the old `<p>`: computed display, margin and height are unchanged. |
| `features/assistant/message-list.tsx:126`, `tools/portfolio.tsx:24` | duplication | New `tools/types.ts` with `ToolPart<Name extends keyof ChatTools>`. It is used for `showContactForm` (x2), `navigate` and `renderPortfolio`. |
| `tools/portfolio.tsx:99` | duplication | New `tools/status-line.tsx` with `ToolPendingLine` (icon plus Shimmer) and `ToolWarningLine`. The markup is class for class what both tools had. The navigate success line differs, so it stays inline. |
| `tools/portfolio.tsx:50` | unchecked-cast | One overloaded `usePortfolioState(collection, key?)`, typed on `PortfolioState[C]` / `PortfolioState[C][string]`, is the only `useStateValue` call. Items still go through `statePath`, and `'/experience'` is now `` `/${collection}` ``. |
| `features/assistant/message-metadata.tsx:40` | dead-code | `toolStatus` is a `Record<Exclude<keyof ChatTools, ToolWithOwnStatus>, …>`, so a new tool fails typecheck. The unreachable camelCase fallback is gone. A `hasOwnStatus` type guard replaces the `Set`. |
| `features/blog/post-row.tsx:8` | unused-export | `PostRowPost` is no longer exported. |
| `features/blog/post-row.tsx:20` | dead-prop | The `heading` prop is gone and the row always renders `<h3>`, as before. |
| `features/work/work-card.tsx:28` | boolean-prop | `viewTransition` and `slugs` are replaced by an optional `transitionName`. `WorkGrid` passes `slugs.join('/')`, while Simba's panel passes nothing and lists the card fields explicitly. `SharedTransition` still renders no `<ViewTransition>` when there is no name, so the panel gets no unnamed boundary. |
| `features/search/utils/groups.ts:58` | library-exists | `bucketByTag` uses `Map.groupBy`, which keeps the same first-seen key order. |
| `features/search/utils/groups.ts:24` | unchecked-assertion | `orderTagGroups` stable-sorts the map entries by their `TAG_ORDER` rank, and unknown tags keep insertion order after the known ones. The `!` is gone. |
| `features/search/utils/groups.ts:98` | duplication | Named `matchesSearch`. |
| `features/search/results.tsx:51` | duplication | One `getTagMeta(tag)`. The `as keyof` casts are gone. |
| `features/search/results.tsx:81` | redundant-conversion | Dropped `String()` x2 here and in `groups.ts` (`SortedResult<Content = string>`). |

## Band 2: arbitrary values, root files, layout

| File:line | Rule | What changed |
| --- | --- | --- |
| `layout/header/mobile/index.tsx:124` | arbitrary-value | `z-[30]` became `z-30`, `z-[32]` became `z-32` (pill, menu), `z-[25]` became `z-25` (text-selection popup) and `focus:z-[100]` became `focus:z-100` (skip link). The computed z-index was checked in the browser: 30, 32, 32, 100. |
| `view-animation.tsx:10` | magic-number | Exported `staggerDelay(index, offset = 0)` (`offset + 0.05 * index`) and named the 0.2 cap `MAX_DELAY`. The seven in-scope callers use it. `offset + step * index` is the same float expression as before, so the `--reveal-delay` strings are unchanged. Callers in `src/app` still spell the step out. |
| `ui-sounds.tsx:117` | duplication | Module-level `pressTarget(target)` is shared by `onPointerDown` and `onClick`. |
| `search-redirect-input.tsx:37` | magic-string | The route comes from `pages.search.path`. |
| `json-ld.tsx:18` | weak-type | `JsonLd` takes `Graph`, and `makeGraph(...nodes: Thing[]): Graph` (schema-dts). |
| `json-ld.tsx:68` | redundant-conversion | `(lastModified ?? date).toISOString()` and `date.toISOString()`. |
| `json-ld.tsx:96` | magic-string | Section names and paths and the tag breadcrumb read `pages.blog` / `pages.projects`. The tag URL uses `tagPath`. Checked on /blog/hello-world, /projects/portfolio and /blog/tags/intro: same names and URLs. |
| `features/blog/tag-card.tsx:17`, `post-filters.tsx:53` | duplication | New `features/blog/tag-path.ts` `tagPath(tag)`, used by tag-card, post-filters and json-ld. |
| `layout/lenis.tsx:14` | boolean-parameter | `scrollToTarget(lenis, target, { immediate })`, with both callers updated. |
| `layout/page-fill.tsx:19` | duplication | `CrossPair` in `layout/sections/index.tsx` is used by `Section` and `PageFill`. Same DOM. |
| `layout/footer/index.tsx:13` | dead-prop | `GuestbookBand` takes no props. The sentence is baked in before the same `{' '}` (same text nodes), and the unused `className` merge and the `cn`/`ReactNode` imports are gone. |
| `layout/footer/clock.tsx:71` | duplication | One `CLOCK_BUTTON_PROPS` (className, size, variant) is spread on the skeleton and the live button. |
| `layout/sections/hero.tsx:4` | inconsistent-imports | hero, list-section and separator import `@/components/layout/sections` (the same module as `./index`). |
| `layout/header/link-item.tsx:32` | redundant | `<Link … />` self-closing, with children coming through `props`. |
| `layout/header/theme-toggle.tsx:34` | unclear-name | `themeOptions` (`Icon`, `label`, `value`) `satisfies` a typed shape. The light-dark branch filters out `system`, and the labels are stored ("Light theme", "Dark theme", "System theme", the same strings as before). |
| `layout/header/theme-toggle.tsx:94` | needless-expression | `aria-label='Toggle theme'`. |
| `layout/header/mobile/menu.tsx:81` | duplication | One `footerIconClassName` for the social links and the assistant button. |
| `layout/footer/links.tsx:17` | unclear-name | `ListItem` renamed to `LinkGroup`. |
| `layout/footer/links.tsx:55` | duplication | New `layout/split-link-items.ts` `splitLinkItems(items)`, used by the header's `useMemo` and the footer (the footer reads `navItems`, which is `on` nav/all, the same set as before). |
| `layout/header/index.tsx:264` | unchecked-cast | `event.target instanceof Node` / `instanceof Element` replace the two casts. A null target or missing ref still closes the menu, as before. |
| `layout/sections/split.tsx:89` | redundant-type | `SectionHeaderProps` is used directly (`align` was already optional). |
| `features/assistant/assistant.tsx:31` | magic-structure | `transport` is a module constant (`DefaultChatTransport<MyUIMessage>`). |
| `features/assistant/mascot/use-look.ts:37` | library-exists | `clamp` comes from `motion/react`, and the tuning values are named (`LOOK_RANGE_PX`, `LOOK_SHIFT_X_PX`, `LOOK_SHIFT_Y_PX`, `LOOK_TILT_DEG`). The arithmetic is the same. |
| `features/toc/popover.tsx:138` | library-exists | `clamp(0, 1, value)` is computed once and used for the arc and for `aria-valuenow`. |
| `features/assistant/mascot/hooks.ts:29` | pass-through-helper | `playSubmitAnimation` is inlined in `input.tsx` as `mascot?.setActivity(animations.submit)`. |
| `features/assistant/input.tsx:56` | inconsistent-naming | `MaxSourcePreviewChars` renamed to `MAX_SOURCE_PREVIEW_CHARS`. |
| `features/assistant/input.tsx:107` | duplication | One `canSend`. `onStart` returns on `isLoading \|\| !canSend`, and the submit button's `disabled={!(isStreaming \|\| (canSend && !hasPendingToolInput))}` is the same boolean as before (De Morgan). |
| `features/assistant/mascot/controller.ts:9` | unchecked-cast | `pick` takes `readonly [T, ...T[]]` and returns `items[i] ?? items[0]`. Both callers pass non-empty `as const` tuples. |
| `features/auth/sign-in-modal.tsx:119` | magic-structure | `providers` is a module constant. |
| `features/auth/user-button.tsx:38` | needless-expression | `aria-label='User menu'`. |
| `features/work/experience-timeline.tsx:37` | boolean-parameter | `toEntries(experiences, variant)`. |
| `features/work/experience-timeline.tsx:110` | unclear-name | `Node` renamed to `NodeComponent`. |
| `content/mdx/mermaid.tsx:28` | swallowed-error | `catch (error)` logs `console.error('Failed to render Mermaid diagram:', error)`. The code-block fallback is unchanged. |
| `content/mdx/github-repo.tsx:124` | inconsistent | The anchor spreads `externalLinkProps`. |
| `preview-link.tsx:49` | duplication | New `external-link.ts` `externalLinkProps` (a plain module, so the server components `github-repo` and `github-code` can import it). Used by preview-link, github-repo (local copy deleted), github-code and the mobile menu socials. Same `rel`/`target` values. `ai-elements/sources.tsx` (`'noreferrer noopener'`, a different attribute value) and `page-actions.tsx` (`rel='noopener'`, its own annotation) are left alone. |
| `content/mdx/embed.tsx:19` | duplication | One `FrameOutline` for the ring overlay, used by `IframeEmbed` and `FramedImage`. The two wrappers differ (`div` vs `figure` with `[&_img]:rounded-xl`), so they stay. |
| `icon-swap.tsx:19` | dead-config | `IconSwapItem` always renders `m.span`. Dropped the `as` prop, the `MotionElement` union and the `as={m.span}` in both callers. |
| `icons/icons.tsx:155`, `:163`, `:172` | unused-export | Deleted `Icons.calendar`, `Icons.code` and `Icons.ellipsis` and their imports. Grepped `src content emails scripts`, including the dynamic `Icons[chapter.icon]` (story chapters use `wrench` and `codeXml`). This does not touch the icon-mix standing exception. |
| `features/assistant/message-list.tsx:99` | magic-string | New `features/assistant/owner-name.ts` (`ownerName`, the lowercased first name of `owner`). The empty state and the three contact-form strings (sent, intro, placeholder) are template literals, so each stays one text node with the same text (checked in the panel). |
| `features/not-found/not-found-content.tsx:9` | duplication | `href`/`label` come from `pages.about/projects/blog/guestbook`, and only the descriptions stay local. Checked on a 404: same links and labels. |
| `ai-elements/markdown.tsx:134` | unchecked-cast | `processCached(text)` holds the LRU. The oldest key is read from the iterator result with a `done` check, so there is no `as string`. |
| `features/search/utils/groups.ts:18` | duplication | One table in new `features/search/utils/tags.ts` (`heading`, `icon` and `path` from `pages`). `TAG_ORDER`, `tagFromUrl` and `getTagMeta` derive from it. The local tables in `groups.ts` and `results.tsx` are gone. |
| `features/search/dialog.tsx:304` | duplication | `SearchResultsList` renders once, between the main and the "after" groups. `afterGroups` is `[]` whenever there is a query, so the order is the same in both states (checked: same group order, option counts and first selection for empty, typed, cleared and "theme"). The two Fragment/CommandGroup blocks are one `renderGroup(group, { separated })`. |
| `features/search/dialog.tsx:38` | long-function (partial) | Extracted `useSearchSounds(open)` (four sounds, the open effect and the throttled navigation sound). It is called after the `onMount` effect, so the effect order is unchanged. The annotation was rewritten to the remaining half (a `useCommandActions` hook). |

## Skipped (annotation left in place)

| File:line | Reason |
| --- | --- |
| `smooth-cursor.tsx:125` | Declined: `size-6` is `1.5rem`, which equals 24px only at a 16px root. The site never sets the root font size, so a visitor with a larger default font would get a larger cursor. The computed values are not identical. |
| `features/work/work-card.tsx:92` | Changing `sizes` changes the DOM attribute and which image the browser downloads. That is a perf decision for the owner, not behaviour-preserving. |
| `features/work/work-card.tsx:11` | The card type and `toWorkCard` need `lib/ai/chat/catalog.ts` and `render-portfolio.ts` (outside). Note for the lib scope: `ProjectItem.slugs` is no longer read by the client, now that `WorkCard` takes `transitionName`. |
| `features/work/experience-timeline.tsx:27` | `periodYear` must be exported from `src/lib/employment-period.ts` (outside). |
| `features/assistant/tools/portfolio.tsx:60` | The tool would have to ship `PostRowPost`'s shape (`src/app`/`src/lib`). |
| `features/blog/post-row.tsx:23` | Splitting `meta` into a child or `PostRowCompact` changes the API of the hand-merged json-render row. Left for the owner. |
| `ai-elements/shimmer.tsx:6`, `sources.tsx:12`, `tool.tsx:13`, `conversation.tsx:9`, `prompt-input.tsx:20`, `message.tsx:8` | Owner decision (round 2): keep or remove the unused `*Props` exports in the ai-elements registry slice. |
| `ai-elements/sources.tsx:61` | Needs an option on `ui/collapsible` (excluded scope). |
| `ai-elements/message.tsx:17` | Moving to `group-data-[role=…]` changes the class list. |
| `ai-elements/markdown.tsx:22` | Merging the three markdown stacks changes the rendering pipeline (output risk). That is a change of its own. |
| `layout/footer/clock.tsx:26` | Moving `transformOrigin` from inline style to `origin-top-left` changes the DOM (the style and class attributes). |
| `layout/header/mobile/menu.tsx:65` | Removing the deferral changes when the menu closes relative to navigation, and explaining it needs a new comment, which this pass does not add. |
| `layout/sections/hero.tsx:67` | Sharing `SectionHeader`'s helper would drop the empty `ViewAnimation` wrappers for null children (DOM change). |
| `layout/footer/active-link.tsx:16` | `isActive`'s signature is in `src/lib/is-active.ts` (outside). |
| `layout/sections/separator.tsx:9` | Four of the five callers are in `src/app`, and the rename changes an import used outside. |
| `features/auth/user-button.tsx:82` | `DropdownMenuIconItem` wraps the icon in a `size-7` muted tile with different item padding (visible). There is no `pages.account` entry for the route (constants). |
| `features/blog/index.ts:1` | Owner decision 5 (barrels), and its importer is in `src/app`. |
| `features/search/dialog.tsx` (`useCommandActions`) | The rest of the long-function item. The actions close over router, lenis, theme, sign-in and `close`, so a hook would move most of the component. Left as the rewritten annotation. |
| Carried over from rounds 1 and 2, unchanged reasons | `theme-provider.tsx:6`, `layout/wrapper.tsx:7`, `layout/sections/body.tsx:10`, `json-ld.tsx:155`, `blur-image.tsx:16`, `guestbook-cue.tsx:19`, `layout/header/index.tsx:151`, `features/assistant/tools/contact-form.tsx:6`, `:135`, `features/blog/author-byline.tsx:1`, `content/mdx/layout.tsx:2`, `:11`, `features/auth/user-avatar.tsx:52`, `layout/footer/links.tsx:79`, `layout/header/mobile/pill.tsx:18`, `layout/site-shell.tsx:32`, `features/work/experience-rail.tsx:34`, `page-actions.tsx:21` (cross-scope); `blur-image.tsx:4`, `layout/header/index.tsx:37`, `features/toc/popover.tsx:15` (owner decision 6); `features/contributions.tsx:3`, `:353` (owner decision 7); `layout/header/mobile/index.tsx:99` (owner decision 8); `layout/header/index.tsx:255`, `features/toc/popover.tsx:37`, `features/assistant/input.tsx:59`, `features/assistant/mascot/constants.ts:35`, `features/not-found/simba-loop.tsx:30`, `features/assistant/tools/navigate.tsx:44`, `inline-markdown.tsx:4` (declined earlier); `page-actions.tsx:166`, `search-redirect-input.tsx:52`, `layout/footer/index.tsx:42`, `layout/footer/sound-toggle.tsx:24`, `layout/footer/clock.tsx:23`, `layout/footer/links.tsx:119`, `layout/header/index.tsx:164`, `:492`, `layout/header/mobile/pill.tsx:41`, `features/assistant/input.tsx:208`, `features/assistant/text-selection-popup.tsx:75`, `features/work/experience-timeline.tsx:160`, `content/mdx/heading.tsx:9`, `content/mdx/github-code.tsx:29`, `ai-elements/tool.tsx:38`, `icons/brands/claude.tsx:4`, `icons/brands/github.tsx:6`, `:8` (visible or DOM change). |

## src/lib, src/server, src/hooks, src/contexts, src/constants, src/types, src/env.ts, src/styles

# Slopradar round 3 resolutions: `src/lib, src/server, src/hooks, src/contexts, src/constants, src/types, src/env.ts, src/styles`

## Resolved

| file:line | rule | what changed |
| --- | --- | --- |
| `src/lib/media.ts:8` | dead code | Deleted the `hoverFinePointer` and `reducedMotion` keys and the `REDUCED_MOTION_QUERY` import. No `MEDIA[...]` lookups exist; every `MEDIA.*` read uses the five keys that remain. |
| `src/styles/globals.css:357` | dead CSS | Deleted `.divider-bottom-dashed`. Grepped `src content emails scripts next.config.ts source.config.ts`: no other uses. |
| `src/styles/globals.css:408` | dead CSS | Deleted the `[data-hide-on-theme]` rule. Nothing sets the attribute (same grep). |
| `src/styles/scroll-fade-effect.css:81` | dead CSS | Deleted `scroll-fade-effect-x`, the `show-left-mask`/`hide-right-mask` keyframes and the `--left-mask-width`/`--right-mask-width` `@property` rules. Only `scroll-fade-effect-y` is used (blog TOC, search dialog, Simba message list). |
| `src/styles/globals.css:488` | duplication | Merged the two global `prefers-reduced-motion: reduce` blocks into the later one. The `::view-transition-*` rules moved down: only the `no-preference` block (which can never match at the same time) and rules for other elements sat between, and `*` does not match pseudo-elements, so the cascade is unchanged. `simba.css` keeps its own block (a different file). |
| `src/lib/github-repo.ts:79` | dead fallback (x2) | Dropped `pushed_at ?? null` and `html_url ?? getGitHubRepoUrl(parsed)`. `full-repository` types both as `string` (`@octokit/openapi-types`). `pushedAt` narrowed to `string`; `formatPushedAt(string \| null)` in components still accepts it. |
| `src/lib/github-contributions.ts:41` | swallowed error | The catch logs `console.error('GitHub contributions fetch failed:', error)` (same shape as `getActivityItems`) and still returns `[]`. A failure is still not cached. |
| `src/lib/audio/preferences.ts:55` | unused export | `setSoundEnabled` is module-private; `toggleSound` is its only caller. |
| `src/lib/cover.ts:1` | unused exports | `coverSwatches` and `CoverBlob` are module-private; `CoverSwatch` and `createCover` stay exported (`og.ts`). |
| `src/lib/safe-action/middleware.ts:6` | unused export | `ActionContext` is module-private. |
| `src/lib/metadata.ts:13` | unused export | `getSimpleOgImage` is module-private. |
| `src/lib/metadata.ts:31` | shadowing | `clampOgParams(title, ...)` parameter renamed to `ogTitle`; the returned key is still `title`, so `src/app/og/route.tsx` is unchanged. |
| `src/contexts/pages.tsx:15` | React 19 | `<PagesContext value={pages}>` instead of `<PagesContext.Provider>`. |
| `src/lib/get-llm-text.ts:21` | redundant conversion | `format(page.data.lastModified, ...)` without `new Date(...)` (the generated type is `Date`, and fumadocs-mdx emits a `Date`); the two exports return the promise directly instead of `async`/`return await`. Same text. |
| `src/lib/github-code.ts:45` | redundant work | `parseLineRange(parsed.hash)` instead of the whole URL. The regex is anchored on `#L...$` and the hash is always the end of the URL, so the result is identical. |
| `src/lib/resend.ts:133` | unchecked cast | `isRateLimitError` narrows with `'name' in error` / `'statusCode' in error`; the `ResendError` interface and the `as` cast are gone. Same truth table. |
| `src/lib/link-preview.shared.ts:4` | duplicate type | The zod schemas are the source; `LinkPreviewEntry` and `LinkPreviewManifest` are `z.infer` of them, so the `satisfies` links are no longer needed. `LinkPreviewImage` is unchanged. `scripts/link-previews` already imports these names from this file, so nothing there changes. |
| `src/lib/ai/chat/catalog.ts:76` | duplicate type | `PostItem` = `Pick<BlogPage, 'url'> & Pick<BlogPage['data'], 'author' \| 'description' \| 'tags' \| 'title'> & { date: string }` (same fields and optionality). `ProjectItem` derives `slugs`/`url`/`title` from `WorkPage`; `description: string` and `image: string \| null` stay written out on purpose, because the page data has them optional and the tool normalises them (`?? ''`, `?? null`) for the JSON spec. Deriving those would change the shape the tool and the card share. |
| `src/lib/ai/chat/catalog.ts:7` | comment rule | The six-line JSDoc that retold the renderPortfolio lookup is one line of intent. The JSDoc is not sent to the model; component `description` strings are unchanged. |
| `src/lib/validators/guestbook.ts:28` | deprecated API | `.merge` replaced by `GuestbookEntrySchema.extend({ entryId })`. Same keys, same order, same strip behaviour. |
| `src/lib/validators/guestbook.ts:33` | pass-through | The private `GuestbookEntryIdSchema` and its alias are gone; one `entryId` field schema is shared by the reaction, edit and delete schemas, and `GuestbookDeleteSchema` is defined directly. The name the action imports (`src/app/(home)/guestbook/actions/guestbook.ts`) is unchanged. |
| `src/lib/validators/guestbook.ts:8` | magic number (in-scope half) | `GUESTBOOK_MESSAGE_MAX_LENGTH = 500`, and `ACCOUNT_NAME_MAX_LENGTH = 32` in `validators/account.ts`, interpolated into the messages, which read the same. The form `maxLength` call sites are in `src/app` (see cross-scope). |
| `src/types/uses.ts:3` | pass-through | Deleted the `Logo` alias. `src/app/(home)/uses/_components/logo.tsx` now imports `ThemedImage`, so nothing imports the alias. `SoftwareItem.logo` is typed `ThemedImage`. |
| `src/constants/navigation/links.tsx:8` | duplication (x5) | Each nav item reads `pages.<key>.title` and `.path`. Strings are identical (About, Projects, Blog, Contact, Guestbook and their paths). |
| `src/constants/portfolio/faq.ts:13` | magic string (partial) | One `email` constant in `src/constants/site.ts`, used by the FAQ answer and the `mailto:` social link. Both strings are identical. `profile.obfuscatedEmail` stays a literal on purpose: deriving it with `btoa(email)` would put the plain address into every bundle that imports `profile`, which is what the obfuscation avoids. |
| `src/lib/og.ts:152` | long function | `WASH_GRADIENT`, `GRAIN_ALPHA_MATRIX` and `grainFilter({ height, seed, width })` are split out of the template. Checked that the data URLs for four seeds at 1200x630 are byte-identical before and after. |

## Skipped (owner decision)

| file:line | reason |
| --- | --- |
| `src/lib/github-code.ts:96`, `src/server/db/queries/guestbook.ts:81` | Owner decision 4 (`unstable_cache` vs `'use cache'`). |
| `src/lib/metadata.ts:7` | Owner decision 12 (`NEXT_PUBLIC_BASE_URL` required in production). |
| `src/lib/is-active.ts:8` | Owner decision 6 (attribution). |
| `src/lib/validators/index.ts:1` | Owner decision 5 (barrels). |
| `src/lib/resend.ts:116` | Owner decision 3 (`useErrorCause`). Also, the premise is only partly right: Resend's `error` is a plain `ErrorResponse` object (`{ message, name, statusCode }`), so `JSON.stringify` does print its fields; only a thrown `Error` would print `{}`. |
| `src/server/db/schema/comments.ts:14`, `:23`, `:41` | Drizzle schema, column and index changes are owner decisions (decision 11, plus any rename needs a migration). |
| `src/lib/auth-client.ts:7` | The 429 toast would start playing a sound (visitors hear it); decision 15 class. |
| `src/lib/ai/prompts/chat/directives.ts:1`, `src/lib/ai/prompts/chat/tools.ts:1` | Consolidating prompt text changes what the model reads; not done in a behaviour-preserving band. |
| `src/styles/globals.css:320` | Converting the `@layer utilities` classes to `@utility` changes where Tailwind sorts them among the other utilities and makes them emit only when the scanner finds them, so the cascade could change for visitors. Needs a visual check. |

## Skipped (cross-scope or blocked)

| file:line | reason |
| --- | --- |
| `src/lib/validators/guestbook.ts:40` | The DTOs are imported by six `src/app/(home)/guestbook` files. Moving them would need those imports changed, or a re-export from `validators`, which is a second import path (the same slop as the `Logo` alias and the `@/constants` `baseUrl` re-export). Typing the columns from `$inferSelect` also does not fit as is: `users.banned` is nullable while the DTO's `banned` is `boolean` (the query coalesces it). |
| `src/lib/source/blog.ts:5` | Renaming `post` to `blogSource`: all three importers are in `src/app` (`search-docs.ts`, `get-page-content.ts`, `(llms)/blog.mdx/.../route.ts`). |
| `src/constants/site.ts:6` | `handle` is also imported by `emails/contact-notification.tsx`. |
| `src/constants/index.ts:3` | `src/components/json-ld.tsx` still imports `baseUrl` from `@/constants`. After it switches to `@/lib/metadata`, delete the re-export. |
| `src/constants/portfolio/experiences.tsx:1` | `scripts/link-previews/config.ts` lists the file by its `.tsx` path (unchanged from the earlier pass). |
| `src/lib/github-contributions.ts:5`, `src/lib/ai/chat/types.ts:4`, `:18`, `:21`, `src/lib/audio/preferences.ts:77`, `src/server/comments/moderation.ts:66`, `src/server/db/queries/guestbook.ts:117`, `src/lib/reveal-script.ts:7`, `src/hooks/use-reduced-motion.ts:10`, `src/styles/globals.css:336` | Unchanged from the earlier skips in SLOPRADAR-RESOLUTIONS.md (cross-scope, or something a visitor would see or hear). |

## Declined

| file:line | reason |
| --- | --- |
| `src/constants/search.tsx:123` | `/rss.xml` is a next.config **rewrite** (not a redirect), and the footer links to it too, so it is a deliberate short public URL. `/blog/rss.xml` is the route itself. Pointing the command palette at `/blog/rss.xml` would change the URL the visitor sees. One constant would also need edits in the footer (`src/components`) and in `next.config.ts`. |
| `src/constants/portfolio/intro.ts:3` | Only the company name and URL could be read from `experiences`; the prose around them ("software engineering intern", "AI products with Next.js...", the story's company description) changes with any job change anyway. A `find(isCurrentEmployer)` would also need fallback copy for when there is none, which is the owner's copy decision. |
| `src/env.ts:36` | Declined in the earlier pass (with `SKIP_ENV_VALIDATION` the zod default never applies). The reason still holds. |

## Cross-scope follow-ups for other agents

- `src/app/(home)/guestbook/**` form `maxLength={500}` and `src/app/(auth)/account/_components/account-settings.tsx:140` `maxLength={32}` can import `GUESTBOOK_MESSAGE_MAX_LENGTH` / `ACCOUNT_NAME_MAX_LENGTH` from `@/lib/validators/guestbook` and `@/lib/validators/account`.
- `src/components/json-ld.tsx`: import `baseUrl` from `@/lib/metadata`, then the re-export in `src/constants/index.ts` can go.
- `src/components/layout/footer/links.tsx` and `src/constants/search.tsx` both write `/rss.xml`. If the owner wants one constant, it belongs next to `pages` and the rewrite stays.

## Noticed, not annotated

- `src/styles/scroll-fade-effect.css` (`scroll-fade-effect-y`, `mask-image`): a stray second `linear-gradient(black, black);` line follows the declaration. The browser drops it as an invalid declaration; left alone because it was not annotated.

## emails, scripts, root config

# Slopradar resolutions, round 3: `emails/`, `scripts/`, root config

Line numbers are the `TODO(slopradar)` lines as they stood before this pass.

## Band 1: emails

Checked by rendering both templates with `@react-email/render` (PreviewProps, plus the newsletter with every `image` removed so the placeholder shows) before and after, then diffing the HTML. The only differences are URLs.

| File | Rule | What changed |
|------|------|--------------|
| `emails/contact-notification.tsx:75` | bug | Footer link is `url('/contact')` from `@/lib/url`. Bug fix: the href changes from `https://host//contact` to `https://host/contact`. The template no longer imports `baseUrl` from `@/constants`. |
| `emails/newsletter-welcome.tsx:41` | bug | Placeholder `src` and the PreviewProps image and post URLs use `url()` from `@/lib/url` (imported as `siteUrl`, because `PostCard` has a `url` prop). Bug fix: the placeholder `src` changes from `https://host//images/placeholder.png` to `https://host/images/placeholder.png`. The PreviewProps URLs lose the `//` too. The template no longer imports `baseUrl` from `@/constants`. |
| `emails/newsletter-welcome.tsx:27` | unclear-name | The site title import is `title as siteTitle`, so the `title` prop no longer shadows it. `PostCard` props are `NewsletterWelcomeEmailProps['posts'][number]`. No HTML change. |

## Band 2: scripts

`check:links` still reports 32 URLs, 0 fallbacks and 0 errors. A probe of `collectUrls()` gives the same 159 URLs as `public/previews/manifest.json`: none added, none dropped.

| File | Rule | What changed |
|------|------|--------------|
| `scripts/check-links.ts:61` | redundant-check | Partly declined. Dropped `?.` on `_exports`, which is present on all 21 pages at runtime. `toc` keeps `?.` and `?? []`: at runtime it is `undefined` on all 21 pages despite its type, and without the guard `check:links` throws `undefined is not an object (evaluating 'toc.map')`. |
| `scripts/check-links.ts:72` | await-in-loop | `getFiles` is `Promise.all(pages.map(async (page) => ({ ... })))` with a `Promise<FileObject[]>` return type. Order is kept. |
| `scripts/link-previews/utils.ts:27` | platform-api | `shouldGeneratePreview` uses `URL.parse(url)` and checks `protocol` for `http:`/`https:`. Edge case: `URL.parse` lowercases the scheme, so `HTTP://…` now passes where the `startsWith('http://')` check rejected it. No such URL exists in `content/` or `src/`. |
| `scripts/link-previews/utils.ts:137` | dead-default | `captureScreenshot`'s `timeout` parameter is required. Its only caller already passes the mode's timeout. |
| `scripts/link-previews/utils.ts:140` | duplication | `main()` in `index.ts` creates `public/previews` once, before capturing. The `mkdir` calls in `captureScreenshot` and `writeManifest` are gone. |
| `scripts/link-previews/utils.ts:157` | nested-catch | New `gotoWithFallback(page, url, timeout)` uses try/catch. It tries `networkidle` first, then `domcontentloaded`. If both fail it rethrows the first error. It waits `waitAfterFallback` only after the fallback succeeds, as before. |
| `scripts/link-previews/utils.ts:175` | swallowed-errors | The callback is now `async () => { await document.fonts.ready }`, so it no longer returns the FontFaceSet. A failure is logged with `console.warn` instead of being dropped. It does not reach the outer catch, so a page that navigates during the evaluate still gets its screenshot, as before. |
| `scripts/link-previews/utils.ts:207` | swallowed-errors | `removeOrphans` calls `readdir` with no try/catch. `main()` creates the directory first, so ENOENT can no longer happen, and any other error now reaches `main().catch` (exit code 1). |
| `scripts/link-previews/utils.ts:224` | implicit-type | New `CaptureResult` (`{ success: true } \| { error: string; success: false }`) is the return type of `captureScreenshot` and the input to `createEntry`. `errorMessage` is `result.success ? undefined : result.error`, the same values as before. |
| `scripts/link-previews/config.ts:24` | dead-config | `public/previews` holds 158 `.jpeg` files and the manifest, and no png. `imageFormats` and the union-typed `imageFormat` are removed, and `screenshot.image` is `{ format: 'jpeg', quality: 92 } as const`. The `quality` ternary is gone, and orphans are matched on `.${screenshot.image.format}`. |
| `scripts/link-previews/config.ts:8` | drift-prone-list | `previewLinkSourceGlobs` globs `src/constants/**/*.{ts,tsx}` (via `fs.glob`) plus the three component files. The run reads 44 files instead of 29 and finds the same 159 URLs. |
| `scripts/link-previews/index.ts:103` | inconsistent-error-handling | A missing required manifest now throws `Error('No manifest found. Run bun run generate-previews first.')`. `main().catch` prints it and sets exit code 1. Before, the script logged and exited 0. |

## Band 3: root config

| File | Rule | What changed |
|------|------|--------------|
| `source.config.ts:38` | weak-schema | `github` and `website` on `work` are `z.url().optional()`. All 23 frontmatter values in `content/work` are absolute https URLs, and zod 4's `z.url()` returns the input string unchanged, so the types and data are the same. `fumadocs-mdx`, typecheck and build pass. |
| `next.config.ts:40` | dead-config | Removed `reactStrictMode: true`. `define-env.js` sets `__NEXT_STRICT_MODE_APP` to `true` when the option is `null`, which is its default. The only other read is `__NEXT_STRICT_MODE` in the pages-router client, and this repo has no `pages/` directory. |
| `next.config.ts:101` | stale wording | The `ignoreBuildErrors` annotation no longer mentions `useTypeScriptCli`, which was removed in round 1. The annotation stays (owner decision 1). |
| `biome.jsonc:73` | stale-reason | `rg '\btw='` finds no `tw` prop in `src` or `emails`. Removed `"noUnknownAttribute": "off"` and its comment, so the ultracite react preset's `error` level applies. `biome lint --only=suspicious/noUnknownAttribute .` reports nothing. |
| `biome.jsonc:12` | redundant-config | Partly declined. Removed `!**/.next`, `!**/dist`, `!.vercel`, `!pnpm-lock.yaml`, `!bun.lock` and `!**/*.grit`. Adding any one of them back leaves the checked-file count unchanged. Kept `!.github`: it is the only entry that matters, because without it biome also checks `.github/hooks/ultracite.json` (408 -> 409). The final list checks 408 files, the same as before. |
| `package.json` | misplaced-dependency | `remark-mdx` (imported only by `scripts/link-previews/utils.ts`) and `schema-dts` (only `import type` in `src/app/layout.tsx` and `src/components/json-ld.tsx`) moved to `devDependencies`. `bun install` reports no package changes, and `bun install --frozen-lockfile` passes on the updated `bun.lock`. |
| `package.json` | loose-pin | `motion` is pinned to `14.2.0`, next to `framer-motion` `14.2.0`. The lock already resolved `motion@14.2.0`, so no package changes, and the frozen install passes. |

## Skipped (annotation left in place)

| File | Reason |
|------|--------|
| `scripts/link-previews/config.ts:77` | duplicate-schema. `fumadocs-mdx` rejects any export from `source.config.ts` that is not a collection ("Unknown export … you can only export collections"). Exporting a shared `workLinks` broke the dev server on :3111 for a moment, so the export was reverted. A shared module under `scripts/` imported by `source.config.ts` would make content config depend on tooling. Left for an owner call on where the shape should live. |
| `scripts/generate-portrait.ts:5` | Checking the change means regenerating `src/app/(home)/_components/portrait-face.tsx`, and `src/` is off limits this pass. |
| `emails/contact-notification.tsx:25`, `emails/newsletter-welcome.tsx:67` | Email theme unification changes how emails look (owner decision 15). |
| `biome.jsonc:35` | The disabled rules need an owner-written reason, or a separate change that turns them on. |
| `next.config.ts:38` | `SOURCE_MAPS`/`ANALYZE` env move is an owner decision and needs an edit to `src/env.ts`. |
| `next.config.ts:101` | Build gate, owner decision 1. |

# Logged after the round-3 verification

- **Sign-in modal URL.** The sign-in modal is URL-driven: opening it pushes `?signin=<path>` (sanitized by `sanitizeRedirect`), Escape or Back closes it, a direct `/?signin=/blog` link opens it, and `/login` redirects to `/?signin=%2F`. This predates the slopradar passes (made after the guestbook report that sign-in should live in a query parameter) and is visible to visitors.
- **`.dark ::selection` removal** (src/styles/globals.css, round 1): the dark-mode rule had declarations identical to the plain `::selection` rule, so removing it changes nothing.
- **Search highlight check.** The verifier doubted that a row is highlighted after server results arrive. Compared against production (https://www.imanirudh.com, the #107 state) with the same queries on localhost:3111 ("hello", "gork", "portfolio", each typed after a clear, 3.5 seconds of settle time): both highlight the first row identically (Hello world / How we taught a Slack bot to run code / Portfolio). Not a regression.

# Round 4: Opus resolve pass

Per-scope logs merged verbatim (bug fixes are called out inside them).

## src/app

# Slopradar resolutions, round 4: `src/app`

Paths are relative to `src/app`. Line numbers are the `TODO(slopradar)` line before this round. Annotations: 92 before, 67 after (25 resolved, 1 narrowed and kept).

## Resolved

| # | file:line | rule | what changed |
|---|-----------|------|--------------|
| 1 | (home)/contact/_components/faq.tsx:38 | magic-number | `delay={staggerDelay(index)}` from `@/lib/stagger` (`offset + 0.05 * index`, offset 0). `0 + x === x` for every non-negative float, so the `--reveal-delay` strings are unchanged. |
| 2 | (home)/contact/_components/hero.tsx:26 | magic-number | `staggerDelay(index)`. |
| 3 | (home)/about/_components/stack.tsx:25 | magic-number | `staggerDelay(index)`. |
| 4 | (home)/blog/[slug]/_components/header.tsx:56 | magic-number | `0.1 + index * 0.05` -> `staggerDelay(index, 0.1)` (`0.1 + 0.05 * index`; IEEE multiplication is commutative, same float). |
| 5 | (home)/_components/testimonials.tsx:28 | magic-number | Same as #4. |
| 6 | (home)/_components/experience.tsx:26 | magic-number | `staggerDelay(recent.length)`. |
| 7 | (home)/_components/work.tsx:11 | magic-number | `staggerDelay(works.length)`. |
| 8 | (home)/_components/writing.tsx:11 | magic-number | `staggerDelay(posts.length)`. |
| 9 | (home)/contact/_components/faq.tsx:33 | dead-class | Dropped the four `[&>[data-slot=accordion-item]]` selectors; `Accordion` keeps `w-full`. In the browser the accordion's direct children are the ViewAnimation divs, and their bottom borders (1px dashed x3, 0px on the last) and the items' borders (0px) are identical before and after. |
| 10 | (home)/contact/_components/faq.tsx:46 | dead-class | `!h-auto p-4` -> `p-4` on `AccordionContent`; the class lands on the panel's inner div (`ui/accordion.tsx`), whose height is auto anyway. Open panel inner div measured 132px / 16px padding before and after. |
| 11 | (home)/blog/[slug]/_components/header.tsx:20 | derivable-prop | `Header` reads `const { image, tags } = page.data`; dropped the `tags` prop, `tags={tags}` and the now unused `tags` destructure in `page.tsx`. Tag cards still render on /blog/hello-world. |
| 12 | (home)/blog/[slug]/_components/header.tsx:48 | inconsistent | `bg-gradient-to-t` -> `bg-linear-to-t`. Computed `background-image` and `--tw-gradient-stops` on /blog/hello-world are identical before and after (`linear-gradient(to top, oklab(0 0 0 / 0.7) 0%, oklab(0 0 0 / 0.3) 50%, rgba(0, 0, 0, 0) 100%)`). |
| 13 | (auth)/account/_components/revoke-session-button.tsx:14 | library-exists | `const { execute, isExecuting }`; both `status === 'executing'` read `isExecuting` (same shorthand as round 3, next-safe-action `getActionShorthandStatusObject`). |
| 14 | (home)/guestbook/_components/entry-card/index.tsx:111 | library-exists | `isSaving={edit.isExecuting}`. |
| 15 | (home)/guestbook/actions/guestbook.ts:120 | dead-arg | `moderateEntry({ message: parsedInput.message })`; `signature` is optional in `ModerateGuestbookEntryInput` and only read behind `if (signature)`. |
| 16 | (home)/about/_components/stack.tsx:17 | magic-string | `href: pages.uses.path`. |
| 17 | (home)/guestbook/_components/form.tsx:108 | magic-string | `openSignIn(pages.guestbook.path)`. |
| 18 | (home)/search/_components/search-client.tsx:36 | magic-string | `getItemTag` checks `pages.projects.path` / `pages.blog.path` (both `/projects`, `/blog`). |
| 19 | (home)/about/_components/feed/data.ts:130 | unclear-name | The `closedPullRequests` Set of whole items is gone: `isClosedPullRequest(item)` predicate, `items.some(isClosedPullRequest)` for the early return and the same predicate in the map. Same condition, same merged lookup, so the merged-PR behavior is unchanged. |
| 20 | api/chat/utils/tools/navigate.ts:29 | pass-through | `parseTarget` and `toPathAndHash` folded into `parseSitePath`; the `try` still wraps only `new URL`, and the returned `{ hash, path, sameOrigin }` is the same. |
| 21 | api/chat/route.ts:160 | redundant-validation | `prepareStep` narrows with `!result.dynamic && result.toolName === 'navigate' && result.output.success`; dropped the `navigateOutputSchema` import from the route. Checked that `result.output` is typed as the navigate output union (a probe property fails tsc with that union in the message), so this is not `any`. The celebrate tool and the rest of the tool map are untouched. |
| 22 | (home)/guestbook/_components/reactions.tsx:40 | duplicate-type | `payload: z.infer<typeof GuestbookReactionSchema>` (type-only imports). |
| 23 | (home)/_components/portrait.tsx:146 | effect-mirrors-state | Both reset effects are gone. `bonk()` starts the sulk timer when it sets `sulking`, and starts the bonked timer only when none is pending (`??=`), so `bonked` still clears BONK_MS after the first bonk of a run, as the old `[bonked]` effect did. The unmount effect clears all three timers. Browser check on `/`: `data-bonked` cleared about 253ms after the first click even with a second click at 100ms, and sulking held `aria-disabled` for about 5000ms. |
| 24 | (llms)/utils/create-llm-route.ts:24 | inconsistent | The `.mdx` routes return `markdownResponse(...)`, so they send `text/markdown;charset=utf-8` like the other llms routes. Body unchanged (checked /blog.mdx/hello-world). |
| 25 | (home)/_components/hero.tsx:67 | magic-string | `const [firstName, lastName] = owner.split(' ')` from `@/constants/site`. The h1 `textContent` is `Anirudh  Sriram.` before and after. |

## Narrowed (annotation kept)

| file:line | rule | what changed |
|-----------|------|--------------|
| (home)/contact/actions/contact.ts:13 | magic-string | The time zone now reads `profile.timeZone`. The ' IST' suffix stays: `timeZoneName` cannot be combined with `dateStyle`/`timeStyle`, and en-US prints `GMT+5:30`, so printing it through Intl changes the notification email text (owner call). The annotation is rewritten to cover only the suffix. |

## Skipped (annotation left)

| file:line | rule | reason |
|-----------|------|--------|
| (home)/guestbook/_components/form.tsx:60, entry-card/use-entry-actions.ts:32 (x3), (auth)/account/_components/revoke-session-button.tsx:20 | redundant-refresh | The brief says to drop `router.refresh()` only after confirming in the browser that the UI still updates. The browser pane is signed out, and signing in goes through Google or GitHub OAuth, which I cannot do. The claim checks out on paper (Next docs `02-guides/server-actions.md`: `updateTag` and `revalidatePath` re-render the current route in the action response), but it is not verified, so the calls stay. |
| (auth)/account/page.tsx:14 | magic-string | `pages.account` lives in src/constants (cross-scope, per brief). |
| api/chat/utils/tools/index.ts:9, api/chat/route.ts:131 | duplicate-type / duplicate-logic | `src/lib/ai/chat/types.ts` (cross-scope) takes `typeof tools` from a value export. Inferring `searchDocs` from `ReturnType<typeof createSearchDocsTool>` needs a writer, or a type export that types.ts would have to read. The other agent also touched both files for the celebrate tool. |
| (home)/blog/actions/newsletter.ts:63 | inconsistent-error-handling | If the catch goes and unexpected errors reach `handleServerError`, the visitor sees `UNEXPECTED_ACTION_ERROR` instead of "Something went wrong while subscribing…" (visible). |
| (home)/blog/[slug]/page.client.tsx:147 | magic-string | `PostComments` is called by `src/components/content/mdx/layout.tsx`. Passing the URL in means editing that cross-scope caller. |
| (home)/not-found.tsx:11 | duplicate-logic | The shared metadata belongs beside `NotFoundContent` in src/components (cross-scope). Importing one route file from another repeats the misplaced-module pattern. |
| (home)/search/_components/search-client.tsx:131 | effect-mirrors-state | fumadocs `useDocsSearch` owns its `search` state and takes no initial value (`UseSearchOptions` is only `delayMs`/`allowEmpty`), so dropping the effect means switching to a lower-level hook and re-testing back/forward. Not a small band. |
| layout.tsx:82, contact-form.tsx:136, account-settings.tsx:134, (llms)/utils/profile.ts:10 and :40, resume/page.tsx:25 and :51, resume/layout.tsx:6, guestbook/actions/guestbook.ts:72/84/128, route.ts:53, uses/logo.tsx:16, testimonials.tsx:43, software.tsx:17, stack.tsx:64, blog/page.tsx:23, tags/[tag]/page.tsx:22, blog/[slug]/page.tsx:92, page.client.tsx:19 and :123, header.tsx:10, portrait.tsx:32/35/102, projects/[slug]/page.tsx:22, error.tsx:4, layout.tsx:74, (auth)/layout.tsx:7, contact.ts:7, github-commits.ts:1, the llms-parity rows (contact, colophon x2, experience, skills, testimonials, uses, site-pages) | various | Each needs a new or changed export in src/lib, src/server, src/constants, src/components, src/hooks, tsconfig or styles (cross-scope this round). portrait.tsx:102's other caller is `components/features/blog/author-byline.tsx`. |
| feed/data.ts:62 | unchecked-cast | It spans 8 casts in event.tsx plus a typed payload map. That is a larger band than this pass; it is not blocked and is left for the next round. |
| feed/data.ts:93, (llms)/utils/index.ts:1, header.tsx:1, testimonials.tsx:65 | owner decision | unstable_cache vs use cache, barrels, attribution, autoplay plugin (needs a package.json dependency). |
| resume/page.tsx:123, event.tsx:117, newsletter-form.tsx:34, contributions.tsx:151, entry-card/index.tsx:57, content-index.ts:13, markdown-pages.ts:34 | visible | Changes what a visitor sees (wording, feedback, Save state, hover label, llms text or route names). |
| api/chat/route.ts:72, get-page-content.ts:18, search-docs.ts:12 and :75, about.md/route.ts:12 | behavior | Each changes what the model receives or which messages pass validation (prompt-facing behavior), so it is not a behavior-preserving band. |

## Declined

None.

## Checks

- `bunx tsc --noEmit`: clean (one run showed errors only in `src/components/features/assistant/{header,panel}.tsx` while another agent was mid-edit; clean on re-run, none in src/app at any point).
- `bun run check`: 420 files, no fixes. `bun run check:spelling`: clean.
- sitemap.xml, robots.txt, blog/rss.xml and llms.txt on :3111 are byte-identical before and after.
- `/`, `/about`, `/blog`, `/contact`, `/guestbook`, `/projects`, `/uses`, `/account`, `/search`, `/blog/hello-world`, `/resume`, `/colophon`, `/projects/portfolio` and `/blog.mdx/hello-world` all return 200.

## src/components

# Slopradar resolutions, round 4: `src/components` (except `ui/`)

Line numbers are the `TODO(slopradar)` lines before this pass. Paths are relative to `src/components`. 104 annotations at the start (one in `ui/`), 80 at the end: 24 resolved and removed. Nothing outside `src/components` was edited.

How it was checked: `bunx tsc --noEmit`, `bun run check` and `bun run check:spelling` after each band (all clean at the end). A Playwright script (headless shell, :3111) captured the Simba panel before the first edit and after each band: popup, backdrop, conversation column and input boxes plus computed position, size, border, radius, shadow, transform-origin and z-index, at 1440x900, 1440x600, 800x900 and 375x812, docked, expanded, after Esc and after backdrop and mascot clicks, plus focus return after Esc and the close button. Apart from the fixes below, the only differences are the new `data-expanded`/`data-narrow` attributes on the Popup and the toggle's label. All runs after the third band also show an 11px shift because the page no longer has a classic scrollbar in the headless shell (`clientWidth` 1440 with the panel closed). That comes from the concurrent `src/styles` edits, not this pass.

## Band 1: bug fixes

| File:line | Rule | What changed |
| --- | --- | --- |
| `features/assistant/tools/navigate.tsx:91` | stale-condition (bug) | **Fix.** Navigating while the panel is expanded used to leave the full-screen panel over the new page. Now a docked viewport collapses the panel to its docked size (with the shrink morph), and a narrower viewport closes it, as the sheet did before. Checked: "take me to the projects page" from an expanded panel at 1440x900 lands on /projects with the panel at 360x500, the toggle unpressed, the mascot back and page scroll unlocked. At 800x900 the same request lands on /blog with the panel closed. The `isScrollLocked` comment now says the sheet and expanded panels lock scroll, not only the mobile one. `isDocked` comes from `AssistantProvider` (see band 2). |
| `content/mdx/github-repo.tsx:185` | error-path-throws (bug) | **Fix.** `parseGitHubRepoInput` runs once, before the fetch, and only the fetch is caught (`.catch` logs the same message and returns `null`, and the fallback link gets the parsed repo). A malformed `repo` prop now fails loudly at render time, where before the catch rethrew from the log line. /blog/gorkie-sandboxes renders the same repo link. |
| `layout/header/index.tsx:91` | reduced-motion (bug) | **Fix.** Scroll-to-top on the nav title passes `behavior: prefersReducedMotion() ? 'auto' : 'smooth'` to `window.scrollTo`. Lenis is unmounted under reduced motion, so those visitors always got the native smooth scroll (the JS option overrides the CSS `scroll-behavior: auto !important`). Checked with reduced motion: `scrollY` is 0 within 50 ms of the click. With Lenis mounted nothing changes. `scrollToTarget` (in `src/lib`) was not extended, since it takes an element and lives outside this scope. |
| `features/assistant/panel.tsx:70` | forced-layout (and a bug) | `useMorph` runs only when `[expanded, open]` change, so streamed chunks no longer force a `getBoundingClientRect` per render. The "first" rect is taken by `setExpanded` in `AssistantProvider` just before the state change, and the effect consumes and clears it. **Fix:** before, the first grow after opening had no rect (the popup mounts after the panel's last render) and jumped to full screen with no morph. Now it plays the 380 ms grow (`cubic-bezier(0.2, 0, 0, 1)`, 360x500 to 1440x900, sampled every frame). The 300 ms shrink is unchanged, and reduced motion still skips both. |

## Band 2: Simba panel structure

| File:line | Rule | What changed |
| --- | --- | --- |
| `features/assistant/panel.tsx:163` | duplicate-ref | One `popupRef`, created in `AssistantProvider`, is passed to the Popup's `ref` and read by `useReturnFocus` and `useMorph`. The callback ref that wrote two refs is gone. |
| `features/assistant/panel.tsx:132` | duplicated-predicate | `AssistantProvider` derives `mode` (`'docked' \| 'expanded' \| 'sheet'`) from `expanded` and the one `useMediaQuery(MEDIA.docked)` (moved here from the panel and the navigate tool). The panel reads it for `modal`, `PageScrollLock`, `disablePointerDismissal` and the backdrop. The backdrop's `!expanded && 'lg:hidden'` became `mode === 'docked' && 'hidden'` (lg is 64rem, the same as `MEDIA.docked`). It is computed `display: none` in the same cases, checked at 1440 and 800 wide. |
| `features/assistant/panel.tsx:150` | split-dismissal | One `onOpenChange` owns the policy: Esc or an outside press collapses an expanded panel, and anything else sets `open`. The backdrop `onClick` is gone. `disablePointerDismissal={mode === 'docked'}` keeps the docked panel open while the visitor clicks or tabs around the page (Base UI would otherwise close a non-modal popup on outside press and focus-out). In the modal modes Base UI only counts presses on the backdrop itself. Checked: a page click with the panel docked keeps it open. A backdrop click at 800 wide closes the sheet. A mascot click closes it. Esc shrinks an expanded panel, then closes it. |
| `features/assistant/panel.tsx:157` | override-cascade | The Popup sets `data-expanded`, and the expanded geometry is `sm:data-expanded:*` (inset-0, h-dvh, w-dvw, origin-center, rounded-none, border-0, shadow-none). The attribute selector outranks the docked `sm:` and `sm:[@media(max-height:640px)]:` classes, so the re-declared max-height variants and the `cn` merge are gone. Computed styles match the old ones at 1440x900, 1440x600 (the max-height branch) and 800x900: full screen 1440x900 or 1440x600 when expanded, 360x500 or 360x568 when docked. |
| `features/assistant/message-list.tsx:97` | duplication | New `features/assistant/class-names.ts` `expandedColumn` (`in-data-expanded:mx-auto in-data-expanded:w-full in-data-expanded:max-w-[720px]`), used by the conversation column and the input wrapper. The list no longer reads the assistant context. Both are 720px wide and centered when expanded (x 360 at 1440), and unchanged when docked. |
| `features/assistant/tools/portfolio.tsx:110` | layout-state-leak | `data-narrow` is set once on the Popup (`!expanded`), and the tool part's context read and its comment are gone. The `wide` variant matches any `[data-narrow]` ancestor, so the experience card still keeps its phone layout in the docked panel. |
| `features/assistant/panel.tsx:33` | library-exists | Kept `useReturnFocus` and gave it a one-line reason. Playwright with Base UI's default `finalFocus` returned focus to `<body>` in every case (Esc after a mascot open, Esc after opening with Ctrl+/ from a focused link, close button after expanding, backdrop close). With the hook, focus goes back to the mascot or the link. Nothing opens the panel through a `Dialog.Trigger`, so Base UI has no trigger to go back to. |
| `features/assistant/header.tsx:42` | a11y-toggle | One label, `aria-label='Expand chat'` with `aria-pressed`, so a screen reader hears "Expand chat, toggle button, pressed". Only the accessible name changes, and nothing visible. The click is `setExpanded(!expanded)`, since `setExpanded` now takes a boolean. |

## Band 3: classes, contexts, types

| File:line | Rule | What changed |
| --- | --- | --- |
| `features/assistant/trigger.tsx:24` | dead-class | Deleted `motion-reduce:transition-none` from all nine places in scope: trigger, `blur-image.tsx`, `layout/header/index.tsx`, `features/toc/popover.tsx`, `features/blog/post-row.tsx`, `features/blog/post-filters.tsx`, `ai-elements/tool.tsx` (x2) and `ai-elements/sources.tsx`. The global reduced-motion rule sets `transition-property` with `!important`, so the utility never applied. Checked under reduced motion: the trigger's computed `transition-property` is the global list in both runs. `ui/accordion.tsx` was left alone (excluded scope). |
| `features/assistant/trigger.tsx:23` | arbitrary-value | `active:scale-[0.96]` became `active:scale-96` in all six places (trigger, `layout/footer/sound-toggle.tsx`, `layout/header/theme-toggle.tsx`, `layout/header/mobile/item.tsx`, `mobile/pill.tsx` x2). The computed `scale` while pressed is `0.96`, checked on the mascot (CSS converts `96%` to the number). `ui/button-variants.ts` was left alone. |
| `json-ld.tsx:69` | library-exists | The seven `new URL(x, baseUrl.href).href` became `siteUrl(x)` (`url` from `@/lib/url`), which is the same `new URL(path, baseUrl)` string. `baseUrl` (still used for the `#person`/`#website` ids and the home crumb) is imported from `@/lib/metadata`, not the `@/constants` re-export. Checked: the JSON-LD on /blog/hello-world, /about, /blog/tags/intro and /projects/portfolio has the same ids, URLs and key order. |
| `json-ld.tsx:179` | duplication | `ProfilePageJsonLd` passes `mainEntity: personRef`, which serializes the same as the old literal. |
| `features/auth/sign-in-modal.tsx:61` | inconsistent | `<SignInModalContext value={value}>`. |
| `features/assistant/mascot/provider.tsx:16` | inconsistent | `use(MascotContext)`. |
| `layout/sections/index.tsx:14` | unused-export | `Cross` is module-private, because only `CrossPair` uses it. The og template's `Cross` is its own function. |
| `features/search/utils/groups.ts:46` | over-conversion | `bucketByTag` maps the `Map.groupBy` entries straight to `{ pages, tag }` and stable-sorts once by `tagRank`. `orderTagGroups` is folded in. Same group order: checked "hello" and the empty dialog, which have the same headings and item counts as round 3. |
| `features/search/utils/tags.ts:11` | weak-type | The table is `satisfies Record<string, SearchTag>`. `getTagMeta` looks tags up through an `Object.hasOwn` type guard (so `constructor` and other inherited keys no longer count as tags), and `tagFromUrl` drops the `meta &&` guard. |
| `features/search/dialog.tsx:132` | duplicate-type | The local `CommandItemData` and the `(typeof groups)[number]['items'][number]` spelling were both `CommandItem` from `@/types/search` (already imported as `SearchCommandItem`). Both use it now, and no new export was needed. |
| `features/assistant/tools/contact-form.tsx:28` | boolean-prop | New `ContactFormSent({ data })` and `ContactFormCanceled()`. `ContactForm` takes only `prefill` and `toolCallId`. `ContactFormBody` in `message-list.tsx` picks sent, canceled, the skeleton or the form from the part state. Same markup and text nodes (`name`, ` (`, `email`, `)` and the space before the message). |
| `features/assistant/message-list.tsx:207` | duplication | `eyebrow` in `class-names.ts` is the 11px uppercase label class set, used by the selected-context label (`cn('mb-1', eyebrow)`) and StackGroup's heading (`cn('px-3 py-2', eyebrow)`). Same classes in a different order. |

## Skipped (annotation left in place)

| File:line | Reason |
| --- | --- |
| `numbered-pagination.tsx:86` | `PaginationEllipsis` renders the `moreHorizontal` icon plus an sr-only "More pages" where the page shows three periods. Visible. |
| `smooth-cursor.tsx:143` | The query belongs in `MEDIA` in `src/lib/media.ts` (outside). |
| `ai-elements/prompt-input.tsx:201` | `isChatBusy` would move to `src/lib/ai/chat` (outside). |
| `features/assistant/header.tsx:52` | `IconSwap` cross-fades where the icons swap today. Visible. |
| `features/assistant/text-selection-popup.tsx:72` | The cap has to be enforced on `contextDataSchema` in `src/lib/ai/chat/types.ts` (outside). |
| `json-ld.tsx:159` | Every page call site is in `src/app`. |
| Carried over from rounds 1 to 3, unchanged reasons | The 16 owner decisions (attribution headers, `contributions.tsx` placement, mobile menu focus trap, press scale, barrels, parked rules), cross-scope moves, and the visible or DOM changes listed in SLOPRADAR-RESOLUTIONS.md round 3. |

## Notes for other scopes

- `src/constants/index.ts`: `json-ld.tsx` no longer imports `baseUrl` from `@/constants`. Only `src/app` importers (layout, rss) remain before the re-export can go.
- `src/lib/scroll-to-target.ts`: the header's scroll-to-top still hand-rolls the Lenis-or-native branch, because `scrollToTarget` takes an element. Reading `prefersReducedMotion()` inside it (its own annotation) would let both share it.
- `useAssistantContext().setExpanded` now takes a boolean (not a `SetStateAction`). Nothing outside `src/components` calls it.

## src/lib, src/server, src/hooks, src/contexts, src/constants, src/types, src/env.ts, src/styles

# Slopradar round 4 resolutions: `src/lib, src/server, src/hooks, src/contexts, src/constants, src/types, src/env.ts, src/styles`

Line numbers are the line of the `TODO(slopradar)` comment before this round. 48 annotations in scope before, 34 after.

## Band 1: real bug

| file:line | rule | what changed |
| --- | --- | --- |
| `src/server/comments/moderation.ts:27` | bug | The no-images rule only counted nodes that passed `CommentImageContentSchema` (numeric `width`/`height`, `src` starting with `http`), and fuma-comment's content schema is loose (`{ type: string, text?: string }`, `$loose`), so an image node without a size or with a `data:` or relative `src` got through. `extractContent` now sets `hasImage` on `node.type === 'image'` at any depth, and `moderateComment` rejects on it before any model call. `parseCommentImageNode` and its schema in `src/lib/validators/comments.ts` had no other caller and are deleted. Checked with a `bun test` harness that imports the real `moderateComment` (only `ai`, the provider and the prompt mocked): image nodes with full attrs, without width/height, with a `data:` src, with a relative src and with no attrs are each rejected with "Images are not allowed in comments." both at the top level and nested in a paragraph, without calling `generateText`; a text-plus-mention comment passes and calls `generateText` once. 6 pass, 0 fail. |

## Band 2: library APIs

| file:line | rule | what changed |
| --- | --- | --- |
| `src/lib/is-active.ts:28` | library-exists | The local `isLinkItemActive` and `WithHref` are gone; the file re-exports `isLinkItemActive` from `fumadocs-ui/layouts/shared` (in its exports map). Library source (`dist/layouts/shared/index.js:92`): `type === 'custom'` or no `url` returns false, `active === 'none'` returns false, else `isActive(url, pathname, active === 'nested-url')`, with the same `normalize` and the same match as the local `isActive`. The two callers (`header/link-item.tsx`, `header/mobile/menu.tsx`) only pass items that have a `url` and no `type: 'custom'` (`WithHref`, and `linkItems` plus Home filtered on `'url' in item`), with `active` `'url'` or `'nested-url'`, so every call returns the same value. The callers keep importing from `@/lib/is-active` (they are in `src/components`); once they import from fumadocs-ui directly, the re-export can go. `isActive` stays (used by `mobile/item.tsx` and `footer/active-link.tsx`, with a `nested = true` default the library's lacks). |
| `src/server/db/queries/guestbook.ts:21` | library-exists | `count(guestbookReactions.emoji)` from drizzle-orm replaces `sql<number>\`count(...)\`.mapWith(Number)`; the `sql` import is gone. Checked with `PgDialect.sqlToQuery`: both give `count("portfolio_guestbook_reactions"."emoji")` with no params, both type `SQL<number>`, both decode `'3'` to `3`. |

## Band 3: dead exports, parameters and logging

| file:line | rule | what changed |
| --- | --- | --- |
| `src/lib/reduced-motion.ts:1` | unused export | `REDUCED_MOTION_QUERY` is module-private. |
| `src/lib/ai/chat/types.ts:13` | unused export | `ChatDataTypes` is module-private. |
| `src/lib/og.ts:95` | unused export | `OgFont` is module-private. |
| `src/lib/github-repo.ts:12` | unused export | `GitHubRepoDetails` is module-private. |
| `src/lib/github-code.ts:12` | unused export | `ParsedGitHubFileUrl` is module-private. |
| `src/hooks/use-copy-to-clipboard.ts:13` | unused export | `UseCopyToClipboardOptions` is module-private. |
| `src/lib/github-code.ts:151` | dead parameter | `resolveLanguage(path)` returns `'txt'` inline; the one caller (`content/mdx/github-code.tsx`) never passed `fallback`. |
| `src/constants/portfolio/skills.tsx:158` | dead parameter | `groupTechnologies()` reads `technologies` directly; all three callers already called it bare. |
| `src/lib/safe-action/client.ts:8` | inconsistent error handling | `ActionError` messages are returned without logging; any other error is logged whole (`console.error('Failed to execute action:', e)`, so the stack is kept) and the visitor still gets `UNEXPECTED_ACTION_ERROR`. Same return values. Note: the `ActionError`s thrown for "unavailable right now" (contact and newsletter with missing env) and "Failed to revoke session." were logged before and are not now; the send and subscribe failures still log at their throw sites. |

## Band 4: CSS and file names

| file:line | rule | what changed |
| --- | --- | --- |
| `src/styles/globals.css:149` | fragmented theme | The second plain `@theme` block (fd primary, primary foreground and ring overrides, `--animate-blink`, `--animate-shimmer` and their keyframes) is merged into the end of the first `@theme` block; `@theme static` stays separate. Compiled `globals.css` with `@tailwindcss/postcss` right before and right after the edit: the output is byte-identical (338,777 bytes, empty diff). `bun run build` passes; on localhost:3111 the computed `--color-fd-primary` is `#3451b2`, `--color-fd-primary-foreground` `#fafafa`, `--color-fd-ring` `color-mix(in oklab, #3451b2 55%, black)`, `--animate-blink`/`--animate-shimmer` set, and both `@keyframes` present. |
| `src/constants/portfolio/experiences.tsx:1` | wrong extension | Renamed to `experiences.ts`, and `skills.tsx` to `skills.ts` (the same finding; neither has JSX). The earlier blocker is gone: `scripts/link-previews/config.ts` now scans `src/constants/**/*.{ts,tsx}` instead of listing the files. All importers use extensionless paths; nothing else names the old paths. |

## Skipped (annotation left in place)

| file:line | reason |
| --- | --- |
| `src/hooks/use-near-viewport.ts:3` | Cross-scope. usehooks-ts `useIntersectionObserver` returns a callback ref and owns the element, while this hook takes a `RefObject`, so the hook cannot wrap it; the one caller (`src/app/(home)/blog/[slug]/page.client.tsx`) has to switch to `const { ref, isIntersecting } = useIntersectionObserver({ freezeOnceVisible: true, rootMargin: '100% 0px' })` in the same change that deletes this file. |
| `src/lib/ai/chat/catalog.ts:70` | Cross-scope. `render-portfolio.ts` writes `slugs` in a fresh object literal, so dropping it from `ProjectItem` fails tsc there; making it optional would type a field that is still always written. Drop it from the tool first, then from the Pick. |
| `src/lib/scroll-to-target.ts:6` | Cross-scope. Both callers (`src/components`) pass `{ immediate }`; the only backward-compatible form is an optional option with a default, which adds a second calling shape instead of removing one. Do it together with the callers. |
| `src/types/story.ts:1` | The `IconName` type has to be exported from `src/components/icons/icons.tsx` (out of scope). |
| `src/lib/is-active.ts:10`, `src/lib/github-code.ts:96`, `src/server/db/queries/guestbook.ts:82`, `src/lib/metadata.ts:7`, `src/lib/resend.ts:116`, `src/lib/validators/index.ts:1`, `src/server/db/schema/comments.ts:14`, `:23`, `:41` | Owner decisions 6, 4, 4, 12, 3, 5 and 11 / schema changes (unchanged). |
| `src/lib/auth-client.ts:7`, `src/lib/audio/preferences.ts:76`, `src/styles/globals.css:321`, `:337`, `src/lib/reveal-script.ts:7` | Visitor-visible or audible, or cross-scope (unchanged reasons from round 3). |
| `src/lib/ai/prompts/chat/directives.ts:1`, `src/lib/ai/prompts/chat/tools.ts:1` | Prompt text consolidation (changes what the model reads). |
| `src/lib/github-contributions.ts:5`, `src/lib/ai/chat/types.ts:4`, `:19`, `:22`, `src/lib/source/blog.ts:5`, `src/server/comments/moderation.ts:67`, `src/server/db/queries/guestbook.ts:118`, `src/lib/validators/guestbook.ts:38`, `src/constants/index.ts:3`, `src/constants/site.ts:6` | Cross-scope (unchanged). `src/components/json-ld.tsx` still imports `baseUrl` from `@/constants`; `handle` is still imported by `emails/`. |
| `src/hooks/use-reduced-motion.ts:10`, `src/env.ts:36`, `src/constants/search.tsx:123`, `src/constants/portfolio/intro.ts:3` | Declined in earlier rounds; reasons still hold. |

## Follow-ups for other scopes

- `src/components/layout/header/link-item.tsx`, `mobile/menu.tsx`: import `isLinkItemActive` from `fumadocs-ui/layouts/shared`, then delete the re-export in `src/lib/is-active.ts`.
- `src/app/(home)/blog/[slug]/page.client.tsx`: switch to usehooks-ts `useIntersectionObserver` (above), then delete `src/hooks/use-near-viewport.ts`.
- `src/app/api/chat/utils/tools/render-portfolio.ts:110`: stop writing `slugs`, then drop it from `ProjectItem`.
- `src/components/features/search/dialog.tsx`, `features/assistant/tools/navigate.tsx`: once `scrollToTarget` reads `prefersReducedMotion()` itself, drop the `{ immediate }` argument.

Checks after the last band: `bunx tsc --noEmit` clean, `bun run check` clean (419 files), `bun run check:spelling` clean, `bun run build` passes. Nothing committed.

## emails, scripts, root config

## Round 4: emails, scripts, root config

Line numbers are the line of the `TODO(slopradar)` comment before this pass. Checks after each band: `bunx tsc --noEmit` clean, `bun run check:spelling` clean (also run with `--no-cache`), `bun run check:links` 32 URLs, 0 fallbacks, 0 errors. `biome check` is clean on every file in this scope. `bun run check` fails only on `src/app/(home)/contact/_components/faq.tsx` (format), which another agent is editing; this pass did not touch it.

### Band 1: `.cspell.jsonc`

| File | Rule | What changed |
|------|------|--------------|
| `.cspell.jsonc:5` | dead-config | Removed `pnpm-lock.yaml` and `bun.lockb` from `ignorePaths`; neither file exists. `bun.lock` (tracked) and `plans/reviews/**` stay. Biome collapsed the list onto one line. |
| `.cspell.jsonc:20` | duplication | Removed the exact duplicates `Chánh`, `Camargo` and `Salaja`. For the case pairs `Clippy`, `Daytona`, `Devarsh`, `Gorkie`, `Hugeicons`, `MITTLED` and `Nuqs` only the lowercase entry is left (cspell is case-insensitive by default). `Chanh` is removed as well: matching also ignores accents, so `Chánh` covers it (checked by removing `Chanh` and running cspell: still clean). The list is sorted case-insensitively. |
| `.cspell.jsonc:21` | dead-config | Removed 19 words that `rg -i -F --hidden` (excluding node_modules, bun.lock, .next, .git, plans/reviews and the config itself) finds nowhere: `highp`, `wizardy`, `backflip`, `unrs`, `scira`, `sandboxing`, `Keras`, `Vernie`, `theatrejs`, `Gollum`, `Eververse`, `rebindable`, `corercd`, `trackpad`, `Oiia`, `COOLDOWN`, `HITBOX`, `boing`, `Boing`. `wizardy` was deleted, not corrected: `wizardry` does not appear in the repo either. Also removed 15 words that do appear but that cspell does not flag with an empty `words` list, because its dictionaries or ignore rules already cover them: `apos`, `autoremove`, `chsh`, `devcontainers`, `fract`, `geistmono`, `lefthook`, `mcps`, `nums`, `orama`, `Qwik`, `remark`, `shadcn`, `Turborepo`, `Zaid`. Method: one cspell run with `"words": []` and `--words-only`; every word left in the list is reported as unknown by that run, and every unknown word is covered by the list. 214 entries -> 169. To confirm the run really checks files, removing `gorkie` makes it fail on `content/blog/gorkie-sandboxes.mdx`. |

### Band 2: `next.config.ts`

The LAN `allowedDevOrigins` entries (`'192.168.0.100'`, `'*.local'`) are unchanged. The dev server on :3111 reloaded the config on its own and still serves `/` (200).

| File | Rule | What changed |
|------|------|--------------|
| `next.config.ts:24` | dead-config | Deleted the `raw.githubusercontent.com/Meeting-BaaS/**` remote pattern. `rg -i 'meeting-baas\|githubusercontent' src content emails scripts`: Meeting-BaaS appears only as `github:` frontmatter links and in the previews manifest (github.com URLs). The only raw URL used as an image is `raw.githubusercontent.com/techwithanirudh/...` (`content/work/coolify_tweaks.mdx`), which keeps its pattern. `src/lib/github-code.ts` fetches raw files with `fetch`, not `next/image`. |
| `next.config.ts:53` | stale-comment | Comment reads "Tags are inline filters on /blog, so the tag index redirects there" (no "now", and it names the real destination). `/blog/tags` still answers 308 to `/blog` on :3111. |

### Band 3: scripts

| File | Rule | What changed |
|------|------|--------------|
| `scripts/link-previews/utils.ts:128` | unused-export | `CaptureResult` is no longer exported; it is used only inside `utils.ts`. Biome put the union on one line. tsc is clean. |

### Skipped (annotation left in place)

| File | Reason |
|------|--------|
| `emails/contact-notification.tsx:25`, `emails/newsletter-welcome.tsx:65` | Shared email theme changes how the emails look (owner decision). |
| `scripts/generate-portrait.ts:5` | Portrait output path; the check means regenerating a file in `src/`, which is off limits (owner/cross-scope). |
| `scripts/link-previews/config.ts:67` | Where the shared work links schema lives is an owner call; `source.config.ts` may only export collections. |
| `next.config.ts:39` | `SOURCE_MAPS`/`ANALYZE` env move is an owner decision and needs an edit to `src/env.ts`. |
| `next.config.ts:101` | Build gate (`ignoreBuildErrors`), owner decision 1. |
| `biome.jsonc:28` | Disabled rules need an owner-written reason, or a separate change that turns them on. |

Counts: 6 resolved (3 in `.cspell.jsonc`, 2 in `next.config.ts`, 1 in `scripts`), 6 skipped, 0 declined. `lefthook.yml` has no annotations.

# Bugs found after round 4: focus ring

| File | Cause | Fix |
|------|-------|-----|
| `src/components/layout/sections/more-link.tsx` (SectionMoreLink: "View all posts", "View all projects", Simba's MoreLink card) | The keyboard focus ring was a 3px `ring-inset` box shadow in `primary-foreground`. That color matches the page instead of the bar: rgb(26, 26, 30) in dark mode against the dark page, rgb(250, 250, 250) in light mode against the rgb(245, 245, 245) page. Drawn flush at the bar's edge, it read as the bar getting smaller, not as focus (checked with keyboard Tab in both color schemes). | Replaced `ring-inset focus-visible:ring-primary-foreground` with `focus-visible:ring-0 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-primary-foreground focus-visible:-outline-offset-6`: a 2px outline 6px inside the bar, painted above the gradient layers. Contrast against the bar fill: about 8.6:1 in dark mode (rgb(26, 26, 30) on rgb(168, 177, 255)) and 6.8:1 in light mode (rgb(250, 250, 250) on rgb(52, 81, 178)). The box stays 1278x64 at 1440px, and hover and active classes are unchanged. |

# Bugs found after round 4: stack chip rings

| File | Cause | Fix |
|------|-------|-----|
| `src/components/ui/badge.tsx` (Stack chips on `/about`, which render Badge as an `<a>`) | On keyboard focus the chips drew two rings at once. Badge's base classes added `focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50` (a 3px box-shadow ring flush with the border, and the 1px border recolored to the ring color), and the global `:where(a[href], ...):focus-visible` rule in `globals.css` also drew its 2px outline at a 2px offset. Measured with keyboard Tab at 1440x900, 2x: border 1px, box-shadow `0 0 0 3px` ring/50, outline 2px solid at offset 2px. The two bands overlap, so the focus ring looked about twice as thick as on every other link. At rest the chip is a normal 1px border with no shadow and no outline, so the resting outline was not doubled. | Removed `focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50` from the Badge base and `focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40` from the destructive variant. A focusable Badge now gets only the site's global 2px outline, like every other link. The `aria-invalid` ring classes are unchanged. Focus does not change the box size, so the layout does not shift. The chips keep their pill shape on focus because `rounded-full` overrides the zero-specificity `:where` border-radius. |

# Owner decision: THIRD_PARTY_NOTICES.md deleted

| File | What changed |
|------|--------------|
| `THIRD_PARTY_NOTICES.md` | Deleted by owner decision. The in-file "adapted from" and copyright headers stay as the only credit. |
| `.agents/skills/slopradar/SKILL.md`, `reviewer-brief.md` | Reviewers no longer read the notices file; the repo rules are `.claude/CLAUDE.md` and `biome.jsonc`. |
| `blog/[slug]/_components/header.tsx:1`, `blur-image.tsx:4`, `layout/header/index.tsx:39`, `features/toc/popover.tsx:16` | Dropped the "add a THIRD_PARTY_NOTICES.md entry" part of each `TODO(slopradar)` attribution note. The header.tsx note asked only for that entry, so it is gone; the other three still ask for an in-file source header or a header move (owner decision 6). The braydoncoyer, Delba and other credit lines are unchanged. |
| `plans/reviews/SLOPRADAR.md` | History kept as written; owner question 6 notes the deletion. |

# Bug: "Could not load sessions" on /account

Cause: better-auth 1.7.10's `/list-sessions` (and revoke) run behind `freshSessionMiddleware`: a session is "fresh" for `freshAge` (24 hours by default) after it was created. Normal use extends a session's expiry but never resets its creation time, so any signed-in session older than a day got a 403 `SESSION_NOT_FRESH` and the Active sessions card fell into its generic error state. A read-only DB check showed 3 active sessions at 16.8h, 51.9h and 120.6h.

Fix: `src/server/auth/index.ts` exports `isSessionNotFreshError` (an `isAPIError` check on `body.code === 'SESSION_NOT_FRESH'`, not message text); `active-sessions.tsx` now shows "For security, sign in again to view your sessions" with a Sign in link (`/account?signin=%2Faccount`) for that case and keeps the generic card, with its log line, for every other failure. `freshAge` stays at the default so revoking sessions keeps its protection. Verified the detector against a real `APIError` (SESSION_NOT_FRESH true, another code false, a plain Error with the same message false, status 403); the card itself was not rendered with a stale session because that needs a signed-in account.

# Bugs found after round 4: search gap and stuck preview card

| File | Cause | Fix |
|------|-------|-----|
| `src/app/(home)/search/_components/search-client.tsx` | `[&>div]:!pt-2` gave the result list 8px of top padding, so the first row sat 8px under the tab row, and the skeleton's `p-1` made it jump 4px when the results replaced it. An interrupted edit had also lost a space, so `[&>div]:!p-0` and `max-h-none` merged into one class that did nothing. | Dropped `!pt-2` and the skeleton's `p-1`, restored the space, and changed CenteredEmpty to `min-h-[100cqh]` because its `-0.5rem` was there only to offset the padding. Measured at 1440x900 and 2x: the skeleton's first row and the first result both start at 367, flush with the tab row (before: 371 and 375). The empty state is centered, and the top fade mask still runs from 0 to 40px when the list scrolls. |
| `src/components/preview-link.tsx` (HoverPreviewLink) | The popup is rendered only once the page preview fetch has resolved. When focus or hover opened the Root and left before that, the Root closed with no popup element. Base UI 1.9.0's `useAnimationsFinished` returns early for a null element, so the close never completed (`onOpenChangeComplete(false)` never fired) and the Root stayed mounted in its ending state. When the fetch landed, the popup mounted into that state as `data-closed data-ending-style`. Its exit animation does not hold its final frame, so the card stayed visible at full opacity. Depensa was the slow first request. A failed fetch also stayed cached as null for the whole session. | The Root is controlled with `open={wantsOpen && Boolean(popup)}`, so it opens only once there is a popup to animate. A fetch that lands after blur or mouse leave mounts nothing. Network errors and non-404 failures are now removed from the cache and resolve to undefined, so the next open retries. A 404 still caches as null, meaning "no preview". |

# Simba mascot art

The mascot now draws the QuiverAI sheet (`simba-states/simba-spritesheet-more-states-v2-idle-tweens-anchored.svg`) instead of the older hand-rigged parts. The old `rig-art.ts` shared no paths with the sheet, so the redrawn poses could not be added on their own: Rest, the in-between frames and the idle frames are all drawn from the sheet's side-sit Rest, so every pose now comes from the sheet. Which pose plays when is unchanged; only the sprite behind each pose name changed.

| File | What changed |
|------|--------------|
| `mascot/rig-art.ts` | Generated from the sheet: `RIG_DEFS` (70 shared parts, prefix `r_r_au__` dropped) and `SPRITES` (23 sprites). Dropped the sheet's `<style>`, every `class`/`style` animation hook, the frames that start hidden (`opacity:0`), the frame dots, labels, ground ellipses and "z" text. Numbers with more than 3 decimals are rounded to 3; path data was already 1 decimal. Each sprite is moved so it stands on the rig's ground point (69, 220). The sheet's 1.1x display scale on the later sections and the anchored file's extra offsets (9.16, 6.68, -3.96 and so on) are dropped: the parts are drawn at the first row's scale, and with those offsets Rest no longer lined up with its own idle and in-between frames. The eye part gets a clip and a `--look-x/--look-y` pupil shift, so the pointer look still moves the pupils. Attribution header kept. |
| `mascot/constants.ts` | `Pose` is now `{ sprite, flip? }` or `{ hidden }`. rest=RestPose, attention=GetAttention (new raised paw), bashful=Embarrassed, curiousRight=CuriousTilt, curious=CuriousTilt mirrored, focus=Show.. (presenting arm), greet=Waving, lookUp=IdleLookAround, playful=Excited, pleased=Happy, searching=Searching, surprised=Surprised, thinking=Thinking. Animations and triggers are unchanged. |
| `mascot/use-sprite-frames.ts` (new) | Steps through the sheet's in-between frames, 80 ms each: Rest to Happy (1, 2), Rest to Waving (1, 2), Rest to CuriousTilt (1, 2), and back the other way on return to rest. While the pose is rest, it plays an idle loop every 4 to 9 s (random): breath in then out (700 ms each, about 1.4 units of chest lift and 1.5 units of head lift), an ear twitch twice, a weight shift (1.2 s) or a slow blink (450 ms). Each loop ends on Rest. There is no idle loop and there are no in-between frames with reduced motion or on `still` copies (chips). |
| `mascot/rig.tsx` | Renders the scoped defs plus the current sprite. The head is wrapped in `.simba-look`, which follows `--look-tilt`. Changes without in-between frames keep the old squash "pop", and `hidden` keeps the old fade and scale-out. The `muzzles` TODO no longer applies: the muzzle tuple is gone. |
| `styles/simba.css` | Removed the old part classes (hair, silk, earline, toe, fade, head, tilt, ears, the infinite breathe, blink and twitch). Added `.simba-look` and `.simba-wave` (Waving's arm keeps the old 0.45 s wave). The reduced motion block is unchanged. |

Not wired: Sad and Sleeping (with RestToSleeping 1 to 3). No existing pose or trigger means sad or asleep, and the task was not to change what triggers when. Wiring either one takes a pose entry plus an animation that uses it; the extractor (kept outside the repo) can add their sprites.

Not seamless: RestToWaving-2 still has the side-sit body and neutral head, so the step to the final Waving pose (front sit, relaxed head) moves the head about 9 units (about 4 px at the 88 px trigger) and swaps the body. The in-between frames only lead to the unmirrored tilt; mirrored `curious` swaps straight over with the pop. Rest's side sit sits about 10 units left of the front-sit poses, so swaps without in-between frames (Rest to Thinking, for example) still shift sideways, as they did before.

Sizes of `rig-art.ts`: 26,106 B (8,811 B gzip) before, 44,155 B (11,156 B gzip) after. The new file holds 23 sprites (12 poses, 5 idle frames, 6 in-between frames) against 3 full poses plus parts before.

# Bug: "Ask Simba" popup too easy to trigger

Cause: `TextSelectionPopup` showed the button for any non-empty selection inside `#main-content`. Rapid clicks on the hero portrait (a `<button>` inside the h1) extend into the neighboring words, and a triple click selects the whole name line, so bonking the avatar produced an "Ask Simba" button above the name.

Fix (`src/components/features/assistant/text-selection-popup.tsx`): a selection is ignored when its pointer-down started on a control (button, input, textarea, select, summary, role=button, contenteditable) or when it intersects one; links stay selectable. A keydown clears that state so keyboard selections work. The popup also waits 200 ms for the selection to settle (instead of one animation frame) so click bursts do not flash it. Verified in a browser: 10 bonks give no popup and no selection, a triple click on the name line gives none, a dragged sentence and a double-clicked body word still show the button, and a selection made after a keydown shows it.

# Form error shake

Every failed submit now shakes each invalid field once: `FormControl` in `src/components/ui/form.tsx` runs a 380 ms `translateX` animation (0, -6, 5, -4, 3, -2, 0 px, transform only) when `submitCount` changes and the field has an error, so contact, newsletter, guestbook, account and the assistant's contact form all get it. It replays on every failed submit, never fires while typing, and is skipped under `prefers-reduced-motion` (the red state stays). Focus still moves to the first invalid field. Verified on /contact: after submitting the empty form all three controls ran the animation (about 5 px transform mid-shake) and focus landed on Name, typing in an invalid field ran none, a second failed submit replayed it, and with reduced motion nothing ran. The better-ui skill does not specify a shake, so the timing is the coordinator's default (about 380 ms, a few px, decaying).

# Interface copy audit (better-writing)

Scope: buttons, links, form labels, placeholders, validation and action errors, toasts, empty states, the Simba panel, the sign-in modal, the account page, the 404 and error pages, aria-labels (read only) and metadata. Voice kept: Simba's lowercase copy, the portrait bonk toasts, "Simba ate this page", the welcome email and every content/bio/prompt file are untouched.

Fixed:
- Validation errors now say how to fix (`src/lib/validators/contact.ts`, `account.ts`, `guestbook.ts`, `newsletter.ts`): "Please provide a valid email address." to "Enter an email address like name@example.com." (the newsletter now uses it too instead of zod's default), "Name must be at least 2 characters." to "Enter a name with at least 2 characters.", "Message must be at least 30 characters." to "Write a message with at least 30 characters.", the max-length messages to "Shorten your ... to N characters or fewer." ("under 5,000" was also off by one: 5,000 is allowed), the account name to "Enter a display name.", the guestbook signature errors to "Your signature couldn't be read. Clear it and sign again." and "...too detailed to save. Clear it and sign with fewer strokes."
- Action errors with no recovery: contact unavailable/failed now point to hello@imanirudh.com (read from `email` in `src/constants/site.ts`), newsletter "Something went wrong while subscribing. Please try again." to "You're not subscribed yet. Try again in a few minutes.", guestbook "Unable to edit/delete this message." to "Couldn't update/delete this entry. Refresh the page and try again.", "User not found." to "That account doesn't exist anymore. Refresh the page.", moderation fallback to "Couldn't run the safety check on your entry. Try again.", "Failed to revoke session." (action and button), "Failed to update name.", "Could not load sessions.", "Sign in failed. Please try again." and the 429 toast now each name a next step. "Please" cut from routine copy (bot check, contact hint "Use at least 30 characters.").
- Terminology: "Log out" (account page, user menu, command menu) to "Sign out" to pair with "Sign in" (command menu keeps `log out`/`logout` as keywords); the guestbook object is "entry" everywhere ("No messages yet." to "No entries yet. Sign the guestbook to leave the first one.", error fallbacks, "Sign in to leave a guestbook entry."); the account field is "Display name" in the field, dialog title, label and toast.
- Labels: guestbook "Submit" to "Post entry", reaction "Add" to "React", delete dialog body to "This permanently deletes {name}'s entry. You can't undo this.", guestbook load error to "...Refresh the page in a bit.", edit no-op toast to "No changes to save." (the empty case is caught by the schema first), placeholders "jane@acme.com" to "jane@example.com" and "Your name" to "Jane Smith", 404 "Notes and write ups" to "write-ups".
- Aria (files the accessibility agent had not touched): Simba header "Close" to "Close Simba", mobile menu "Open assistant" to "Ask Simba".

No llms change was needed: no page content, `pages` constant or metadata text changed.

Verified in the browser: /contact empty submit shows the three new errors and placeholder, /guestbook signed out shows "Sign in to leave a guestbook entry." and "React", the 404 shows "Notes and write-ups". Not verified in the browser (needs a signed-in session): the account page, user menu, guestbook edit/delete/ban toasts.

Owner decisions (not changed): Simba's empty state "heya! im simba" (missing apostrophe, likely intentional dog voice); "Take me home" (404) vs "Go home" (error page); newsletter placeholder "Email address" doubles as the only visible label; toast end punctuation is mixed ("Link copied" vs "Session revoked."); account "Edit" and session "Revoke" buttons rely on row context; `github-code.tsx` "Unable to load source snippet from {url}" gives no next step; aria-labels left for the accessibility agent: blog "Share" (could be "Share post"), mermaid "Diagram", `ui/pagination.tsx` lowercase "pagination".

# Simba poses: extra leg and tool poses

## Extra front leg

Cause: the sheet draws some raised paws on a body that keeps both front paws on the ground, so Simba shows three front legs (four in Books). In the shipped sprites that was GetAttention (`attention`, the `sit` body plus the bent paw), both Rest to Waving in-between frames (the side sit plus a shapeless curl in frame 1, the side sit plus the wave arm in frame 2, played on the way into and out of `greet`) and Books (`sit` plus two paws holding the book). Waving, Show.., Thinking and Excited were already right: they use the sheet's `onePawSit` or `moreLiftedSit`. The sheet's own Greet, ClickedOn and Congratulate cells have the same flaw, but the site does not ship them (the site's ClickedOn animation is Surprised then Happy, with no raised paw).

Fix (in the extractor, so `rig-art.ts` stays generated):

| Sprite | Before | After |
|--------|--------|-------|
| `getAttention` | `sit` + bent paw | `onePawSit` + bent paw |
| `books` (new) | `sit` + 2 holding paws | `moreLiftedSit` + 2 holding paws |
| `waving2` | `sideSit` + wave arm | `sideSitOnePaw` + wave arm |
| `waving1` | `sideSit` + shapeless curl | `sideSitOnePaw` + GetAttention's bent paw, halfway up |

`sideSitOnePaw` is a new part, derived from `sideSit` the way the sheet derives `onePawSit` from `sit`: the near leg's outline rounds off into the belly, its fur lines and ground paw go, and the far paw, chest and hind side are untouched. The in-between frames into Waving are kept (lift a bent paw, then raise it open), not replaced by a crossfade, since both frames now read. No other transition into a raised paw has in-between frames (GetAttention, Show.. and the others swap with the pop). No shared part was edited in place, so Sleeping (not shipped) is unaffected.

Sizes of `rig-art.ts`: 44,155 B (11,163 B gzip) before, 46,452 B (11,472 B gzip) after, for the new `sideSitOnePaw` part and the new `books` sprite.

## Searching and Books during tool calls

`useMascotPanel` (`mascot/hooks.ts`) now picks the activity from the last part that shows progress (text, reasoning or a tool call), skipping step boundaries and the source parts a search writes. While that part is a tool call, `toolAnimations` (`mascot/constants.ts`) picks the animation: `searchDocs` plays Searching, `getPageContent` and `renderPortfolio` play the new Reading (the Books sprite), and the other tools keep `animations.tool` (Searching), as before. A call that errors plays Thinking. The pose holds until the model writes, thinks or calls another tool, so a step boundary between tool calls no longer flips him to Writing for a frame, and two calls of the same tool in a row keep one pose. Thinking with no tool in flight, the post-answer return to rest, the open and close animations and the 404 Sniffing loop are unchanged. The idle loop only runs on the rest sprite, so it never runs during these poses.

Reduced motion: the controller used to ignore every animation and keep Simba on rest. It now holds the first pose of the current activity as a still (Listening, Thinking, Searching, Reading, Writing), with no frame cycling, no in-between frames, no idle loop and no pop, and rests otherwise.

Verified on the dev server with the real model: "search the site for gorkie" ran searchDocs, then navigate (Searching from 1.58 s to 4.0 s, then Writing, then rest); "summarize his blog post about vscode setup" ran getPageContent (Books from 1.34 s to 2.55 s, then Writing, then rest); a search, think, search chain went Searching, Thinking, Searching. No console errors; the 404 loop still cycles; mobile at 390x844 still has no floating mascot.

# Simba: no hand poses

Owner decision after the extra-leg fix: no hand-based art at all. Every pose now keeps both front paws on the ground, except Books (`reading`), where both paws hold the book and nothing is waved.

Removed sprites: `waving`, `waving1` and `waving2` (Rest to Waving), `getAttention`, `show` (Show.., the presenting arm) and `excited` (both paws up). `thinking` kept its head and thought bubble but moved from `onePawSit` plus `chinPaw` to the plain `sit`, so the chin paw is gone. Parts that became unused drop out of `RIG_DEFS` on their own: `onePawSit`, `sideSitOnePaw` (no longer built), `waveArm`, `shortArm`, `getAttentionPaw`, `presentingArm`, `chinPaw`, `happyHead` and `relaxedHead` with their muzzles. `moreLiftedSit` stays for Books, which reads as a dog holding a book with two front limbs and no planted front paws. The extractor (scratchpad `mascot2/work/extract.py`) no longer lists those cells, drops `add_one_paw_side_sit`, `HALF_RAISED` and the wave-arm wrapper, and its `paws_down` step does the Books and Thinking body swaps. `.simba-wave` and its keyframes are gone from `styles/simba.css`.

`rig-art.ts`: 46,452 bytes (11,652 gzip) before, 38,215 bytes (9,839 gzip) after; 24 sprites and 74 defs before, 18 sprites and 63 defs after.

The triggers and the controller timing are unchanged; only the art each one plays changed. `Pose` gains an optional `motion` (`hop`, `nod`, `twitch`), a CSS loop on top of the sprite that the rig sets as `data-motion` (never on `still` copies or with reduced motion). The motions use the individual `translate` property, or `transform` on the head group, so they add to the pop, the flip and the look tilt.

| Trigger | Before | After |
| --- | --- | --- |
| Greet (idle) | Waving, raised paw rocking | `nodding`: Happy with a small head nod (2.5 units, 380 ms), then Happy |
| GetAttention (idle) | GetAttention paw, Waving, GetAttention paw | `earFlick` (the idle ear twitch frame) twice on rest's body, then CuriousTilt through the sheet's in-between frames |
| Listening (message sent) | GetAttention paw, Show.. presenting arm, Happy | `listening`: CuriousTilt with two quick head flicks, then Happy |
| Writing (model writes) | Show.. presenting arm, Thinking, Show.. | `nodding` (Happy with a nod, as if talking), Thinking, `nodding` |
| Play (idle) | Excited, both paws up | `hopping`: Happy with a 10 unit hop every 520 ms; the shadow stays on the ground |
| celebrate tool (confetti) | Searching (the default tool pose) | new `Celebrate` in `toolAnimations`: `hopping`, then Happy |
| ClickedOn (opening the panel) | Surprised, then Happy | unchanged: Surprised with the squash pop, then Happy |
| Thinking, Sniffing (404) | Thinking with a chin paw | Thinking on the plain sit, paws down |

Changing between rest's side sit and the idle frames drawn on it (`earFlick` and rest) no longer pops, since only an ear moves (`sameBody` in `use-sprite-frames.ts`).

No user-facing copy, llms text or Simba prompt mentions waving or a raised paw, so no copy changed.

Verified on the dev server (GIFs and a 4x contact sheet of all 18 remaining sprites in the scratchpad `mascot3/`): the real model's "search your docs…" (Listening tilt, Searching, nodding, rest, close) and "throw confetti" (Listening, hopping, nodding); clicking the floating mascot (Surprised then Happy, or Happy); each remapped animation forced through the controller; the 404 Sniffing loop (Searching, mirrored and unmirrored tilt, Thinking); and the search prompt with reduced motion (still poses, no motion attribute). Mobile at 375 px still has no mascot. `tsc`, `bun run check`, `check:spelling` and `build` pass.

Not seamless: there is no ear perk on Happy, since the ears are part of the head drawing and the sheet has no front-sit ear frames, so the greeting is a head nod only. GetAttention's ear flick runs on rest's side-sit body, so it only reads as an ear flick when he starts from rest (he does, since it is an idle animation). Thinking, Surprised and the other front-sit poses still swap from rest's side sit with the pop and a small sideways shift, as before.

# Accessibility audit (better-accessibility)

Scope: `src/app` and `src/components` read against the skill's checklist, plus a headless Chromium pass on the dev server: every main route (home, about, projects, /projects/depensa, blog, /blog/vscode-setup, contact, guestbook, uses, colophon, /search?q=anirudh, the 404, /account signed out, `?signin=%2F`), the Simba panel (docked, expanded, the mobile sheet), the command palette (Cmd+K), the user, share and view-options menus, the "On this page" bar and the 2xl minimap, hover previews, and the mobile pill and menu at 390x844. Keyboard only (Tab, Shift+Tab, Enter, Escape, arrows), axe-core 4.10.2 (WCAG 2.0 to 2.2 A/AA plus best practice) in light and dark, aria snapshots, a 320px reflow pass, 200% text, and a focus-obscured pass under the sticky bars. Off limits and untouched: the mascot folder, `simba.css`, `text-selection-popup.tsx`, `preview-link.tsx`, `hover-card.tsx`, `carousel.tsx`, the icon mix and the prompt-input preventDefault.

What already held up: skip link first and working, a visible ring at every Tab stop, focus traps and focus return in the sign-in modal, command palette, mobile menu, user menu and the expanded or mobile Simba panel, labeled forms with `aria-invalid`, inline errors and focus on the first invalid field, `role='log'` on the chat, reduced motion handled globally and in every JS animation, no reflow loss at 320px, no `maximum-scale`, and no `aria-hidden` on focusable elements.

## Fixed

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| HIGH | `src/app/(home)/_components/testimonials.tsx:91,102,107` | The auto-advancing carousel had no focusable element, so its arrow keys were unreachable, the third testimonial could only be reached by waiting (never with reduced motion, which stops the autoplay), and the region had no name | The region is a tab stop named "Testimonials"; focus pauses the autoplay (already wired) and ArrowLeft/Right move it; slides are named "1 of 3" and so on | 2.1.1 Keyboard: a pointer (drag) path with no keyboard path |
| MEDIUM | `src/components/features/toc/popover.tsx:166` | The trigger's name was "0.16666666666666666 On this page setup at a glance": the progress ring was a `role='progressbar'` inside the button, so its value joined the name | Ring is `aria-hidden`; name is "On this page setup at a glance" | 4.1.2 Name, Role, Value |
| MEDIUM | `src/components/features/toc/popover.tsx:70` | Escape did nothing while the list covered the article | Escape closes it and returns focus to the trigger | APG: Escape dismisses what opened last; focus stays on a visible element |
| MEDIUM | `src/components/page-actions.tsx:160`, `src/app/(home)/blog/[slug]/page.client.tsx:59` | `finalFocus={false}` on the View options and Share menus, so Escape left keyboard users on `<body>` | `finalFocus` returns focus to the trigger only for a keyboard close; mouse closes keep the old behavior | 2.4.3 Focus Order: focus restored to the trigger |
| MEDIUM | `src/components/features/assistant/panel.tsx:65` | With the docked panel open and focus on the page, Escape closed it and pulled focus from where the user was onto the Simba button | Focus stays put when it is outside the panel; closing from inside still returns to the opener | 2.4.3 Focus Order |
| MEDIUM | `src/components/layout/footer/sound-toggle.tsx:23` | `aria-label` swapped between "Mute sounds" and "Turn sounds on" and `aria-pressed` was set too, so with sound on it read "Mute sounds, pressed" (as if muted) | `aria-pressed` dropped; the label names the action (and matches the tooltip) | 4.1.2: the announced state contradicted the real one |
| MEDIUM | `src/app/(home)/search/_components/search-client.tsx:105,203` | Arrow keys moved the highlighted result from a document listener, but the input was a plain textbox named only by its placeholder, so screen readers never heard the highlight; the result count was not announced | The input is a combobox (`aria-controls='fd-search-list'`, `aria-activedescendant` on the highlighted `fd-search-option-*`, `aria-expanded`) named "Search posts and projects"; a status region, rendered empty first, reads "N results" (the empty state's own status covers zero); the visible count is `aria-hidden` so it is not read twice | 4.1.2, 4.1.3 Status Messages; a placeholder is not a label |
| MEDIUM | `src/components/features/search/dialog.tsx:159,341` | The spinner, the result list and "No results for ..." changed silently while focus stayed in the input | An sr-only status region reads "Searching…", "N results" or "No results" | 4.1.3 Status Messages |
| MEDIUM | `src/components/content/mdx/github-code.tsx:68` | `lang` in `codeblock` was spread onto the `<figure>` as `lang="json"` (axe `valid-lang` on /blog/vscode-setup) | Only the highlighter gets `lang` | 3.1.2 Language of Parts: screen readers switch voice on `lang` |
| MEDIUM | `src/styles/globals.css:156` | Below 2xl the sticky "On this page" bar (56 to 96px) sat over `scroll-padding-top: 64px`, so a heading link reached with Shift+Tab was fully hidden behind it (measured at 64 to 92px) | `html:has([data-toc-popover])` pads 104px, back to 64px at 2xl where the bar is hidden; anchor jumps also land below the bar now | 2.4.11 Focus Not Obscured |
| MEDIUM | `src/components/features/assistant/tools/contact-form.tsx:137,157` | Simba's contact form name and email had no `autocomplete` (the /contact form does) | `autoComplete='name'`, `autoComplete='email'`, `spellCheck={false}` on email | 1.3.5 Identify Input Purpose |
| MEDIUM | `src/components/features/assistant/tools/contact-form.tsx:193` | A send failure rendered as plain text, not announced | `role='alert'` (form-level failure, not tied to a field) | 4.1.3 Status Messages |
| LOW | `src/app/(auth)/account/_components/account-settings.tsx:135` | Display name had no `autocomplete` | `autoComplete='nickname'` | 1.3.5 |
| LOW | `src/components/ui/alert.tsx:36` | Every Alert was `role='alert'`, so the success messages on contact, newsletter and guestbook interrupted like errors | `role='status'` for `variant='success'`, `alert` otherwise; callers can still override | Live regions: assertive is for errors |
| LOW | `src/components/features/assistant/input.tsx:206` | Remove-context button was the bare 14x14 icon | A pseudo element makes the target 24x24 (stops short of the textarea below; verified a click 4px outside the icon removes the context) | 2.5.8 Target Size (Minimum) |
| LOW | `src/components/features/work/work-card.tsx:81` | Card links read "Depensa Depensa The expense tracker…": the thumbnail's alt repeated the heading | `alt=''` | Alt by purpose: redundant with adjacent text |
| LOW | `src/app/(home)/_components/contributions.tsx:95` | `aria-label='GitHub contributions graph'` sat on a plain div, which cannot be named, so it was dropped | `role='figure'` carries the name; the summary and legend inside still read | ARIA: naming the generic role is prohibited |

Aria strings set: "Testimonials" (carousel region), "1 of 3" etc. (slides, `${index + 1} of ${testimonials.length}`), "Search posts and projects" (search page input). Screen-reader-only status text: "N result(s)" (search page), "Searching…", "No results", "N result(s)" (command palette). No visible copy changed.

## Needs a decision

| Severity | Location | Before | After (proposed) | Why |
| --- | --- | --- | --- | --- |
| HIGH | `src/components/features/toc/minimap.tsx:40` | The 2xl minimap is a button named "Open table of contents" whose card opens on hover or focus; Enter does nothing and Tab skips the card's links | Make it a Popover (click or Enter opens, focus moves into the list, Escape returns) or drop the button role and keep the "On this page" bar at 2xl. It is built on `hover-card.tsx`, which this pass leaves alone | Pointer path with no keyboard path (2.1.1); the heading anchors still reach each section |
| MEDIUM | `src/app/(home)/_components/testimonials.tsx:71` | Autoplay every 2.5 s, paused only by hover or focus, no visible control | Add a visible pause/play button (and prev/next) or stop the autoplay | 2.2.2 Pause, Stop, Hide |
| MEDIUM | `src/app/(home)/_components/hero.tsx:69`, `src/app/(home)/about/_components/hero.tsx` | The bonk portrait button sits inside the h1, so the heading reads "Anirudh Portrait of Anirudh Sriram Sriram." and "About Portrait of Anirudh Sriram me." | Move the button out of the h1 (visually overlaid), or give the button a short name; a heading `aria-label` is uneven across screen readers | 1.3.1 / 2.4.6 heading names |
| MEDIUM | Systemic: `sign-in-modal.tsx:147`, `contact-form.tsx:143`, `newsletter-form.tsx:77`, `guestbook/_components/form.tsx:192`, `account-settings.tsx:151`, `assistant/tools/contact-form.tsx`, `reactions.tsx:120`, `revoke-session-button.tsx:32`, `page-actions.tsx:84` | Buttons get native `disabled` while their request runs, which drops focus to `<body>` when the focused button disables | Base UI `focusableWhenDisabled` (renders `aria-disabled`) plus an `aria-disabled:opacity-50` style in `button-variants.ts`, with the handlers already ignoring repeats | Forms reference: native disabled on the focused button loses focus |
| MEDIUM | `src/lib/toast.ts`, `src/components/ui/sonner.tsx` | Error toasts ("Couldn't sign you in…", "Couldn't copy the link…") auto-dismiss after Sonner's 4 s | `duration: Infinity` (or a close button) for `toast.error` | Timed UI: errors stay until dismissed |
| MEDIUM | `src/app/(home)/guestbook/_components/reactions.tsx:118` | "You reacted" is a primary border and text color only (aria-pressed covers screen readers) | Add a non-color cue (filled background, weight or a check) | 1.4.1 Use of Color |
| LOW | `src/components/layout/site-shell.tsx:13` (fumadocs `HomeLayout`) | The header and footer render inside `<main id="nd-home-layout">`, so there is no banner or contentinfo landmark and everything is "main" | Needs a layout change upstream of fumadocs' `HomeLayout`, or a custom layout | Landmarks are navigation |
| LOW | `src/components/shader/grain-backdrop.tsx:74` | The grain gradient animates forever (stops under reduced motion) | Pause control, or stop after a few seconds | 2.2.2 (decorative motion, arguable) |
| LOW | `src/components/layout/footer/clock.tsx:94` | A button with no action whose name is the time and changes every second | A non-interactive `<time>` with the tooltip on focus, or a static name ("Local time") | 4.1.2: a button should do something |
| LOW | `src/app/(home)/guestbook/_components/entries.tsx:37`, `src/app/(home)/search/_components/search-client.tsx` (ScrollArea) | The Base UI scroll viewport is a tab stop with no name | Pass `aria-label` and `role='region'` to the viewport (needs a `viewportProps` on `ui/scroll-area.tsx`) | Focusable regions need a name |
| LOW | `src/components/layout/header/mobile/pill.tsx:36` | The mobile pill (Search, Home, About, Projects, menu) is outside any landmark (axe `region`) | Render the wrapper as `<nav aria-label=...>` | Landmarks |
| LOW | `src/components/features/auth/sign-in-modal.tsx:85` | Opened from a URL (`?signin=`), Escape leaves focus on `<body>` (no trigger exists) | Focus `#main-content` after close | Focus return to the nearest logical container |
| LOW | `src/components/search-redirect-input.tsx:77` | Submit search is disabled until there is text | Keep it enabled and ignore empty submits | Do not gate submit |
| LOW | `src/components/ui/form.tsx:146` | `aria-describedby` always lists the `-form-item-description` id, which no field renders | Add the description id only when a FormDescription exists | ARIA references to missing ids |
| LOW | `src/app/(home)/guestbook/_components/form.tsx:174` | The "Signature" label is not tied to the canvas (optional, pointer-only by nature) | Name the canvas or mark the field optional in text | 1.3.1 |
| LOW | `src/components/ui/command.tsx:144` (cmdk) | axe `aria-required-children`: a `separator` inside the listbox, and an empty listbox on "No results"; cmdk also leaves `aria-activedescendant` empty when a query returns a single result | `aria-hidden` on CommandSeparator; library limits otherwise | ARIA parent/child rules |
| LOW | `src/app/(home)/projects/[slug]/page.tsx:59`, `src/app/(home)/blog/[slug]/_components/header.tsx:36` | Cover alt is the page title, read right before the same h1 | `alt=''`, or describe the image (writing agent's call) | Alt by purpose |
| LOW | Wording left by the writing agent | blog "Share" (`page.client.tsx:43`), mermaid "Diagram" (`mermaid.tsx:19`), `ui/pagination.tsx:12` lowercase "pagination" | "Share post", the diagram's title, "Pagination" | Names are correct as is; these are copy choices |
| Not verified (colors) | `globals.css` focus ring, `ring-ring/50` rings, shiki comments, search badge | The global ring is the ring color at 60% alpha and several components use `ring-ring/50`; axe measured the shiki comment `#6A737D` on `#f1f1f1` at 4.26:1 and the search page "projects" badge `#666` on `#e3e3e3` at 4.47:1 | Measure the ring pairs and fix the two text pairs with better-colors | 1.4.11 (3:1) and 1.4.3 (4.5:1) |

Not verified: screen readers themselves (VoiceOver, NVDA) were not run, only the accessibility tree; signed-in flows (account page, guestbook posting, edit and delete, reactions); the 404 Simba loop and video player controls; the emoji picker.

Verified after the fixes: axe on all routes in light mode leaves only the two contrast pairs above and the best-practice `region` notes (the Tailwind size indicator, the mobile pill); the `valid-lang` violation is gone; the "On this page" name, Escape and focus return; Escape on View options and Share returns to the trigger while a mouse close still does not; the docked panel keeps focus on a page link after Escape and still returns to the opener from inside, expanded Escape twice lands on the opener; Tab reaches the testimonials region, which shows the ring, pauses and moves with ArrowRight; the search page combobox exposes the highlighted option and announces "4 results"; the palette status reads "Searching…", then "12 results", then "No results"; the context remove target measures 24x24; `scroll-padding-top` is 104px on the blog post; mobile menu and sheet unchanged. `bunx tsc --noEmit`, `bun run check` and `bun run check:spelling` pass. Notes and screenshots are in the session scratchpad `a11y/`.

Block: one HIGH (the minimap) remains for a decision.

# Simba naps when idle

Owner decision: the floating Simba falls asleep when the page sits idle.

Art: the extractor (scratchpad `mascot4/work/extract.py`) now reads `simba-states/simba-spritesheet-more-states-v3-sleeping.svg` for every sprite. It takes the id prefix from the sheet (v3 uses `r_r_bg__`, not `r_r_au__`). The 18 sprites already shipped come out byte-identical from v3, and no existing part changed, so the switch only adds art. New sprites: `sleeping` (the More states cell at 610,1124) and `sleeping1` to `sleeping3` (RestToSleeping 1 to 3). They follow the existing scale rule: v3 has no 1.1x display wrapper, and the parts are drawn at the first row's scale, standing on the ground point. Measured in the browser, the foot baseline holds within 1 unit across Rest, the three in-between frames and Sleeping (228.4 to 229.4). The head center steps down 95, 117, 129, 140, 162 and moves sideways by at most 1.5 units. Sleeping's z marks are kept as one stroke path per letter instead of text in a system font, drawn as `.simba-zzz` in `styles/simba.css`. The marks drift up one after another (2.4 s loop) and hold still with reduced motion.

`rig-art.ts`: 38,215 bytes (9,706 gzip) before, 50,236 bytes (12,800 gzip) after. That is 22 sprites and 74 defs. Most of the growth is the three in-between frames, whose bodies are drawn inline in the sheet rather than as shared parts.

Behavior:

| File | What changed |
| --- | --- |
| `mascot/hooks.ts` | `NAP_AFTER_MS = 60_000` and `useNap`, called from `useMascotPanel`. He naps after 60 s without `pointermove`, `pointerdown`, `keydown`, `scroll`, `touchstart` or `wheel` (window, capture, passive), counted only while `document.visibilityState === 'visible'`. Time spent in a background tab doesn't count. Nap is off while the panel is open, while the chat is `submitted` or `streaming` (which covers every tool pose), and while a page claims its own Simba (404, the empty blog post). On mobile the controller is undefined, so nap never runs there. Any input, or nap becoming disallowed, wakes him. |
| `mascot/controller.ts` | `nap()` and `wake()`. A nap never starts while he has an activity, and it waits for the current animation and a stretch of rest to end, so he always dozes off from rest. While he's asleep there is no timer, so the idle animations pause. `play()` (opening the panel, sending a message) cancels the nap. After waking he starts a fresh stretch of rest before the next idle animation. With reduced motion he swaps straight to Sleeping and back. |
| `mascot/use-sprite-frames.ts` | `sleeping` is entered through `sleeping1` to `sleeping3` at 250 ms a frame and left backwards at 120 ms. Leaving Sleeping for any pose other than rest unwinds through the frames and rest first. The rest-only idle loop already pauses on Sleeping. Happy and CuriousTilt keep their 80 ms frames, and mirrored targets still swap straight over. |
| `mascot/constants.ts` | New `sleeping` pose. |

Not affected: the 404 `SimbaLoop`, `PageSimba`, the chip and avatar copies (`still`, rest only) and every existing trigger.

Verified on localhost:3111 with Playwright's `page.clock` (installed, paused, then stepped), with evidence in scratchpad `mascot4/`:
- Sleep and wake: Rest, S1, S2, S3, then Sleeping with the z marks, holding for 8 s. A mouse move plays S3, S2, S1, Rest, and the idle loop resumes (`sleep-wake.gif`, `sleep-wake-contact.png`).
- Panel: he never sleeps over 70 s with the panel open. He sleeps after it closes. Moving the pointer to him and clicking plays S3, S2, S1, Rest, then the panel's Surprised and Happy.
- Chat: with the panel closed and the answer slowed down, a 70 s jump while the request was pending, and another while it was streaming, gave no nap. He napped 60 s after the stream ended.
- Hidden tab: no nap over 75 s hidden, and the 60 s counter restarts when the tab is shown again.
- Reduced motion: an instant swap to Sleeping and an instant wake.
- 404: the floating mascot stays away and doesn't sleep, and the loop still runs. No console errors (the 404 page logs its own expected 404).

Not seamless:
- Rest to S1 is the biggest step. The body changes from rest's side sit to the front sit of the in-between frames, and the head drops 22 units (about 10 px at the 88 px trigger). S3 to Sleeping also drops the head 22 units and tilts it. These are the sheet's own frames, so they read as him settling down, but the motion is not even.
- If an input lands between two frames and another pose arrives at the same time (a click with no pointer movement before it), he can cut from a half-woken frame straight to the new pose.
- When the nap starts as an idle animation finishes, the 80 ms way back from Happy can be cut short at its last frame.

# Accessibility and copy picks applied

The owner's picks from "Needs a decision" (accessibility audit) and "Owner decisions" (copy audit), applied and checked in headless Chromium on the dev server. Untouched as asked: "heya! im simba", the disabled search submit in `search-redirect-input.tsx`, the testimonials autoplay and controls, the minimap and hover card, the mascot folder and `simba.css`.

| Pick | Files | Change | Verified |
| --- | --- | --- | --- |
| Portrait out of the h1 | `src/app/(home)/_components/portrait.tsx` (`PortraitHeading`), `_components/hero.tsx`, `about/_components/hero.tsx`, `src/components/layout/sections/hero.tsx` (`heading` prop, `heroTitleClassName`) | The h1 keeps an invisible chip-size gap; a copy of the line with only the chip visible sits over it in the same grid cell (`visibility: hidden` text is out of the accessibility tree, and the copy ignores the pointer), so the chip lands in the gap however the line wraps | h1 names "Anirudh Sriram." and "About me."; no button inside an h1; the chip is the next Tab stop and still bonks; h1, chip and text boxes identical to the pixel at 1440, 390 and 320 wide (the 320 home title wraps the chip to line two, as before); before and after screenshots byte-identical |
| Error toasts 8 s | `src/lib/toast.ts` | `toast.error` defaults to `duration: 8000` (a caller's own duration still wins); sounds unchanged | Sign-in error toast still up at 6 s, gone by 9.5 s; "Link copied" gone by 5.5 s |
| "You reacted" cue | `src/app/(home)/guestbook/_components/reactions.tsx` | `aria-pressed` was already there; the reacted chip's border turns solid and doubles (inset 1px) besides the primary color | Typecheck only: reacting needs a signed-in session |
| Busy buttons keep focus | `src/components/ui/button-variants.ts` (`aria-disabled:` matches the disabled look), `focusableWhenDisabled` in `sign-in-modal.tsx`, `contact-form.tsx`, `newsletter-form.tsx`, guestbook `form.tsx`, `account-settings.tsx`, `assistant/tools/contact-form.tsx`, `reactions.tsx` (only when signed in, so signed-out chips stay out of the tab order), `revoke-session-button.tsx`, `page-actions.tsx` (Copy page) | Base UI renders `aria-disabled` instead of `disabled` and swallows clicks and keys while busy | With the action request held: contact "Send message", newsletter "Subscribe" and "Sign in with Google" keep focus, read `aria-disabled="true"` at 50% opacity, and repeated Enter, Space and clicks send no second request |
| Landmarks | `src/components/layout/layout-container.tsx` (new, HomeLayout's `container` slot as a div), `site-shell.tsx`, `src/app/(auth)/layout.tsx`, `layout/footer/index.tsx`, `header/mobile/pill.tsx` | fumadocs' `<main>` wrapper is a div; the page column is the `<main>`; the header is a banner; one `<footer>` (contentinfo) holds the home page's guestbook band and the links; the mobile pill is `<nav aria-label='Main'>` (the desktop nav of the same name is hidden whenever it shows) | One main, one banner, one contentinfo on /, a post and the 404; skip link still lands on `#main-content`; the axe `region` hit on the pill is gone at 390 wide |
| Grain under reduced motion | `src/components/shader/grain-backdrop.tsx` (no change) | Already `speed={reduceMotion ? 0 : 0.3}` | Reduced motion: two frames 1.5 s apart are identical and drawn (not blank); without it they differ |
| Footer clock | `src/components/layout/footer/clock.tsx` | No click behavior existed: the button is gone, the `<time>` is the tooltip trigger, `role='img'` named "My local time: …"; same 36x36 face | Not a button; name read; hover tooltip still shows the time |
| Names and ids | `ui/scroll-area.tsx` (`viewportProps`), guestbook `entries.tsx` ("Guestbook entries"), `search-client.tsx` ("Search results"), `ui/form.tsx` (FormDescription registers itself; `aria-describedby` lists only ids that render), `ui/signature-pad.tsx` (canvas `role='img'`, `aria-label` default "Signature"), `ui/command.tsx` (separator `aria-hidden`), `search/dialog.tsx` ("No results" `aria-hidden`, the status region already says it) | | Viewports are named regions; contact fields reference only existing ids before and after an invalid submit; command palette axe is clean for empty, "slack" and no-result queries (was a separator and an empty listbox) |
| Decorative covers | `projects/[slug]/page.tsx`, `blog/[slug]/_components/header.tsx` | `alt=''` (work-card was done; post rows have no thumbnails) | Cover alts read `""` on /projects/depensa and /blog/vscode-setup |
| Sign-in Escape | `sign-in-modal.tsx` | `openSignIn` remembers the focused element; with none (link or `?signin=` URL) closing focuses `#main-content` by hand, since Base UI passes a non-tabbable target on to its first tabbable child | Escape on `/?signin=%2F` and `/about?signin=%2Fabout` lands on `#main-content` (next Tab: the portrait); opened from "Sign in to post", Escape returns there |
| Contrast | `src/styles/globals.css` | Shiki comments `#6A737D` to `#656d77` light (4.26 to 4.64:1 on `#f1f1f1`) and `#7a8490` dark (3.65 to 4.63:1 on `#191919`), as an `!important` override of shiki's inline variables (`source.config.ts` untouched); light `--color-fd-muted-foreground` 40% to 39% lightness (search "projects" badge 4.47 to 4.68:1 on `#e3e3e3`) | Computed comment color `rgb(101, 109, 119)`; no `color-contrast` hits left in light or dark |
| github-code error | `src/components/content/mdx/github-code.tsx` | "Couldn't load this snippet. View it on GitHub", the link to the source with `externalLinkProps` (dev keeps the error message) | Typecheck only: needs a failing GitHub fetch |
| "Take me home" | `src/app/(home)/error.tsx` | Was "Go home"; the 404 already said it | 404 shows it; the error page not triggered |
| Edit and Revoke names | `account-settings.tsx` ("Edit display name"), `revoke-session-button.tsx` ("Revoke session") | Visible labels kept; the guestbook edit was already "Edit entry" | Typecheck only: signed-in pages |
| Toast punctuation | `guestbook/_components/form.tsx`, `entry-card/use-entry-actions.ts`, `entry-card/index.tsx`, `revoke-session-button.tsx`, `account-settings.tsx` | Short confirmations lose the period ("Guestbook entry posted/updated/deleted", "Banned/Unbanned {name}", "No changes to save", "Session revoked", "Display name updated"); every full-sentence toast and server message already ended with one; the bonk and Simba toasts keep their voice | Grep of every toast call |

axe-core 4.10.2 on /, /about, /projects, /projects/depensa, /blog, /blog/vscode-setup, /contact, /guestbook, /search?q=anirudh, /nope and `/?signin=%2F`: light 12 nodes before, 10 after; dark 11 before, 10 after. The 10 left are the dev-only Tailwind breakpoint badge (`region`, absent from production). Removed: both `color-contrast` hits, plus the palette's `aria-required-children` and the mobile pill's `region`.

Not done: the newsletter, contact and guestbook inputs still take native `disabled` while a request runs, so pressing Enter in a field drops focus to `<body>` there (the audit listed the buttons only; `readOnly` would keep it).

`bunx tsc --noEmit`, `bun run check`, `bun run check:spelling` and `bun run build` pass. No llms change: no page content changed. Notes, scripts and screenshots are in the session scratchpad `a11y2/`.

# Testimonials controls and clickable minimap

Closes the two open accessibility items from "# Accessibility audit (better-accessibility)": the testimonials autoplay with no visible control (MEDIUM, 2.2.2) and the 2xl minimap that only opened on hover or focus (HIGH, 2.1.1). Both are visible changes the owner approved.

| Where | Change | Behavior |
| --- | --- | --- |
| `src/app/(home)/_components/testimonials.tsx` | Pause/play, previous and next buttons in the carousel's top-right corner (the empty space beside the card's user icon), `Button` `variant='outline'` `size='icon-sm'` with `rounded-full`, matching `CarouselPrevious`/`CarouselNext`. Autoplay slowed from 2.5 s to 5 s (`AUTOPLAY_INTERVAL_MS`) | The controls fade in on hover and on focus within the carousel and are invisible otherwise; on coarse pointers (`pointer-coarse:`, phones and tablets) they stay at 60% opacity so a touch user can see and reach them, and swipe still works. Names: "Previous testimonial", "Next testimonial", and "Pause testimonials"/"Play testimonials" (the label flips, no `aria-pressed`). Pause is sticky: it stays paused after the pointer or focus leaves, until play is pressed. Hover and focus still pause it only while the visitor stays; pressing play from inside the carousel overrides that until they leave, so play visibly resumes. Previous and next wrap around. Reduced motion: no autoplay and no pause/play button; previous/next stay. The region tab stop, its name, ArrowLeft/Right and the "1 of 3" slide names are unchanged. The controls are absolutely positioned, 32x32, with the button focus ring |
| `src/components/features/toc/minimap.tsx` | Base UI `Popover` (through `src/components/ui/popover.tsx`) with `openOnHover` on the trigger, replacing `HoverCard` for the minimap only; `hover-card.tsx` and the link previews are untouched. Same placement (`side='left'`, `sideOffset={-60}`, `align='start'`, `alignOffset={16}`), same popup texture and data-open/closed animations; `className` adds `gap-0 border ring-0` so it keeps the hover card's border instead of the popover's ring | Hover opens it after 100 ms without moving focus, and leaving closes it. Click, Enter or Space open it and move focus to the first link; Tab walks the links; Escape closes it and returns focus to the trigger; clicking outside closes it; a click-opened popup stays open when the pointer leaves. Picking a link closes it. The popup is named "On this page" (axe `aria-dialog-name`), and the wrapper is now a `div` instead of a nested `aside` (axe `landmark-complementary-is-top-level`, which showed at 2xl only) |
| `src/components/icons/icons.tsx` | `pause` and `play` (Hugeicons `PauseIcon`, `PlayIcon`) | Arrows stay Lucide |

Verified in headless Chromium against the dev server. Testimonials at 1440x900, light and dark: controls opacity 0 idle, 1 on hover, 0 after the pointer leaves, 1 when the region takes focus; Tab from the region reaches "Pause testimonials" (32x32); Space flips it to "Play testimonials" and the track did not move over 12 s with focus and pointer outside; Enter on play resumed it (advanced within 6 s with focus still on the button); next and previous move and wrap; ArrowRight still moves. With `reducedMotion: 'reduce'` the track did not move over 7 s and only previous/next render. On a 390x844 touch context the controls show at 0.6 and at 1 with focus inside. The region and section bounding boxes and document height are identical before and after at 1440 and 390 (no layout shift). Minimap at 1600x900 on /blog/vscode-setup, light and dark: every step above passes (hover, click, Enter, Space, Tab to the links, Escape back to the trigger, outside click, focus alone does not open it).

axe-core 4.10.2 on / and /blog/vscode-setup (1440 and 1600), light and dark, plus the testimonials region with the controls shown and the page with the minimap open: one node each, the dev-only Tailwind breakpoint badge (`region`), the same as the earlier audit; nothing new. The open minimap first reported `aria-dialog-name` (fixed with the label) and the 2xl pass `landmark-complementary-is-top-level` (pre-existing, fixed with the `div`).

`bunx tsc --noEmit`, `bun run check:spelling` and `bun run build` pass. `bun run check` reports only formatter diffs in `assistant/mascot/constants.ts` and `assistant/tools/portfolio.tsx`, files another agent is editing. No llms change: no page content changed. Scripts, logs and screenshots are in the session scratchpad `a11y3/`.

# Reading pose leg and transitions

Owner: "its leg has disappeared when reading", and rest to reading snapped with no animation. Later scope: restore any hind feet the extra-leg pass removed, and remove the Searching pose entirely.

| Where | Change | Why |
| --- | --- | --- |
| Extractor `hind_paws` (`rig-art.ts` `books`) | Books keeps the legless `moreLiftedSit` body (the paws holding the book are its front paws) and now draws `pawLeft`/`pawRight` under it, 4 units further apart, as the planted hind feet | The extra-leg pass swapped `sit` for `moreLiftedSit`, which dropped the feet with the front legs, so he sat on a bare base. The sheet's own Books drew four legs (front legs to the ground plus the holding paws). Contact sheet of all 23 sprites: every pose stands on visible feet, none has extra legs or a raised paw; Thinking keeps `sit`'s feet |
| Extractor `book_frames` (`booksUp1`, `booksUp2`) | `booksUp1`: the sheet's RestToHappy-1 turn (`turnSitOne`, tail) with Books' head and the book lying shut at his paws (book paths only, scaled .62, opacity .85). `booksUp2`: Books with the book and holding paws 16 units lower at .9 scale | The sheet has no Rest to Books in-betweens; these reuse its parts, so no new art |
| `use-sprite-frames.ts` | `IN_BETWEENS.books = quick('booksUp1', 'booksUp2')` (80 ms each). `tween` plays `outOf(from)` then `into(to)` whenever Books is either end, so Books to Writing (`happy`) goes booksUp2, booksUp1, happy1, happy2; Books to Thinking lowers the book then swaps | Rest to Books and back already ran through `into`/`outOf`. Other pose pairs are unchanged. Reduced motion (`animate` false) still swaps straight over |
| Searching removed | `searching` gone from the extractor's `CELLS`, `rig-art.ts`, the `searching` pose and `Searching` animation; `animations.tool` is `Reading`, `TOOL_ANIMATIONS` keeps only `celebrate` (the Reading entries were now the default); `Sniffing` (404 loop) is `curious 900, curiousRight 900, thinking 1100` | Owner dislikes the nose-down pose. No CSS or other reference existed; the 404 copy still reads fine |

`rig-art.ts`: 50,236 B / 12,807 B gzip -9 (12,984 gzip -6) before, 48,949 B / 11,532 B gzip -9 (11,692 gzip -6) after: the two new sprites are mostly `<use>` references and Searching's bespoke paths are gone.

Verified in headless Chromium against the dev server with an in-page fake `/api/chat` stream (2 s submitted, 2 s `searchDocs` input-available, then text deltas): sprite log rest, booksUp1 (+43 ms), booksUp2 (+135), books (+218), held through the search call ("Sniffing the pages" shows Books), then booksUp2, booksUp1, happy1, happy2, happy when text starts. An aborted request runs books, booksUp2, booksUp1, rest. With `reducedMotion: 'reduce'` it goes rest, books, rest with no in-betweens. /nope loops curious, curiousRight, thinking. `bunx tsc --noEmit` passes; `bun run check` reports only `assistant/tools/portfolio.tsx` formatting, another agent's file. The extractor and evidence (GIFs at 60 ms, stills, contact sheet) are in the session scratchpad `reading-fix/`.

# Compact json-render cards

Owner: Simba's "last 5 projects" answer drew each project as the full /projects hero card (cover at panel width, title, description, "View case study"), so one project filled the panel. He wanted the an1rudh rebrand's compact rows (PR #108, `src/app/(home)/_components/work.tsx`): small cover left, text right.

| Where | Change | Why |
| --- | --- | --- |
| `src/components/features/assistant/tools/portfolio-row.tsx` (new) | `PortfolioRow`: the whole row is one `Link` (`p-3`, `hover:bg-card`, `focus-visible:bg-card`), a 16:9 cover `w-[min(7.5rem,32%)]` (96x54 in the docked panel, 120x68 expanded, about 105px at 390) with the site's image outline and `alt=''`, then an `h4` title (`line-clamp-2`, primary on hover/focus), the description (`line-clamp-2`, `wide:line-clamp-1`) and a mono meta line (`truncate`). The trailing arrow shows only on `wide` (expanded panel), so the docked panel and phones spend that width on text. Missing cover: a `bg-muted` block of the same size | Markup and hover/arrow treatment adapted from the rebrand's project list. The cover shrinks with the row instead of stacking. The focus ring is the site's global one, drawn inset (`-outline-offset-2`) because `PortfolioPart`'s `overflow-hidden` frame clipped the outer ring at the row edges |
| `src/components/features/assistant/tools/portfolio.tsx` | `ProjectItemRow` (meta: year) keeps `transitionTypes={['work-card']}` and the cover preload on hover/focus; `PostItemRow` (meta: date, then up to two tags) replaces `PostRow meta={false}` | Projects and posts read as one list. No shared view transition names, as before. The PostRow reshape TODO goes with the PostRow use |
| `src/lib/ai/chat/catalog.ts`, `src/app/api/chat/utils/tools/render-portfolio.ts` | `ProjectItem.date` (ISO) and `PostItem.image` added; `PostItem.author` dropped (nothing renders it now); catalog descriptions say "compact ... row" | The meta line and post thumbnails. Project tags are not in the `work` collection schema (`source.config.ts`), so the frontmatter `tags` are stripped; adding them is a one-line schema change left to the owner |
| `src/components/features/work/work-card.tsx` | Reverted to HEAD (the first cut's `compact` prop had also moved the default card: inner gap 2 to 1.5, `alt` emptied, `min-w-0`). Only change: `preloadCover` is exported, and the sizes TODO no longer mentions Simba | /projects, work-grid and every other `WorkCard` render exactly as before |

Stack dividers (`dashed-stack`), the eyebrow title and `MoreLink` are unchanged; the expanded panel stays one column in its 720px reading column (rows are about 109px docked, 110px expanded).

Verified in headless Chromium against the dev server with the real model ("last 5 projects", "latest posts"; responses then replayed for the other runs): docked (1280) light and dark, expanded (1440) light and dark, 390x844 light and dark, plus keyboard focus and hover on a row. /projects card classes, heading and alt are the HEAD values (`flex-col gap-4 p-6`, inner `gap-2`, `alt` = title). `bunx tsc --noEmit` and `bun run check` pass. Screenshots are in the session scratchpad `compact-cards/`.

# Compact rows, round 2 and the apostrophe

Owner: the round-1 rows were still too big in the docked panel (about 360px wide: a 96x54 cover, two-line titles and descriptions, a meta line, `p-3`, so three posts filled it), the "view all posts" `MoreLink` was a 64px bar, and a screenshot showed "here are anirudhâ€™s latest posts". "an1rudh made it even more compact."

| Where | Change | Why |
| --- | --- | --- |
| `src/components/features/assistant/tools/portfolio-row.tsx` | `PortfolioRow` split into `ProjectRow` and `PostRow`, copied from the rebrand's `src/app/(home)/_components/work.tsx` and `src/components/features/blog/post-card.tsx` (origin/an1rudh-rebrand). At `wide` (expanded panel) they are the rebrand classes: projects `gap-4 px-4 py-5`, `h-14 w-24 rounded-[8px] border shadow-xs` cover with the rebrand's hover tilt, `text-base` title, `line-clamp-2 text-[13px]` description, mono year column, arrow; posts have no cover (the rebrand's post rows have none), `py-6`, `text-balance` title, `line-clamp-2 text-sm` description, a mono date and tags line, arrow at `mt-1`. Docked and phone: `gap-3 px-3 py-2.5`, `truncate` `text-sm` title and `truncate` `text-[13px]` description, a 64x40 project cover, the date beside a post's title, and no meta column or arrow (the rebrand hides its meta column on phones) | Docked rows are 60px (posts) and 61px (projects), from 109 to 129px. The whole row stays one link with `hover:bg-card`, the inset focus ring (`-outline-offset-2`) and `alt=''` |
| `src/components/features/assistant/tools/portfolio.tsx` | `MoreLink` renders a local `MoreLinkRow`: one `px-3 py-2` text-sm row with a trailing arrow, `hover`/`focus-visible:bg-card`, inset focus ring. `SectionMoreLink` is untouched | 36px, from 64px. The site's own section links keep their bar |
| `src/lib/ai/chat/catalog.ts`, `src/app/api/chat/utils/tools/render-portfolio.ts` | `PostItem.image` dropped (posts no longer show a cover); the `Post`, `Project` and `MoreLink` descriptions the model reads now describe the compact rows | Less spec to stream, and the model is not promised a cover it won't get |
| `src/app/api/chat/route.ts` | `createUIMessageStreamResponse({ headers: { 'content-type': 'text/event-stream; charset=utf-8' }, stream })` | See below |

**The apostrophe.** The real route was not the source of the mojibake in the app. Real-model runs ("latest posts", "last 5 projects", and a prompt asking for a curly apostrophe, an em dash, "café" and an emoji, docked and expanded): the bytes on the wire are valid UTF-8 (’ “ ” — é 🦁, in text deltas and in the json-render props), and the DOM shows them correctly, because the AI SDK client decodes the stream with `TextDecoderStream` (always UTF-8). But the SDK's default header is a bare `text/event-stream`, and anything that decodes by header falls back to Latin-1: Playwright's `response.text()` and `response.body()` (Chrome's DevTools `getResponseBody`) both returned `anirudhâ€™s`. The earlier round recorded its responses with `response.text()` and replayed them (`resp-posts.txt` in the scratchpad holds `anirudhâ€™s`), so its screenshots, which the owner saw, carried the mojibake. Now the header names the charset: re-run, Playwright text, body bytes and DOM all read `’ — é 🦁`. The SDK keeps its other headers (`prepareHeaders` only fills ones that aren't set).

Verified in headless Chromium against the dev server with the real model: docked (1280x900) light and dark, expanded (1440x900) light and dark, 390x844 light and dark, plus keyboard focus and hover. Docked "latest posts" with "view all posts": card 249px for 3 rows (447 to 556px before); the message area is 344px, so 4 rows (about 310px) fit; only 3 posts exist. Expanded rows: projects 97px, posts 121px (the rebrand's `py-6`, up from 92px). `bunx tsc --noEmit` and `bun run check` pass. Screenshots, metrics, sheets and the mojibake probe are in the session scratchpad `compact-cards2/`.

# Front-facing rest, stage 1 mock

Owner: rest was the only side-facing pose (the sheet's RestPose, tail curled to the right) while every other pose faces the viewer. Stage 1 is a mock for him to judge: rest becomes the sheet's front sit with a front-facing idle loop; transitions to other poses are not rebuilt.

| Where | Change | Why |
| --- | --- | --- |
| Extractor (`mascot4/work/extract.py`, backup in scratchpad `front-rest/extract.backup.py`) | The sheet's RestPose is extracted as `sideRest` (kept, unused). New `front_frames` builds `rest` and 12 idle frames on one front sit: `sit` body at (0,-92) and the head at (-2,-117) scale .96, the IdleHeadTilt cell's placement. `rest` uses `neutralHead`; the others swap one head part: `restLookLeft1/Right1` (IdleLookAround's `glanceEye`, mirrored for left), `restLookLeft/Right` (same eyes, head turned 4 degrees), `restBlink1-3` (`heavyLidEyes`, `halfEyes`, `closedEyes` from IdleSlowBlink/IdleBlink), `restPant1-3` (RestToHappy's two in-between muzzles, then Pleased's `happyMuzzle`), `restTilt1/2` (neutral head turned 6 and 11 degrees) | Every frame is the sheet's own parts, no new art. Four paws on the ground, no tail, no raised paw, no ear flick. Rest's ground point stays 69,220; the drawing's box goes from x -7..135, y 38.9..229.4 (side sit) to x 8.5..124.4, y 43.5..228.4, so the feet line moves up 1 unit (0.4px at 88px) and the docked trigger's SVG box is unchanged (1204,696 67.75x88 before and after) |
| `use-sprite-frames.ts` | `REST_BODY` is the front frames (no pop between them). Idle beats every 3 to 6 s: look left, look right (120/1500/140 ms), a slow blink (110/90/340/100/150 ms), a head tilt (140/1600/160 ms); a pant (220/200/760/200/240 ms) replaces the next beat once 10 to 20 s have passed, flagging `chest` on its opening frames. In-betweens: Books keeps only `booksUp2`, Happy and the curious tilt lose theirs (the sheet draws them turning from the side sit), sleeping keeps its three | The in-betweens that start on the side sit would flash the tail; those changes now swap with the existing squash pop |
| `rig.tsx`, `simba.css` | `data-chest` on the rig; `.simba-pop` (already scaled from the ground point) eases `scale: 1 1.02` in and out over 600 ms | About 1.5px rise at the top of the head at 88px, eased while the mouth opens and as it closes |
| `constants.ts` | `animations.idle` drops Thinking (reads as loading) and GetAttention (the side-sit ear flick); the dead `Thinking` and `GetAttention` animations and the `earFlick` pose go | The side idle sprites (`breathIn`, `breathOut`, `earTwitch`, `slowBlink`, `weightShift`) stay in `rig-art.ts`, unused |

Unchanged: `NAP_AFTER_MS`, the controller (other than the idle list), reading while waiting, Show/Hide, the 404 loop. Reduced motion holds the front `rest` (15 s recording: only `rest`, no chest).

`rig-art.ts`: 48,949 B / 11,532 B gzip -9 before, 53,414 B / 11,801 B gzip -9 after (13 frames, all `<use>` references).

Stage 2 still needs: real in-betweens from the front rest into Happy, the curious tilt, Books (booksUp1 was dropped) and sleeping (sleeping1 still starts on the side sit, so nap begins with a jump to the side body); Pleased's `moreHappyHead` is visibly bigger than the rest head, so rest to Pleased jumps; the glance eyes show more white than the neutral eyes and read slightly startled; the controller's big idle animations (every 8 to 16 s) still crowd the small beats.

Verified in headless Chromium against the dev server at 1280x800: a 41 s real-time recording of the docked trigger (100 ms frames), stills, reduced motion. `bunx tsc --noEmit` and `bun run check` pass. Evidence in the session scratchpad `front-rest/`.

# Talking mouth while streaming

Owner: on every answer Simba did a "left ear, right ear" wiggle that read as nothing. Cause: while text streamed, `animations.writing` played `Writing: seq(['nodding', 1400], ['thinking', 700], ['nodding', 900])`, looping for the whole stream: the Happy sprite with the CSS `nod` bob, then the Thinking sprite (its own head drawing, set at a different angle), then Happy again. Each swap had no in-between and popped the head between two drawings off the rest body, so the loop read as an ear-to-ear wobble. `hooks.ts` `activityFor` maps nothing else to a tilt or ear pose (submitted, reasoning and tools play Reading, `celebrate` plays Celebrate, a failed tool plays Reading), and `use-sprite-frames.ts` has no ear frame left on the front rest (the side-sit `earTwitch` beat went with the stage 1 mock).

| Where | Change | Why |
| --- | --- | --- |
| `constants.ts` | New `talking` pose: rest's front sit with `talking: true`. `Writing` is `seq(['talking', 2400])` | He sits still on the rest body while the answer streams, no Happy sprite, no nod, no Thinking head |
| `use-sprite-frames.ts` | `useSpriteFrames(target, animate, talking)`. While talking on rest it plays phrases instead of the idle beats: 3 to 6 syllables, each either half open (`restPant1` 110-190 ms, shut 100-190 ms) or, 40% of the time, half open, open, half open, shut (`restPant1`/`restPant2`/`restPant1`/`rest`, 50-80/90-150/50-70/90-170 ms), with a 120-420 ms shut gap between phrases. About 2.5 syllables a second, never `restPant3` (the full pant) and no `chest`. Turning talking on or off drops the phrase under way, so his mouth shuts as soon as the stream ends; it also re-arms the pant timer so the wide pant doesn't fire right after the answer | Only the muzzle changes (all frames are in `REST_BODY`), the head stays put. Books to talking goes through the existing `booksUp2` in-between, no pop |
| `rig.tsx` | Passes the pose's `talking` flag | |

Unchanged: Reading while waiting for the first token, reasoning and tools; Celebrate; errors; nap; Greet still uses `nodding` (an idle animation, not a response). Reduced motion: the controller holds the first frame of the activity (`talking`, i.e. `rest`) and the rig doesn't animate, so he shows Books then the static rest (recorded: `books` then `rest` only).

`rig-art.ts` unchanged: 53,414 B / 11,801 B gzip -9.

Verified in headless Chromium against the dev server with a mocked `/api/chat` (2 s pending, a searchDocs call, then 6.3 s of text deltas): Books 0 to 4.0 s, `booksUp2` then `rest` at 4.1 s, mouth frames (`rest`/`restPant1`/`restPant2`) until the finish at 10.4 s, closed `rest` at 10.3-10.4 s and nothing else until the controller's next idle animation. `bunx tsc --noEmit` and `bun run check` pass. Evidence in the session scratchpad `talking/` (`response-cycle.gif`, `response-cycle-strip.png`, `reduced-motion.gif`, logs in `stream/` and `reduced/`).

# Rest face C

Owner picked candidate C from the rest-face sheet (scratchpad `talking/faces/rest-face-candidates.png`): the standard eyes with the sheet's `softSmileOne` muzzle, in place of `neutralHead`'s frown (`neutralMuzzle`).

| Where | Change | Why |
| --- | --- | --- |
| Extractor (`mascot4/work/extract.py`, backup in scratchpad `rest-c/work/extract.before.py`) | `front()` defaults to `REST_MUZZLE = 'softSmileOne'`. New `rest_face()` renames the sheet's `neutralHead` def to `restHead` (headBack + eyes + forelock + softSmileOne) and repoints every `neutralMuzzle` use, in the defs and the sprites, to `softSmileOne`. Those were in `bookHead` (Books, booksUp2), `thinkingHead`, `lookAroundHead`, and the unused `slowBlinkHead`/`curiousTweenHeadOne`. An assert makes sure neither `neutralHead` nor `neutralMuzzle` ends up in the output | Rest, the look, blink and tilt beats, and the closed frame of the pant and of talking all use one face. Books, Thinking and LookUp no longer flash the frown either. `neutralMuzzle` and its frown path are gone from `rig-art.ts` |
| Pant and talking | No code change. `restPant1` (RestToHappy's first in-between muzzle) already draws a smile lip line (`M-12 15Q-7 18 0 14Q7 18 12 15`) close to `softSmileOne`'s, so the mouth opens from the smile with no frown in between | |

`rig-art.ts`: 53,414 B / 11,801 B gzip -9 before, 53,036 B / 11,735 B gzip -9 after (one fewer part).

Verified in headless Chromium against the dev server: a 40 s real-time idle recording (395 frames) and a mocked response cycle (160 frames: Books, booksUp2, talking, settle). Every frame was matched to a sprite by name, and every rig's rendered SVG was scanned for the frown path (`9.3-5 4.7 1 9.7 5`), `neutralMuzzle` and `neutralHead`. No frame matched. The 40 s idle run happened to include no blink, so the blink frames were checked in a static 3x sheet of every front frame. `bunx tsc --noEmit` and `bun run check` pass. Evidence in the session scratchpad `rest-c/`.

# Close: settle instead of vanish

Owner: closing the docked panel made Simba blink out and spring back. Cause: `useMascotPanel`'s close branch ran `mascot.stop(); mascot.play(animations.bye); mascot.play(animations.show)`, so Hide (hidden 450 ms) then Show (hidden 120 ms, then rest with the root's 1.4 overshoot spring) played every time, though the trigger never left. Recorded at HEAD: he was invisible from 0 to about 750 ms after close (Close button, Escape, trigger click and closing during the greeting alike). Closing mid-answer was worse: `stop()` emptied the queue but `next()` restarted the current activity (Writing), so he kept talking to a closed panel and Hide/Show queued behind it. Closing during the greeting swapped Happy to rest on the first exit frame. While the trigger was away (a page's own Simba, the expanded panel) his idle animations and rest beats kept cycling out of sight.

| Where | Change | Why |
| --- | --- | --- |
| `controller.ts` | `stop()` and the `Hide` animation are gone. New `settle()`: drops the activity and the queue and plays `Settle`. New `setAway(away)`: while away `next()` shows a held `hidden` frame with no timer, so no idle animation or rest cycle runs; what is asked of him meanwhile waits in the queue, and he comes back through Show, or straight into what was queued (the greeting when the panel opens over a page's own Simba) | Closing no longer hides him. Hide/Show only follow the trigger itself |
| `hooks.ts` | `activityFor(open, status, messages)` returns no activity while the panel is closed. The close branch calls `settle()` (only on a real open to closed change, not on mount). The activity effect runs before the greeting, so reopening mid-answer greets and then talks again. `setAway(useTriggerAway(...))` runs last | Closing stops the talking at once and nothing re-arms it while closed. The chat request is not aborted; the answer keeps streaming into the closed panel |
| `presence.ts`, `trigger.tsx`, `panel.tsx` | `useTriggerAway({ expanded, open })` holds the trigger's `data-away` rule (`(pageSimba && !open) \|\| (open && expanded)`); the trigger and `useMascotPanel` both read it, and the panel passes `expanded` | One rule for when the trigger is away and when he hides |
| `constants.ts` | New `settling` pose (rest with `settle: true`) and `Settle: seq(['settling', 300])`, `animations.settle` | |
| `use-sprite-frames.ts`, `rig.tsx`, `simba.css` | `useSpriteFrames(target, { animate, settle, talking })`. A hidden pose passes a null target: the sprite he had is held (he fades out as he was, no swap to rest under the fade) and no beat or phrase runs. A swap with no in-between frames onto a `settle` pose marks its pop group `data-soft`, which plays `simba-settle` (a `scale(1.03, 0.95)` squash easing out over 280 ms on `cubic-bezier(0.22, 1, 0.36, 1)`, no rebound) instead of the springy `simba-pop`. The flag is only set with a new pop, so the running pop's animation never restarts | Greeting (Happy) to rest on close eases instead of popping |

Timeline after, docked: at rest, close (X), Escape or trigger click: he stays on rest the whole time, fully visible. During the greeting: Happy swaps to rest with the soft squash on the first close frame (`simba-settle` measured: `matrix(1.03,0,0,0.95)` falling monotonically to `none` by 338 ms). Mid-answer: the mouth shuts on the first close frame and no talking frame appears for 8 s after, while the mocked stream keeps running; reopening 1.5 s later plays the greeting and talking resumes at about 1.4 s after the reopen. 404 page: closing hides him with the trigger as before, he holds hidden with no beats, and on leaving the page he returns through Show. Expanded: hidden with no beats while expanded, back through Show on collapse or close. Reduced motion: instant swaps, no squash. Nap unchanged.

Verified in headless Chromium against the dev server with a CDP screencast and a per-rAF log of the trigger rig, before (HEAD code swapped back in temporarily) and after: Close button, closing during the greeting, mid-answer (mocked `/api/chat` slow stream), Escape, trigger click, reopen mid-answer, 404 close and return, expanded, and reduced motion. After: 0 frames with the trigger rig hidden or below full opacity after close in all docked cases (HEAD: 46 to 48 frames, 0 to about 750 ms), 0 talking frames after close (HEAD: 39 in 1.6 s). `bunx tsc --noEmit` and `bun run check` pass. Evidence in the session scratchpad `close-fix/` (`close-before-after.gif`, `strip-*.png`, logs in `before/` and `after/`).

# Reading eyes

Owner: in the Books pose (waiting for the first token, and read/search tool calls: `animations.submit/thinking/tool` → `Reading` → sprite `books`) his eyes sat still looking at the viewer. The books head uses the shared `#eyes` → `#eyeShape` art, whose iris/pupil/highlight group is already a separate element translated by `--look-x/--look-y` and clipped by `#eyeClip`, so no new sprite was needed.

| Where | Change | Why |
| --- | --- | --- |
| `use-reading-eyes.ts` (new) | `useReadingEyes(ref, { reading, scan })` writes `--look-x/--look-y` (plus `--look-ease`, `--lid`, `--lid-ease`, `--look-tilt: 0deg`) on the rig's svg while he reads: eyes drop to the book (y 1.6), sweep left to right (x -2.8 → 2.8 sheet units) over 680 to 980 ms on a soft curve, snap back in 130 ms ease-out to the start of the next line (y +0.35 per line, 4 lines, then back up), dwell 40 to 130 ms. 12% of lines end in a 450 to 850 ms pause, 18% of returns carry a blink (lid down 70 ms, up 120 ms). The cleanup clears every variable and timer | The pupils read, at about 0.8 to 1.2 s a line with small random variation; the head tilt is zeroed so only the eyes move |
| `rig-art.ts` (`#eyeShape`) | The pupil group's fixed `transition: translate .3s ease-out` became `var(--look-ease, .3s ease-out)`, so the reader can set sweep and return timing per move. A lid (fur-tinted path and lash line) sits inside the eye clip, above the white, translated by `var(--lid, 0px)`; at 0 it is fully outside the clip | Same default everywhere else; the lid is invisible unless `--lid` is set |
| `rig.tsx` | `reading = !hidden && shown.sprite === 'books'` (the shown frame, so it starts after the `booksUp2` lift); `useLook(ref, !(still \|\| reading))` and `useReadingEyes(ref, { reading, scan: animate })` | Pointer following is off while reading and back on after |
| `use-look.ts` | The pointer starts as `null`, and a new watcher is called at once with the last pointer position | When reading ends the eyes go straight back to following the pointer, not centred until the next move |
| `use-sprite-frames.ts` | `between` exported for the reader | One random-range helper |

Reduced motion (and `still` rigs): no scanning, no blink; pupils held looking down at the book (`0, 1.95`), instant. Leaving Books removes all reading variables, so rest face C shows no leftover offset or lid; pointer following resumes. Talking, rest C, settle/close and nap untouched.

Verified in headless Chromium against the dev server (DPR 3, `/api/chat` mocked: held 8 s, then a short answer). Per-frame log (about 61 ms frames) of the docked rig's variables and the measured pupil centroid: the right pupil moves from x 121.3 to 126.2 (3x px) across each sweep and returns in about 2 frames; lines step down; blinks recorded; at the end of reading the variables revert to the pointer-follow values on the first rest frame, and moving the pointer afterwards updates them. Reduced motion: 123 books frames all `0px, 1.95px`, ease `0s`, pupil centroid constant. `bunx tsc --noEmit` and `bun run check` pass. Evidence in the session scratchpad `reading-eyes/` (`normal-88px.gif`, `normal-head-3x.gif`, `normal-side-by-side.gif`, `normal-strip.png`, `eyes-keyframes.png`, `normal-pupils.txt`, `reduced-*`).
