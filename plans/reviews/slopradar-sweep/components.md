# Slopradar sweep: components agent

Scope: `src/components/**` (minus `features/assistant/**` and `components/portrait/**`) and `src/hooks/**`. 82 markers at the start; 0 remain (`grep -rn "TODO(slopradar)" src/components src/hooks | grep -v features/assistant/` is empty). 79 resolved here; 3 were resolved by other agents before I reached them (`content/mdx/layout.tsx:2` PostComments layering, `features/blog/author-byline.tsx:1` and `:6`, both via the portrait move).

Totals: **48 fixed** (7 of them partly, with the rest under owner decision), **12 judged not worth it or unsafe**, **19 needs owner decision only**, **0 deferred**. The fumadocs-importing files were deferred at first; the coordinator then cleared them, and all of their markers are resolved below.

Extra passes the coordinator asked for, each in its own section: icons, preview-link, ui-sounds, header, contributions, the constants pass, and page-fill.

## Fixed

### ai-elements
- `sources/tool/shimmer/conversation/message/prompt-input.tsx` (6 markers) unused-export: un-exported 27 prop and state types that had no importers.
- `shimmer.tsx:24` dead-class: dropped `motion-reduce:animate-none`. The keyframes have no fill-mode, so the global reduced-motion rule ends on the same base background-position.
- `message.tsx:17` duplicated-state: dropped the `is-user`/`is-assistant` classes. MessageHeader now uses `group-data-[role=assistant]/message:text-primary`, which has the same specificity.
- `markdown.tsx:22` over-abstraction (part): dropped the `Processor` interface and the `createProcessor` factory. It is now one module-level remark pipeline plus `processMarkdown()`. Merging the three markdown stacks was skipped (see below).

### icons
- `brands/claude.tsx:4` duplication: new `brands/brand-icon.tsx` `brandIcon(viewBox, paths)` factory, and each brand file is now one call. Rendering is identical: the svg-level fill sits under the per-path fills, `xMidYMid` is the default, and `focusable='false'` is now on every icon.
- `brands/github.tsx:6` inconsistent-a11y: the factory applies `isLabelled`, which moved from `icons.tsx` to `icons/utils.ts`. No brand icon gets aria, role or title props today, so the output is unchanged.
- `brands/github.tsx:8` dead-code: dropped `data-icon='github'` and `data-prefix='fab'`. Only `data-icon=inline-*` is ever selected. (The file was later deleted; see the Icons section.)

### root components
- `page-actions.tsx:142`: dropped the redundant `size-8`.
- `page-actions.tsx:170` (part): dropped `aria-label={title}`. The computed name is the same because the icons are aria-hidden.
- `smooth-cursor.tsx:143`: added `MEDIA.hoverFinePointer` (OUT OF SCOPE: `src/lib/media.ts`, one new key).
- `blur-image.tsx:4`: moved the attribution header above the imports.
- `blur-image.tsx:16`: replaced `lazy` with next/image's own `loading`; `fetchPriority='high'` when `loading === 'eager'`. Callers: `work-card.tsx`, plus OUT OF SCOPE `app/(home)/projects/[slug]/page.tsx`, `blog/[slug]/_components/header.tsx` and `uses/_components/setup.tsx`.
- `guestbook-cue.tsx:8`: uses `pages.guestbook.path` and `pages.home.path`.
- `guestbook-cue.tsx:12` (part): renamed the file to `guestbook-band.tsx` to match its export, and updated the `footer/index.tsx` import.
- `json-ld.tsx:135` weak-type: the page node is typed schema-dts `WebPage`, and `extra` is `Pick<ProfilePage,'mainEntity'>`. The JSON is identical.
- `theme-provider.tsx:6`: deleted the wrapper. `src/app/layout.tsx` (OUT OF SCOPE, import line only) now imports ThemeProvider from `next-themes`, which ships `'use client'`.

### hooks
- `use-reduced-motion.ts:10`: kept the hook. A two-line comment says why: the server snapshot is `true`, and motion's hook has no equivalent.

### layout
- `footer/clock.tsx:25`: replaced `HAND_ORIGIN` (`0px 0px`) with `origin-top-left` (same computed value).
- `footer/active-link.tsx:16`: `isActive(href, pathname, { nested })` (OUT OF SCOPE: signature change in `src/lib/is-active.ts`; `header/mobile/item.tsx` updated).
- `sections/separator.tsx:9`: now a named export `SectionDivider`. Callers: `not-found-content.tsx`, plus OUT OF SCOPE `app/(home)/page.tsx`, `about/page.tsx`, `uses/page.tsx` and `colophon/page.tsx` (import line and tag names only).
- `sections/body.tsx:10`: deleted SectionBody; callers use `<Section … fill>` (OUT OF SCOPE: `blog/[slug]/page.tsx`, `blog/_components/post-index.tsx`, `projects/[slug]/page.tsx`).
- `wrapper.tsx:7` (part): dropped the needless `'use client'`.
- `header/mobile/pill.tsx:18`: Home, About and Projects come from `pages.*`.
- `header/mobile/pill.tsx:43`: one exported cva, `pillItemVariants({ active })`, in `mobile/item.tsx`, used by the Search button, the menu toggle and NavItem. The class sets are the same.
- `header/mobile/menu.tsx:26`: the Home items in the menu, the footer links and the pill read `pages.home`.
- `header/index.tsx` (4 markers) and `header/search-toggle.tsx:11`: see the Header section.
- `page-fill.tsx` (coordinator item): inlined `CROSS_OVERHANG_MARGIN` and `CROSS_CENTER_BOTTOM_INSET` and dropped `cn`.

### features
- `toc/popover.tsx:16`: added a source header (fumadocs-ui `layouts/docs/page/slots/toc.js`, MIT).
- `blog/index.ts:1`: deleted the barrel (OUT OF SCOPE: the `blog/[slug]/_components/header.tsx` import).
- `not-found/not-found-content.tsx:50`: uses `pages.home.path`.
- `auth/user-button.tsx:81` (part): uses `pages.account.path`.
- `auth/sign-in-modal.tsx:141`: both failure paths `console.error` the cause and share one toast and loading reset. The toast text and the state are the same as before.
- `work/experience-timeline.tsx:28`: new `periodYear()` in `src/lib/employment-period.ts` (OUT OF SCOPE, three lines, built on `parsePeriodDate`).
- `work/experience-timeline.tsx:170`: `max-w-[60ch]` became `typography-body` (same max-width).
- `work/experience-rail.tsx:34`: added `@utility mask-fade-bottom` to `src/styles/globals.css` (OUT OF SCOPE, five lines, same declaration), used by the rail and by the timeline's `before:`.
- `contributions.tsx:3` and `:353`: see the Contributions section.

### content/mdx
- `layout.tsx:11`: dropped the `comments` flag and the never-passed `className`/`commentsClassName`; `slug` alone turns the thread on. OUT OF SCOPE: `blog/[slug]/page.tsx` no longer passes `comments`.
- `github-code.tsx:82`: the fallback now calls `console.error`, like `github-repo` and `mermaid`.
- `github-code.tsx:30` (part): dropped the `disabled:*` and `data-checked:*` classes, which can never apply to an `<a>`.

## Judged not worth it or unsafe
- `ai-elements/prompt-input.tsx:201` isChatBusy: moving it means editing the assistant agent's `chat-context.tsx` and its 3 callers at the same time for a one-line predicate. Better done in the assistant/lib pass.
- `ui/dropdown-menu.tsx:109` shadcn-extend: the premise is stale. `DropdownMenuIconItem` has callers in `page-actions` and `blog/[slug]/page.client.tsx`, so it stays as the shared extension.
- `inline-markdown.tsx:4` library-exists: react-markdown would add block parsing (paragraphs, emphasis on `*`/`_`, lists) to plain inline copy on 4 pages.
- `json-ld.tsx:159` pass-through-wrapper: collapsing the wrappers means editing 9 app pages for no output change, and the wrapper names already say the schema type.
- `hooks/use-near-viewport.ts:3` library-exists: **tried, then reverted.** usehooks-ts' `useIntersectionObserver` uses a callback ref that sets state on mount. That re-render made React drop the server-rendered comments still waiting in their Suspense boundary, so the post's comment box vanished until the reader scrolled near it (caught by the full-page diff: `/blog/vscode-setup` came out 131px shorter). The hook stays, with a comment saying why. PostComments (now `features/blog/post-comments.tsx`) uses it again, and the post page is pixel-identical to baseline.
- `layout/header/index.tsx:244` and `features/toc/popover.tsx:38` useDismiss: the three dismissals behave differently:
  - header: `pointerdown` outside the header, plus Escape.
  - toc: a window `click`, plus a scoped Escape that also returns focus.
  - mobile menu: a capture-phase click with `preventDefault`, a keep-open selector and a media-query close.

  One hook would change event semantics.
- `layout/site-shell.tsx:34` utility-sprawl: the class string is used once, and the "shared" mobile fade is a different gradient.
- `features/search/dialog.tsx:67` long-function: a hook would only move code while the JSX still needs every value.
- `header/mobile/menu.tsx:70` setTimeout(0): there is no verifiable reason for it, and a synchronous close could reorder navigation and focus on mobile.
- `features/blog/post-row.tsx:20` boolean-prop: `meta` is a documented two-state option, and a compact variant would duplicate the row.
- `features/work/work-card.tsx:9` duplicate-type: the shared card type spans lib, app and components; do it as one change after the sweep.

## Needs owner decision
- `ai-elements/sources.tsx:61`: the collapsible height transition appears 4 times with different easings. Pick one and add an animated CollapsibleContent variant.
- `ai-elements/tool.tsx:38`: amber and green are raw palette colors, but `--color-success` has a different value. Add warning/success tokens that match, or accept the color change.
- `hooks/use-copy-to-clipboard.ts:37`: a copy in the blog ShareMenu plays its sound twice (hook plus toast). Proposal: a `sound` option on the hook, set to false there.
- `page-actions.tsx:21`: moving `useMarkdownCopy` onto the hook adds haptics and swaps the copy sound. Proposal: a `ClipboardItem`/Promise input and a `sound` option, then migrate.
- `page-actions.tsx:170` (rel part): `externalLinkProps` adds `noreferrer`, which stops the Referer header to GitHub, ChatGPT and Claude.
- `numbered-pagination.tsx:86`: `PaginationEllipsis` renders a Hugeicons icon plus an sr-only label instead of muted `...`.
- `smooth-cursor.tsx:125`: `size-6` is rem-based, so the cursor ring would grow for visitors with a larger browser font. Proposal: keep px.
- `search-redirect-input.tsx:52`: next/form would not trim and would submit empty queries. Adopt it with validation if no-JS search matters.
- `guestbook-cue.tsx:12` (move part): rendering the band from the home page would move it out of the footer's contentinfo landmark.
- `footer/index.tsx:42`: a single responsive control row changes layout and the stagger. Verify at 375/768/1280.
- `footer/sound-toggle.tsx:24`: Button `outline` looks different (shadow, ring, colors, hit area).
- `footer/clock.tsx:22`: the neutral hand colors would change if they became tokens.
- `sections/hero.tsx:76`: filtering falsy children removes empty ViewAnimation flex items, which changes the gaps.
- `header/mobile/index.tsx:99`: Base UI's `trap-focus` would leave out the pill toggle that sits outside the popup.
- `content/mdx/heading.tsx:9`: fumadocs' Heading is different. It adds a copy-link button with a Lucide icon and an aria-live region, where ours has an aria-hidden Hugeicons link icon. Keep ours.
- `content/mdx/github-code.tsx:30` (rest): `buttonVariants` ghost icon-xs changes the box, hover, focus ring and press scale.
- `layout/footer/links.tsx:116`: making group titles headings changes the document outline and the lists' names.
- `layout/wrapper.tsx:7` (rest): mounting Lenis in SiteShell turns on smooth scrolling for posts, projects and account pages.
- `features/testimonial-author.tsx:15` and `features/auth/user-avatar.tsx:52`: the 4 initials rules give different text. Proposal: user-avatar's grapheme-safe first+last rule, uppercased, in `lib/utils`.
- `features/auth/user-button.tsx:81` (rest): DropdownMenuIconItem's boxed-icon rows would change the account menu.
- `features/work/work-card.tsx:69`: `sizes` from `columnsFrom` changes which image is downloaded at 768–1023px.
- `features/work/experience-timeline.tsx:83`: the pixel literals (12.5px, 9px, 7px, 17px, 13px) are off the scale. Name them as tokens or accept the size change.
- `features/work/experience-timeline.tsx:161`: Research Collaboration has no `employmentType`. Adding the field would also change the resume page and the llms profile.
- Assistant icons (read-only audit; the assistant agent owns the edits):
  - The pending state uses `pawPrint` while the reasoning state uses `brain` for the same "thinking" moment. Recommend one (paw).
  - There are no direct icon-library imports, and sizes are consistent.
- Icon registry near-duplicates (nothing changed):
  - `experience` (Briefcase01) and `work` (Briefcase02) look alike.
  - `page` (File01) and `post` (File02) look alike.
  - `desktop` draws a TV (Tv02), next to `tv` (Tv01).
  - Octicons `star` is also used in `mdx/github-repo` for GitHub stars, beside Hugeicons `featured`.
- `ui-sounds`: `pageEnter` on browser back did not play in later runs, with the ORIGINAL code too (see the UI sounds section). Worth checking on its own.

## Deferred
None. The fumadocs files were cleared by the coordinator mid-sweep and handled above.

## Icons (owner-approved visible change)
- `Icons.github` is now Octicons `MarkGithubIcon`. Dropped the `githubMark` key, moved its callers (`mdx/github-code` x1, `mdx/github-repo` x3), and deleted `brands/github.tsx` and its re-export.
- No className changes were needed. Every site already sizes the svg (`size-4`/`size-5`, `[&_svg]:size-3.5`, or the Button default), and the Octicon also fills with currentColor and is aria-hidden.
- Close-ups (JPG, dpr 2) are in `scratchpad/icons/`: `before-*`/`after-*`, `sheet-*.jpg`, `after-sheet.jpg` and `cmp-sheet.jpg`. They cover the hero, footer, about activity, project, the post "View options" menu and the 390 mobile menu, in both themes at 1440 and 390.
- The hero crop compared against `base-home-*` has the same box, size and alignment; only the glyph differs.

## Preview-link pass
- Dropped the single-use `fetchPreview`/`fetchPagePreview` URL wrappers.
- Kept:
  - `createJsonFetcher`: two uses, and it owns the cache, 404→null and failure→eviction.
  - The two fetcher caches.
  - Both href regexes.
  - `popupClassName`, which is shared.
  - The PreviewLink/HoverPreviewLink split: the router has no hooks, and the hover link holds the hooks. Merging would run hooks for every plain link.
- Not edited: the lib files `link-preview.shared.ts` and `page-preview.ts`.
- Playwright (`comp-shots/pl.cjs`, 1440, both themes) behaved the same before and after:
  - An internal page preview and an external one open after 300ms or more and close on leave.
  - Keyboard focus opens the popup.
  - The preview API requests are identical.
  - The popup screenshots are pixel-identical (6/6).

## UI sounds pass
Changes to `ui-sounds.tsx` (168 to about 131 lines):
- Inlined both delays. The "aria state flips after the handlers" why is kept once, and the 120ms one has a "wait for validation" comment.
- Removed `afterClickHandlers`, `playSubmit`, `pressTarget` (merged into `playPress`) and the `onKeyDown` pass-through.
- The jitter pairs are now a tuned set, `jitter.{state,navigate,press}`.
- The if-ladder is a single if/else chain in the same priority.
- The toggle condition reads `turnedOff = wasChecked && !isChecked()`, which is De Morgan of the old condition.

Verification:
- A temporary spy inside `ui-sounds.tsx` recorded every `playSound` call, with the Playwright fixture in `comp-shots/snd.cjs`. The spy is removed: `rg "SPY|__sounds" src` is empty.
- 20 cases, all identical before and after (sound name and jitter options): link, button, Enter, Space, tab, switch on/off, checkbox on/off, aria-expanded open/close, invalid and valid submit, `data-sound=off`, right click, nav click + back, and touch taps.
- The one exception is `pageEnter` on back, which only the very first baseline run recorded. Two reruns of the original file did not record it either, so it is environment timing, not the refactor.

## Header pass
Changes to `header/index.tsx`:
- Source header added.
- `Header` takes `links`/`nav`/`className`. The always-disabled `themeSwitch`, the unset `searchToggle` slots and the unset `transparentMode` (`useIsScrollTop`) are gone. Callers updated: `site-shell.tsx`, and OUT OF SCOPE `app/(auth)/layout.tsx`.
- Dropped the 6 single-child divs. Two of them were empty flex items that added 12px of gap, so the desktop search button went from `-mx-1.5` to `-ms-1.5 me-1.5` to stay on the same pixel.
- Added a `mobile` variant to `navItemVariants` and dropped the mobile class map.
- `SearchToggle` no longer takes `hideIfDisabled`.

Verification (`comp-shots/hdr.cjs`):
- Header shots are pixel-identical before and after at 1440, 900 (collapsible menu open) and 390 (pill menu open), in both themes, on `/`, `/blog`, `/projects/depensa` and `/about`.
- The only diff is page content behind the open 390 menu (animated logos).
- These are identical in the JSON before and after: tab order, active link states, the search dialog opening, and Escape closing the menu.

## Contributions pass
- Took ownership of `contributions.tsx` (542 to about 430 lines), with a Kibo UI source header (MIT).
- Removed:
  - `Labels` and `DEFAULT_LABELS`
  - `weekStart` (always Sunday)
  - `maxLevel` (now `MAX_LEVEL`/`LEVELS`)
  - `year`
  - the default renderers of TotalCount and Legend (children are now required)
- The Block's default fill is `contributionLevels` (it was a duplicated muted list), and the legend's copy is gone. Callers already pass `contributionLevels`, so the classes are unchanged.
- The exports the assistant's `portfolio-contributions.tsx` uses are unchanged (not edited, and tsc passes). The removed types `Labels` and `ContributionGraphTotalCountProps` had no importers.
- Verification (`comp-shots/cg.cjs`, `/about`, 1440 and 390, both themes):
  - The graph's outerHTML is byte-identical.
  - The graph, tooltip (same text) and legend-hover shots are pixel-identical (12/12).
  - The Simba card was not rendered, because it needs a live model call.

## Constants pass
A scope-wide scan (`scratchpad/const-scan.txt`) found 53 top-level `const` declarations used at most once and not imported anywhere.

Inlined:
- `search/dialog` `NAV_SOUND_THROTTLE_MS`, with a comment
- `icons` `DEFAULT_STROKE_WIDTH`
- `view-animation` `MAX_DELAY`
- `grain-backdrop` `MAX_PIXEL_RATIO`, with a comment
- `ai-elements/markdown` `CACHE_LIMIT`, with a comment
- `post-empty` `everyPost`
- `search/utils/tags` `otherTag`
- `mobile/index` `FOCUSABLE` and `getToggle`
- plus the ones covered in the passes above (ui-sounds, preview-link, page-fill, clock, contributions)

Kept, with reasons:
- Regexes: their names say what they match, and ultracite's `useTopLevelRegex` wants them at module level.
- Lookup tables and tuned sets: tool labels and tones, `iconByState`, `destinations`, `ENTER_LABELS`, `lightDarkActive`, `PALETTES`, `MONTH_LABELS`, the form shake set, the jitter set.
- Module-lifetime objects: Intl formatters and segmenters, the comments promise, the preview caches, `LEVELS` (which also gives the legend its key).
- Named logic helpers: `processCached`, `supportsFieldSizing`, `formatPushedAt`, `getFilterTags`, `groupByYear`, the contribution helpers, `withOccurrenceKeys`, `isSearchTag`, `startYear`/`toEntries`, `toStrokeWidth`, `getFocusable`, `shouldSkipViewTransitionForBrowserTint`, `PRESS`, `KEEP_OPEN_SELECTOR`.
- The clock's `useSyncExternalStore` snapshot functions, since the clock is a known regression spot.

## Verification
- `bunx tsc --noEmit`: clean. `bun run check` (ultracite): clean, 432 files. `bun run check:spelling`: clean.
- Full-page diffs against `sweep-shots/base-*` (`comp-shots/final-*`/`final2-*`, all 12 pages at 1440 and 390, both themes):
  - Identical: about, blog, post, work, project, uses, colophon, notfound, search (1440), guestbook (390).
  - Expected diffs: the GitHub glyph on home (hero) and contact (socials) only.
  - Not caused by this agent: the Simba mascot paws on guestbook 1440, and a transient ScrollArea thumb on search 390 (shown in one run, gone in another).
- Out-of-scope edits (all minimal):
  - `src/app/layout.tsx`
  - `src/app/(auth)/layout.tsx`
  - `src/app/(home)/{page,about/page,uses/page,colophon/page}.tsx`
  - `src/app/(home)/blog/[slug]/{page.tsx,page.client.tsx,_components/header.tsx}`
  - `src/app/(home)/blog/_components/post-index.tsx`
  - `src/app/(home)/projects/[slug]/page.tsx`
  - `src/app/(home)/uses/_components/setup.tsx`
  - `src/lib/{media.ts,is-active.ts,employment-period.ts}`
  - `src/styles/globals.css`

  The `page.client.tsx` swap to `useIntersectionObserver` was later reverted, and that code now lives in `features/blog/post-comments.tsx`.
