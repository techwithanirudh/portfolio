# Slopradar sweep: lib agent

Scope: `src/lib/**` (minus ai, portrait-eyes), `src/server/**`, `src/types/**`, `src/constants/**`, `src/app/(llms)/**`, `src/env.ts`. 52 markers: 28 fixed, 9 judged, 10 owner, 5 deferred. All but the 5 deferred are removed.

## Fixed (28)

Types
- `src/types/experience.ts:1`: `ExperiencePositionItemType` is now module-private.
- `src/types/testimonial.ts:1`: `Author` is now module-private.
- `src/types/story.ts:4`: `StoryPhoto` is now module-private.
- `src/types/search/index.ts:4`: `AccountAction` is now module-private.

src/lib
- `src/lib/scroll-to-target.ts:6`: reads `prefersReducedMotion()` itself and the `{ immediate }` parameter is gone. Both callers (`search/dialog.tsx`, `assistant/tools/navigate.tsx`; outside scope, import lines only) now pass `(lenis, target)`. The header scroll-to-top is left alone because it calls `lenis.scrollTo(0)` without `immediate`, so it behaves differently.
- `src/lib/github-repo.ts:4`: one `GITHUB_REVALIDATE_SECONDS` exported from `lib/github.ts`, used by `github-repo.ts` and `github-code.ts`.
- `src/lib/resend.ts:116`: the welcome-email error now carries `{ cause: error }`. The message text is unchanged.
- `src/lib/confetti.ts:1`: `CONFETTI_INTENSITIES` tuple. `ConfettiIntensity` is derived from it, and `api/chat/utils/tools/celebrate.ts` builds its `z.enum` from it (outside scope, 2 lines, same JSON schema).
- `src/lib/confetti.ts:56`: one `pickColor(palette)` helper replaces the two copies.
- `src/lib/validators/moderation.ts:5`: `MODERATION_REASON_MAX_LENGTH = 120` is used by the schema and interpolated into `lib/ai/prompts/moderation/directives.ts` (outside scope, the prompt string is byte-identical). `.describe()` was not added (see Needs owner decision).
- `src/lib/validators/index.ts:1`: barrel deleted. 6 importers now import the files directly: `blog/actions/newsletter.ts`, `blog/_components/newsletter-form.tsx`, `guestbook/_components/form.tsx`, `guestbook/actions/guestbook.ts`, `guestbook/actions/utils/moderation.ts`, `server/comments/moderation.ts`.
- `src/lib/validators/guestbook.ts:41`: the read model (`GuestbookEntryItem`, `GuestbookReactionItem`) moved to `src/types/guestbook.ts` (also exported from the `@/types` barrel). The column fields are typed from `guestbookEntries.$inferSelect` / `users.$inferSelect`. Importers updated: 6 guestbook components (outside scope, import lines only) and `server/db/queries/guestbook.ts`.
- `src/lib/reveal-script.ts:7` (re-scoped by the orchestrator): the first-section selector now lives once, in the script. The script injects the hidden-state rule (`<style>` appended to head in the same synchronous head script that used to set `data-reveal`). The `:root[data-reveal] ...{opacity:0}` block was removed from `src/styles/globals.css` (tooling agent notified), and the now-unread `data-reveal` attribute is gone. Without JS nothing is hidden, same as before. Verification is below.

src/server
- `src/server/comments/moderation.ts:64` and `:85`: one shared `moderate(content, label)` in the new `src/server/moderation.ts` (server-only) runs `generateText` + `Output.object(ModerationResultSchema)` and logs the whole `error` on failure. The comment and guestbook moderation (`guestbook/actions/utils/moderation.ts`, outside scope) both call it and keep their own user-facing failure messages, which differ ('Could not verify content safety. Please try again.' vs "Couldn't run the safety check on your entry. Try again."), so there is no single message constant. The comment's `prompt:` string became `messages: [{ role: 'user', content }]`, which is the same request.
- `src/server/db/queries/guestbook.ts:117`: `deleteGuestbookEntry({ entryId, isAdmin, userId })` options object. The caller in `guestbook/actions/guestbook.ts` was updated (outside scope).
- `src/server/db/schema/comments.ts:23`: dropped the redundant `.notNull()` after `.primaryKey()` (also in `schema/guestbook.ts`). `ColumnBuilder.primaryKey()` already sets `notNull = true`, so the schema output is identical and no migration is needed.

src/constants
- `src/constants/index.ts:3`: deleted the `baseUrl` re-export, which had no importers left.

src/app/(llms) (see the dedicated section below)
- `utils/profile.ts:10, :40, :78`, `utils/about.ts:10` (route paths, across all utils), `utils/colophon.ts:9` (interpolates `pages.colophon.description`), `utils/colophon.ts:8` (design paragraph half), `utils/experience.ts:5`, `utils/skills.ts:4`, `utils/content-index.ts:13`, `utils/index.ts:1` (barrel deleted), `utils/markdown-pages.ts:34` (builder renamed to match the page name).

## Judged not worth it or unsafe (9; confetti:86 counted under owner)

- `src/types/story.ts:1` (layering): a type-only import, so there is no runtime coupling. An `IconName` alias in `icons.tsx` would be a single-use alias that still imports the same module.
- `src/lib/github-contributions.ts:5` (layering): `Activity` is owned by the Kibo registry component (`features/contributions.tsx`, owner decision 7), with 4 component importers being edited by other agents. It is a type-only import.
- `src/lib/github-code.ts:95`, `src/server/db/queries/guestbook.ts:81` (unstable_cache): owner decision 4. `'use cache'` needs `cacheComponents`, which changes route segment config site-wide.
- `src/env.ts:36` (env default): with `SKIP_ENV_VALIDATION`, `createEnv` returns the raw env, so a zod `.default()` never applies. The caller fallback is the only one that always holds (same reason as round 1).
- `src/constants/portfolio/intro.ts:3` (current role duplicated): these are prose sentences. Interpolating would need casing transforms ("software engineering intern") and still would not cover the `story.ts` prose.
- `src/app/(llms)/utils/github-commits.ts:1` (move `feed/data.ts` to `src/lib`): a cross-scope file move of a file other agents have uncommitted edits in (`about/_components/feed/data.ts`), with importers in `src/app`.
- `src/app/(llms)/about.md/route.ts:12` (one `getAboutPageText()`): the three compositions are not the same text. `site-text.ts` leaves out the facts (llms-full prints them separately), and Simba's `get-page-content` leaves out the commits. Unifying would change what Simba reads. The assistant agent later added `getAboutMarkdown()` in `(llms)/utils/site-path.ts` and moved `about.md/route.ts` onto it (byte-identical, their pass).
- `src/app/(llms)/utils/uses.ts:15` (desk caption): the page caption is "My desk setup in 2025" and the llms text reads "a photo of my desk setup in 2025". Sharing it would need a casing transform or a text change.
- `src/lib/confetti.ts:86` (split physics from draw): splitting one loop into two functions adds a concept for no reader gain. The library half is below under Needs owner decision.

## Needs owner decision (10 markers)

- `src/lib/metadata.ts:7`: require `NEXT_PUBLIC_BASE_URL` in production (decision 12; a missing value would fail the build).
- `src/lib/auth-client.ts:7`: route the 429 toast through `@/lib/toast`. It would then play a sound.
- `src/lib/audio/preferences.ts:76`: merge the imperative and hook sound gates. This changes when sounds play (the `unlocked` gate).
- `src/lib/confetti.ts:86`: adopt `canvas-confetti`, which changes the look and adds a dependency.
- `src/lib/validators/moderation.ts:5`: give the model the limit via `.describe()`. This changes the structured-output schema the model sees.
- `src/server/db/schema/comments.ts:14`, `:41`: snake_case columns and `portfolio_`-prefixed index names (`comment_idx`, `guestbook_reaction_entry_idx`) need a migration (decision 11).
- `src/constants/search.tsx:123`: point the RSS command at `/blog/rss.xml` (and the footer link) or keep `/rss.xml` as the public short URL. It changes the URL visitors land on.
- `src/app/(llms)/utils/contact.ts:5`: the page says "Send a message and I'll reply within a week." and the llms text says "...through the contact form and I'll reply within a week. Visitors can also leave a public note in the guestbook." One shared constant changes one of them.
- `src/app/(llms)/utils/testimonials.ts:4`: adding the "What others are saying" title and intro to the llms text changes the llms output (decision 16).
- `src/app/(llms)/utils/colophon.ts:8, :9` (remaining halves): adding the attribution intro, the Godly credit and the Typography intro to the llms text changes the llms output (decision 16).
- `/skills.md` URL vs page name `stack`: renaming the route is a public URL change, so only the builder was renamed.

## Deferred (fumadocs imports, not edited)

- `src/lib/is-active.ts:8`: attribution
- `src/lib/source/blog.ts:5`: unclear-name (`post` -> `blogSource`)
- `src/types/search/results.ts:3`: unused export (`SearchPage`)
- `src/constants/site.ts:6`: unclear-name (`handle`)
- `src/app/(llms)/utils/site-pages.ts:23`: llms-parity (section ids)

## (llms)/utils pass (owner callout on profile.ts)

The hard rule was that the output does not change. Before any edit I snapshotted all 30 llms URLs from the dev server: `llms.txt`, `llms-full.txt`, the 7 `.md` routes, 3 `blog.mdx/*` and 18 `work.mdx/*`. The script is `scratchpad/llms-snapshots/snap.sh`, and the snapshots are in `before/`. The output depends on today's date (`Computed ... on <date>`, month counts). A second "before" run matched the first, and all runs were on the same day, so the date did not affect the diff. `diff -r before after` is empty, checked after the utils pass and again after every later edit.

`profile.ts`:
- `periodDate`/`monthsBetween` are gone. `@/lib/employment-period` now exports `parsePeriodDate` and a new `monthsInPeriod(start, end?, now)`, which `formatDuration` also uses now (same arithmetic).
- `toPlainPeriod` is gone. `formatPeriod` takes a `separator` argument (default `' – '`), and callers pass `' to '`.
- `groupStack` moved next to `groupTechnologies` in `src/constants/portfolio/skills.ts`. The llms stack builder and `(resume)/resume/page.tsx` both use it; the resume edit is outside scope (import, the deleted `stack` const and its TODO, one `.map` line). The resume DOM text is checked against `/about.md`.
- The email comes from `email` in `@/constants/site`, and the other socials are filtered on `mailto:${email}`.
- `getRoles` is inlined. The unused `current` field became `!role.end`.
- `getProfileFactsText` is built from a flat list of lines plus `join('\n')`, not a nested template.
- `DEFAULT_EMPLOYMENT_TYPE` was kept because it is shared by `profile.ts` and `experience.ts`, and the fallback is live (one position has no `employmentType`).

Rest of the folder:
- Every hand-typed route path now reads `pages.<key>.path`: about, colophon, contact, experience, stack, testimonials, uses, profile.
- The colophon description is interpolated from `pages.colophon.description`.
- The colophon design copy is now `designNotes` in `src/constants/portfolio/colophon.ts`, rendered by `colophon/_components/design.tsx` (outside scope) and the llms text.
- New `experienceIntro` and `stackIntro` constants (in `constants/portfolio/experiences.ts` and `skills.ts`) are read by `about/_components/experience.tsx`, `about/_components/stack.tsx` (outside scope) and the llms builders.
- `content-index.ts` has one `indexLine` rule: the `: description` suffix is omitted when there is no description. Every entry has one today, so the output is unchanged.
- `skills.ts` was renamed to `stack.ts` and `getSkillsText` to `getStackText`.
- The barrel `utils/index.ts` was deleted. All importers (8 `(llms)` routes, `api/chat/route.ts`, `api/chat/utils/context.ts`, `api/chat/utils/tools/get-page-content.ts`) now import the files directly.

## Verification

- `bunx tsc --noEmit`: clean at the end. A mid-sweep error in `components/features/assistant/message-list.tsx` was another agent's and had cleared by the final run.
- `bun run check`: 2 format errors, both in other agents' files (`src/app/(home)/colophon/page.tsx`, `src/components/layout/sections/separator.tsx`). My files pass `bunx biome check --write`.
- `bun run check:spelling`: clean.
- llms routes: 30 URLs byte-identical, before vs after.
- Screenshots (`scratchpad/shots-lib.cjs`, tag `mine-lib2`, compared with base): colophon is identical at all 4 sizes. About is identical except one 28x4 px patch in the floating Simba's fur at (1374,880), which flips between light and dark from run to run and is not from my edits. Contact differs from base, but I did not change the contact page (other agents). `/resume` stack rows match the llms stack text.
- Reveal (`scratchpad/reveal-probe.cjs`, outputs `reveal-before.json` / `reveal-before2.json` / `reveal-after.json`): covers `/`, `/about` and `/colophon` at 1440 desktop and 390 touch (`hasTouch`, `isMobile`), with reduced motion on and off. It logs the first section's `[data-reveal-item]` opacity every frame for 40 frames (always 1, so no flash), the initial hidden count, every `getAnimations()` while scrolling (delay, duration, easing, fill, keyframes) and the items still not visible at the end. Before vs before2 was identical, so the probe is deterministic, and before vs after was identical for all 12 cases. A client-side navigation from home to about keeps the injected rule (1 style, 58 hidden), and there were no hydration or console errors.
- Pages `/`, `/about`, `/colophon`, `/guestbook`, `/resume` and `/contact` return 200 on the dev server.
