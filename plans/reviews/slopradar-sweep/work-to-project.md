# work -> project rename

The pages were already projects (`/projects`, `/projects/[slug]`). Everything internal that said "work" for them now says "project". Public URLs are unchanged.

## Counts

- **Files moved with `git mv`: 27.** 1 file deleted.
  - `content/work/*.mdx` -> `content/projects/` (18 files).
  - `src/components/features/work/` -> `src/components/features/projects/`: `cover.ts`, `transition.ts`, `preview-button.tsx`, `work-card.tsx` -> `project-card.tsx`, `work-grid.tsx` -> `project-grid.tsx`.
  - `experience-timeline.tsx` and `experience-rail.tsx` -> `src/components/features/experience/`. They are job history, not projects, so a `projects/` folder would have been the wrong home for them.
  - `src/lib/source/work.ts` -> `src/lib/source/projects.ts`.
  - `src/app/(home)/_components/work.tsx` -> `projects.tsx`.
  - Deleted `features/work/index.ts`. It was a barrel with one consumer (Simba's `portfolio.tsx`), which now imports `projects/cover` and `experience/experience-timeline` directly.
- **Identifiers renamed: 30.** The renames were done with perl `\b` substitutions over a reviewed file list, then local variables were renamed by hand.
  - Collection export `work` -> `projects` (in `.source/`, regenerated with `bunx fumadocs-mdx`).
  - `workSource` -> `projectSource`, `getWork` -> `getProject`, `getWorkPages` -> `getProjectPages`, `getSortedWork` -> `getSortedProjects`, `WorkPage` -> `ProjectPage`.
  - `getWorkLLMText` -> `getProjectLLMText`, `getWorkPageImage` -> `getProjectPageImage`, `WorkJsonLd` -> `ProjectJsonLd`, `WorkPreview` -> `ProjectsPreview` (matching `ExperiencePreview`).
  - `WorkGrid`/`WorkGridProps` -> `ProjectGrid`/`ProjectGridProps`, `WorkCard`/`WorkCardProps` -> `ProjectCard`/`ProjectCardProps`.
  - `WORK_COVER_SIZES` -> `PROJECT_COVER_SIZES`, `workTransitionName`/`workTransitionShare` -> `projectTransitionName`/`projectTransitionShare`.
  - View transition type `'work-card'` -> `'project-card'`, changed in all 3 places: the share map, the card `Link`, and Simba's portfolio row.
  - `worksPerPage` -> `projectsPerPage`, `findWork` -> `findProject`.
  - Locals: `allWork`, `workContent`, `workEntries`, `workPages`, `work`/`works` -> project wording.
  - Grid prop `works` -> `projects`.
  - `ContentIndexLinks.work` -> `.projects`.
  - `get-llm-text` `ContentType` `'work'` -> `'projects'`. This is the source-path segment, so it now gives `content/projects/...`.
- **Code files edited: 39** (listed in Verification below), plus `README.md`, `.cspell.jsonc` (added `numstat`) and `content/projects/portfolio.mdx` (description wording).

## Owner notes

- **(a) Eager covers.** `priorityCovers` and `EAGER_COVERS` no longer exist in the tree; an earlier sweep had already replaced them with the grid prop `eagerCount`. That prop is now `priorityCoverCount` ("How many leading covers load eagerly"). It feeds the card's `priority` prop, which sets `loading='eager'`. `/projects` passes `2` and the home preview uses the default `0`. Behavior is unchanged.
- **(b) Source getters.** `getWorkPages` and `getSortedWork` are not duplicates: one is load order and the other is the pinned-then-newest sort. Collapsing them would reorder `sitemap.xml` and the search index. They are now `getProjectPages` and `getSortedProjects`.
  - The single-use module `const workPages = getWorkPages()` is inlined into `getSortedProjects`.
  - `getProject` and `projectSource` complete the set.

## Public URL impact

None. Nothing new was added, and every URL that worked before still works.

- `/og/work/<slug>/image.webp` is kept. It is the published `og:image` (already cached by social cards), so the route folder `src/app/og/work/` keeps its name.
  - `OgCollection` stays `'blog' | 'work'`, documented as the URL segment.
  - `getProjectPageImage` maps to `'work'`.
- `/work.mdx/<slug>` is kept. `llms.txt` links to it directly, and `/projects/<slug>.mdx` rewrites to it, so `src/app/(llms)/work.mdx/` keeps its name.
- `/work` and `/work/:path*` 308 to `/projects` (unchanged in `next.config.ts`). `parseSitePath`'s `WORK_PREFIX` still maps old `/work` paths for Simba.
- No internal route was renamed, so no compatibility redirect was needed.

## llms output diff (before vs after, dev server)

### `/llms.txt`

```
29c29
< ## Work
> ## Projects
41c41
< - [Portfolio](.../work.mdx/portfolio): My personal site with a blog, work, guestbook, and AI chat.
> - [Portfolio](.../work.mdx/portfolio): My personal site with a blog, projects, guestbook, and AI chat.
```

### `/llms-full.txt`

The same two wording changes (`## Work` -> `## Projects`, and the portfolio description in the site map and in its section), plus every project's `Source:` line:

```
< Source: https://raw.githubusercontent.com/techwithanirudh/portfolio/refs/heads/main/content/work/<slug>.mdx
> Source: https://raw.githubusercontent.com/techwithanirudh/portfolio/refs/heads/main/content/projects/<slug>.mdx
```

The `Source:` change is required: it is the GitHub raw URL of the file, and it 404s once the move is on `main`. `/projects/<slug>.mdx` (= `/work.mdx/<slug>`) changes in the same way. Simba's context (`api/chat/utils/context.ts`) gets the same `## Projects` heading. The tool prompt changed from "blog posts, work projects, etc." to "blog posts, projects, etc.".

### Last updated dates

Before the commit, the projects' `Last updated on ...` lines and the sitemap's project `<lastmod>` fall back to the frontmatter date. This is because `git log` has no history for the uncommitted new paths. After the commit they come back.

With the stock `lastModified()` plugin, the commit would have stamped every project with the rename date, since it runs `git log -- content/projects` with no `--follow`. To prevent that, the projects collection now has its own `lastModified`. It walks `git log --follow --numstat` and picks the newest commit that changed lines, which skips the pure rename.

I checked this on a throwaway `--shared` sparse clone in the scratchpad with the rename committed (the clone was deleted afterwards). All 18 dates matched the old `content/work` dates. The one exception was `portfolio.mdx`, which correctly takes the commit date because its description changed in this change.

`/sitemap.xml`, `/blog/rss.xml`, `/about.md`, `/stack.md` and `/og/work/portfolio/image.webp` are byte-identical, except for the sitemap lastmod note above.

## Remaining `[Ww]ork` hits (all justified)

- **Public URLs:**
  - `next.config.ts:55` `/work/:path*` redirect, `:76` `/work.mdx` rewrite.
  - `src/app/og/work/` + `collection: 'work'`, `src/lib/metadata.ts` `OgCollection`/`getPageImage('work')`.
  - `src/app/(llms)/work.mdx/`, `llms.txt/route.ts:22` `'work.mdx'`.
  - `site-path.ts` `WORK_PREFIX` (legacy `/work` paths).
- **Icon:** `Icons.work` (`icons.tsx`, plus `links.tsx`, `pill.tsx`, `search.tsx`, `search/utils/tags.ts`, `assistant/tools/portfolio.tsx`). Icons are named for their glyph (briefcase), like `sun`, `trash` and `wrench`, not for the section.
- **English "work" (labor or employment), not this section:**
  - `cta.tsx` "Let's work together", `intro.ts`, `guestbook/page.tsx` "a thought about the work".
  - `testimonials.ts` (3), `story.ts` "freelance full-stack work".
  - `message-list.tsx` "his work", `llms-full.txt/route.ts` "work experience".
  - Prompts: `core.ts`, `personality.ts`, `tools.ts:11,115`, `chat/examples.ts`, `moderation/examples.ts`.
- **Verb "works":** `testimonials.tsx:87`, `panel.tsx:57`, `post-row.tsx:8`, and the "How it works" headings in content.
- **Content prose:** `shadcn_portfolio.mdx` "work sections"/"work pages" describe that template's own section names. `portfolio.mdx` "share my work", "about my work", `depensa.mdx` "scheduled work", `blog/*.mdx` are ordinary English.
- **Comment:** `source.config.ts:35` explains the `content/work` -> `content/projects` move for `lastModified`.
- `.claude/CLAUDE.md` and `AGENTS.md` never mentioned `content/work`, so they were not changed. `README.md` was updated: nav link `/work` -> `/projects`, "work page(s)" -> project wording, `content/work` -> `content/projects`. `plans/reviews/*` logs were not touched.

## Fumadocs-importing file touched

`src/app/(home)/projects/[slug]/page.tsx` imports `fumadocs-ui`. It only got identifier and import-path renames, which `tsc` needs to pass.

## Verification

- `bunx tsc --noEmit -p .`: clean.
- `bunx biome check` on the 39 touched code files: clean.
  - `--write` was run on the moved files, and on 8 edited files whose only findings were rename-caused (import order and line wrap): `check-links.ts`, `(home)/page.tsx`, `projects/page.tsx`, `projects/[slug]/page.tsx`, `api/search/route.ts`, `sitemap.ts`, `get-llm-text.ts`, `metadata.ts`.
- `bun run check:spelling`: clean, after adding `numstat`.
- `bun run check:links`: works offline. 32 URLs, 0 errors.
- **Route fetches (before -> after, all 200):**
  - `/llms.txt`, `/llms-full.txt`, `/projects/portfolio.mdx`, `/work.mdx/portfolio`: diffs as above.
  - `/sitemap.xml`: lastmod only, pre-commit.
  - `/blog/rss.xml`, `/og/work/portfolio/image.webp`, `/about.md`, `/stack.md`: identical bytes.
  - `/projects` and `/projects/portfolio`: 200.
  - `/work` and `/work/portfolio`: 308 to `/projects/...`.
  - `/api/search?tag=projects` and `/api/page-preview?path=/projects/depensa`: 200 with the right data.
  - `/projects/portfolio.md` is 404. There is no `.md` rewrite for projects, only `.mdx`, and no routing was changed.
- **Screenshots (Playwright headless shell, light, 1440 and 390):**
  - `/` and `/projects`: pixel-identical at both widths.
  - `/projects/portfolio`: differs only in the description line ("work" -> "projects"), confirmed on a crop.
- **Console errors:** none on any page.
- **Shared-element transition:** clicking the Depensa card on `/projects` loads `/projects/depensa` with one `startViewTransition`.
  - Types: before `["work-card"]`, after `["project-card"]`.
  - Old snapshot names `depensa-image`/`-title`/`-description` match the new ones on both runs.
  - No errors.
- The dev server on 3111 was not restarted. It picked up the collection rename after `bunx fumadocs-mdx` regenerated `.source/`.
