# slopradar sweep: deferred (last 12 markers)

## Fixed (10)

Naming
- src/lib/source/blog.ts:5: the blog loader `post` is now `blogSource`. Call sites updated: (llms)/utils/site-path.ts, (llms)/blog.mdx/[[...slug]]/route.ts, api/chat/utils/tools/search-docs.ts (the `post as blogSource` alias is gone).
- src/constants/site.ts:6: `handle` ('imanirudh') is now `brandName`. Used by baseOptions.nav.title and emails/contact-notification.tsx (outside scope, a one-line import and usage change). The text is the same.
- src/types/search/results.ts:3: `SearchPage` is no longer exported.

Attribution
- src/lib/is-active.ts:8: added an "Adapted from fumadocs-ui src/utils/urls.ts" header and dropped the JSDoc that only restated the name.

Duplicate logic and types
- src/app/layout.tsx:74: the hand-written site JSON-LD graph moved into src/components/json-ld.tsx as `SiteJsonLd`. It is built with the existing JsonLd, makeGraph, personRef and websiteRef. The layout now renders `<SiteJsonLd />`, and the layout's socials and schema-dts imports are gone.
- src/app/layout.tsx:82: `jobTitle` and `knowsAbout` live in src/constants/portfolio/profile.ts. They were not in profile before, so I added them with the same values, and SiteJsonLd reads them.
- src/app/(home)/blog/[slug]/page.tsx:92 and the projects twin: added `createArticleMetadata(page, image, openGraph?)` in src/lib/metadata.ts. Both generateMetadata functions call it, and only the blog passes `authors` and `tags`. The `homeDescription` imports are gone from both pages.
- src/app/(home)/blog/[slug]/page.tsx:52: the GitHub source URL is built from `getContentSourcePath('blog', page)`, which is exported from src/lib/get-llm-text.ts and is now used by getLLMText as well. It is built from page.path.
- src/app/(home)/projects/[slug]/page.tsx:21: new module src/components/features/work/transition.ts (not 'use client', so the server page gets the real values) exports `workTransitionShare` and `workTransitionName(slug, part)`. work-card.tsx and the case study header both use it, and the two copies of the share map are gone.
- src/app/(llms)/utils/site-pages.ts:23: `sectionIds` is exported from src/constants/pages.ts. The about sections (story, experience, stack, activity), the home experience preview and the llms site map all read it, and the map keys now use pages.home.path and pages.about.path.

## Judged not worth it (1)
- src/app/(auth)/layout.tsx:8 (duplicate-logic): the only part shared with SiteShell is the HomeLayout and Header frame. The auth layout has no skip link, no #main-content wrapper, no PageFill and no footer, so an option on SiteShell would be a second branch that only one caller uses. It would add a concept rather than remove one. Also, /account can't be rendered signed out, so there is no way to verify it is pixel-identical. Marker removed and code unchanged.

## Needs owner decision (1)
- src/app/(home)/search/_components/search-client.tsx:162 (effect-mirrors-state): fumadocs' `useDocsSearch` (deprecated) keeps `search` in its own internal useState and has no option for an initial or controlled value. So the only way to drop the effect is to set state during render. That would put `q` into the server-rendered input and start the results in the pending state on the first paint, which is a visible change (today the input fills in after mount). Proposal: move to the provider's `useFetchSearch` or a controlled search hook so that `q` is the only source of truth, and accept the first-paint change. Marker removed and code unchanged.

## Deferred
- none (the fumadocs Base UI migration has landed)

## Verification
- `bunx tsc --noEmit`: clean. `bun run check` (ultracite, 432 files): clean. `bunx biome check --write` on the touched files: 1 import-order autofix. `bun run check:spelling`: clean after I reworded one comment in transition.ts.
- `<head>` meta, title, canonical, alternate and every `application/ld+json` block, captured with scratchpad/deferred/head.py for /, /blog/hello-world, /blog/gorkie-sandboxes, /projects/portfolio, /projects/depensa, /blog, /projects, /about and /search: byte-identical before and after (before.txt vs after.txt). The site JSON-LD on every page is the same.
- llms snapshots (llms-snapshots/deferred-before vs deferred-after, all 200): identical except the live GitHub activity feed in about.md and llms-full.txt (new commits on techwithanirudh/gorkie between the two runs). The site map in llms-full.txt is identical.
- Rendered checks: post GitHub links are still `.../blob/main/content/blog/<slug>.mdx`. /about still has ids story, experience, stack and activity, and / still has experience. /projects/portfolio still uses the transition names portfolio-image, portfolio-title and portfolio-description, and the cards on /projects use the same names. The nav title is still "imanirudh".
- Status codes: /, /blog, /blog/hello-world, /projects, /projects/portfolio, /search?q=react, /about, /guestbook, /account, /resume and /contact all return 200.
- Screenshots (`node shots.cjs mine-deferred` diffed against base-*): the diffs match the previous agent's mine-assistant run exactly (the same 20px regions on home and contact, and a 4px strip on guestbook 1440). The one exception is search-1440-light: a 4px vertical strip at x=1346-1350, which looks like the results scrollbar thumb's shade. I only removed a comment in search-client, so it is not from my edits. Every page whose code I changed (about, home, post, project, work) is SAME, apart from the home icon region that was already different.
- The Simba panel shot timed out in the shots script (the "ask simba" button locator). No file I touched is part of the Simba panel.
