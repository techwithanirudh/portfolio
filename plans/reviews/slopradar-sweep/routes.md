# routes: slopradar sweep log

Scope: `src/app/**`, except about/, the portrait/hero components, api/chat and (llms). 44 markers at start.

## Fixed (24)

Links and errors
- `(home)/contact/_components/hero.tsx:35`: spreads `externalLinkProps` (also on the `uses/` hardware and software cards).
- `(home)/error.tsx:89`: the issue link is a plain `<a {...externalLinkProps}>` (was `Link` with the same rel/target).
- `(home)/error.tsx:22`: `error` is typed `unknown` and narrowed with `instanceof Error` (non-Error values show the same "Error: Unknown error" fallback).
- `error.tsx:4`: ErrorPage moved to `src/components/features/error-page.tsx` (new file). The root and (home) error boundaries both import it; `(home)/error.tsx` is a re-export. The single-use `ISSUE_URL` was inlined.
- `(home)/not-found.tsx:11`: `notFoundMetadata` is exported beside `NotFoundContent` and both not-found files use it.

Paths and constants
- `robots.ts:10`, `(auth)/account/page.tsx:14`: added `pages.account` to `src/constants/pages.ts`. robots, the account metadata, `_lib/session.ts`, `actions/revoke-session.ts` and `active-sessions.tsx` read it (`pages.search.path` too). `/login` stays as a literal because it has no page entry.
- `(home)/contact/_components/contact-form.tsx:136`: added `CONTACT_MESSAGE_MIN_LENGTH` in `src/lib/validators/contact.ts`, used by the schema and the hint. The hint is one template string, so it renders as a single text node and stays pixel-identical.
- `(auth)/account/_components/account-settings.tsx:144`: uses the existing `ACCOUNT_NAME_MAX_LENGTH`.
- `(home)/contact/actions/contact.ts:9`: added an `@/emails/*` alias in `tsconfig.json` and the import uses it. `src/lib/resend.ts` still uses a relative path (lib scope).
- `(home)/blog/tags/[tag]/page.tsx:22`: uses the existing `tagPath` from `components/features/blog/tag-path.ts` in the tag page and `sitemap.ts`. `(llms)/utils/site-pages.ts:75` still builds it by hand (llms scope).
- `(home)/blog/[slug]/_components/header.tsx:10`: added `formatLongDate` (UTC) to `src/lib/format-date.ts`.
- `og/_lib/template.tsx:246`: dropped the `smallest` parameter and inlined `44`. Per the coordinator, also inlined the `fontFamily` constant.
- `(home)/projects/page.tsx`: inlined `EAGER_COVERS` as `eagerCount={2}` (coordinator request).
- `(resume)/resume/page.tsx:51`: added `hideOnResume` to the `Social` type, set on YouTube, and the resume filters on it.

Pagination
- `(home)/blog/page.tsx:23`: added `paginate(items, perPage, param)` to `src/lib/pagination.ts`. It parses the param, returns 404 for out-of-range pages, slices, and returns `{ currentPage, items, pageCount }`. Used by blog, blog/tags/[tag] and projects, in both the pages and their `generateMetadata`. `parsePageParam` is now module-private.

Actions
- `guestbook/_components/form.tsx:61`, `entry-card/use-entry-actions.ts:32` (x3), `account/_components/revoke-session-button.tsx:24`: dropped `router.refresh()` and `useRouter`. `updateTag` and `revalidatePath` already re-render the route in the action response (next docs `02-guides/server-actions.md`).
- `guestbook/actions/guestbook.ts:74`: `GUESTBOOK_CACHE_TAG` is exported from `server/db/queries/guestbook.ts` and used by every `updateTag` and by the `unstable_cache` tags.
- `guestbook/actions/guestbook.ts:77`: removed the unread `success: true` from the guestbook (x5), revoke-session, contact and newsletter actions (`message` kept). Verified that next-safe-action's `hasSucceeded` and `onSuccess` do not depend on `data`.
- `guestbook/actions/guestbook.ts:87,127`: added `insertGuestbookEntry`, `toggleGuestbookEntryReaction`, `updateGuestbookEntryMessage` and `getGuestbookUserStatus` to `server/db/queries/guestbook.ts`. The action file no longer imports drizzle or db.
- `blog/actions/newsletter.ts:66`: a failed contact create throws `ActionError` directly (same visitor message, now a shared `NOT_SUBSCRIBED` constant). The catch only logs non-ActionErrors. I kept the catch so unexpected errors still show the newsletter-specific message instead of the generic safe-action one.

Modules
- `blog/[slug]/page.client.tsx:125`: PostComments (and its lazy loader) moved to `src/components/features/blog/post-comments.tsx`. `components/content/mdx/layout.tsx` imports it from there, and I removed that file's matching `layering` marker.

## Judged not worth it (4)
- `blog/[slug]/page.client.tsx:19`, duplicate-logic: a `useClientValue` hook would wrap a one-line noop subscribe. Its second caller (`theme-toggle.tsx`) is in another scope. The hook adds a concept without removing one.
- `blog/[slug]/page.client.tsx:149` (now in `post-comments.tsx`), magic-string: passing `page.url` needs an edit to the deferred `blog/[slug]/page.tsx` and `MdxContent` (whose own boolean-prop marker plans to turn comments into a slot). Fold it into that change.
- `_components/testimonials.tsx:69`, library-exists: `embla-carousel-autoplay` is a new dependency, which is not allowed. The play/pause/resume semantics are also timing behavior.
- `contact/actions/contact.ts:33`, magic-string: the marker itself notes that printing the zone from Intl changes the email text (owner call). Left ` IST` as is.

## Needs owner decision (8)
- `uses/_components/logo.tsx:16`: the three initials helpers differ ("Visual Studio Code" gives VS here, VC in user-avatar, VSC in testimonial-author). Sharing one changes visible initials. Proposal: adopt user-avatar's grapheme-safe first+last helper in `lib/utils` and accept the change.
- `uses/_components/software.tsx:17`: the inset shadow is `rgba(165,174,184,0.32)`, while shadow-box uses `color-mix(foreground 8%)`. They render differently, especially in dark mode. Proposal: pick one and add a `shadow-inset-soft` utility.
- `(auth)/account/_components/account-logout-button.tsx:15`: a failed `signOut` still navigates home. Proposal: `const { error } = await signOut(); if (error) { toast.error(...); return }`.
- `guestbook/_components/entry-card/index.tsx:57`: proposal is to validate with `GuestbookEditSchema` once and disable Save while the draft is unchanged, instead of toasting "No changes to save". This is a visible behavior change.
- `blog/_components/newsletter-form.tsx:52`: success shows both a toast and an Alert. Proposal: keep the Alert, drop the toast (same for contact-form).
- `_components/contributions.tsx:145`: switching the legend label to the Tooltip component changes the hover visuals. Proposal: use Tooltip.
- `(resume)/resume/page.tsx:123`: one position has no `employmentType`. Using `DEFAULT_EMPLOYMENT_TYPE` would add "Research" to the printed resume. Proposal: make the field required in `src/types/experience.ts` and set it on the data.
- `(resume)/resume/layout.tsx:6`: not touched, per the coordinator (the tooling agent owns the named-page refactor). The file has since been deleted, so the marker is gone.

## Deferred: fumadocs files, markers left in place (7)
- `src/app/layout.tsx:74` duplicate-type (JSON-LD graph); `:82` magic-string (jobTitle/knowsAbout)
- `src/app/(home)/projects/[slug]/page.tsx:22` duplicate-logic (view-transition share map)
- `src/app/(home)/blog/[slug]/page.tsx:52` duplicate-logic (source path); `:93` duplicate-logic (createArticleMetadata)
- `src/app/(auth)/layout.tsx:8` duplicate-logic (SiteShell copy)
- `src/app/(home)/search/_components/search-client.tsx:162` effect-mirrors-state

## Files outside scope touched (minimal)
`src/constants/pages.ts` (account entry), `src/lib/validators/contact.ts` (min constant), `src/lib/format-date.ts` (formatLongDate), `src/lib/pagination.ts` (paginate), `src/server/db/queries/guestbook.ts` (tag constant and 4 queries), `src/components/features/not-found/not-found-content.tsx` (notFoundMetadata), `src/components/content/mdx/layout.tsx` (import path plus its layering marker), `src/types/social.ts` and `src/constants/navigation/social.tsx` (hideOnResume), `tsconfig.json` (`@/emails/*`). New: `src/components/features/error-page.tsx`, `src/components/features/blog/post-comments.tsx`.

## Verification
- `bunx tsc --noEmit`: clean at the end (earlier runs had transient errors from the resume layout deletion and portrait-face, both from other agents).
- `bunx biome check` on all touched files: clean. `bun run check`: 2 format errors, both in another agent's in-progress `SectionDivider` rename (`colophon/page.tsx`, `layout/sections/separator.tsx`).
- `bun run check:spelling`: clean.
- OG: `/og?title=…`, `/og/blog/gorkie-sandboxes/image.png` and a 200-char title (exercises the 44px fallback) are byte-identical before and after (sha1 match, cache-busted re-render).
- Screenshots (`mine-routes-*` against `base-*`, 1440/390, light/dark): about, blog, colophon, notfound, project, uses and work are identical. contact: after the single-text-node fix, the only remaining diff is a 20px box on the GitHub icon (icons.tsx changed GitHub to the Octicon mark, another agent). guestbook 1440: Simba mascot pixels (assistant agent). search 390: 4px scrollbar strip (deferred search-client). home 390 dark: hero (portrait agent).
- post (`/blog/vscode-setup`): 131px shorter because the comments box is gone after hydration. An A/B test with PostComments temporarily restored to page.client.tsx gave the same empty `<div>`, so the move did not cause it. It is pre-existing or environmental: there is HMR churn from parallel edits, and a 401 shows in the console. The post's prose link underline color also differs from base (another agent's CSS).
- Smoke checks: `/account` redirects to `/?signin=%2Faccount` and its title is "Account settings | …". robots.txt lists are unchanged. Sitemap tag URLs are unchanged. Pagination: `/projects?page=0` → 404, `/blog/tags/ai?page=5` → 404, valid pages → 200.
- Not verified in a browser (needs auth): guestbook post/edit/delete/ban/react, session revoke, and the error boundary render.
