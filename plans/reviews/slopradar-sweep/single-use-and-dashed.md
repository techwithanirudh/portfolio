# Single-use constants pass and dashed utilities fold

Two tasks: the single-use constants/helpers pass (Task A) and the dashed utilities fold with the border token (Task B, owner decision 28).

- Detector (`single-use.mjs`): 320 candidates before this pass, 261 after (59 inlined, no new ones).
- Files changed: 45 (39 for Task A, 8 for Task B, 2 of them in both).
- Behavior: computed styles identical to the pre-pass state on 14 pages; screenshots pixel-identical (details under Verification).

## Task A: Fixed (59 inlined)

### Scalar constants and literals inlined (31)
- `src/app/(home)/_components/experience.tsx` `previewCount`: `slice(0, 3)`.
- `src/app/(home)/_components/testimonials.tsx` `AUTOPLAY_INTERVAL_MS`: `setInterval(..., 5000)`.
- `src/app/(resume)/resume/page.tsx` `PROJECT_COUNT`: `slice(0, 6)`.
- `src/app/api/chat/route.ts` `MAX_BODY_LENGTH`, `MAX_MESSAGES`, `MAX_TEXT_LENGTH`: `1_000_000`, `.max(50)`, `100_000` at their checks.
- `src/app/api/chat/utils/tools/render-portfolio.ts` `MAX_ELEMENTS`, `MAX_TESTIMONIALS`: `24`, `3`.
- `src/app/og/_lib/template.tsx` `BALANCE_MIN_TITLE_SIZE`, `closingMarks`: `size >= 68`, `['.', '!', '?', '…'].includes(last)`.
- `src/components/features/assistant/input.tsx` `MAX_SOURCE_PREVIEW_CHARS`: `slice(0, 120)`.
- `src/components/features/assistant/text-selection-popup.tsx` `SETTLE_MS`: `200`.
- `src/components/features/assistant/tools/navigate.tsx` `HASH_WAIT_MS`, `HASH_POLL_MS`: `10_000`, `50`.
- `src/components/features/assistant/tools/portfolio-contributions.tsx` `DOCKED_WEEKS`: `lastWeeks(data, 20)` (the file comment already says 20 weeks).
- `src/components/ui/form.tsx` `SHAKE_MS`, `SHAKE_OFFSETS`: into the one `animate` call.
- `src/lib/confetti.ts` `OVERLAY_Z_INDEX`, `PALETTE_TOKENS`: `zIndex: '100'`; the token list moved into `launchConfetti`.
- `src/lib/github-contributions.ts` `DEFAULT_CONTRIBUTIONS_API_URL`.
- `src/lib/link-preview.ts` `manifestPath`.
- `src/lib/metadata.ts` `MAX_OG_TITLE`, `MAX_OG_DESCRIPTION`: `clamp(ogTitle, 160)`, `clamp(description, 320)`.
- `src/lib/og.ts` `PORTRAIT_PATH`, `EYES`, `GRAIN_ALPHA_MATRIX`.
- `src/lib/reduced-motion.ts` `REDUCED_MOTION_QUERY`.
- `src/lib/stagger.ts` `STAGGER_STEP`: `offset + 0.05 * index`.
- `src/lib/toast.ts` `ERROR_DURATION_MS`: `8000`, with its existing comment moved to the call.
- `src/app/(home)/guestbook/_components/skeleton.tsx` `guestbookSkeletonItems`.
- `src/server/db/index.ts` `sql`: `client: neon(env.DATABASE_URL)`.

### Single-use helpers and schemas inlined (28)
- `scripts/link-previews/index.ts` `isStale`: into the refresh mode's `isPending`.
- `src/app/(auth)/account/_components/account-settings.tsx` `formatAccountDate`: the template string is now at its one use.
- `src/app/(auth)/account/_components/active-sessions.tsx` `compareSessionsByRecency`: the curried comparator became the `toSorted` callback.
- `src/app/(home)/about/_components/feed/data.ts` `getFirstLine`: `message.split('\n')[0] ?? message`.
- `src/app/(home)/blog/actions/newsletter.ts` `splitName`: destructuring with a `= ''` default at the call.
- `src/app/(home)/blog/rss.xml/route.ts` `createFeed`: now the body of `GET`.
- `src/app/(home)/blog/tags/[tag]/page.tsx` `AllPostsLink`: the JSX moved into the `action` prop.
- `src/app/(llms)/utils/site-pages.ts` `tocSections`: into `toSitePage`; the now-unused `TOCItemType` import is removed.
- `src/app/(resume)/resume/page.tsx` `plainText`: `description.replace(markdownLink, '$1')`. The regex stays hoisted.
- `src/app/api/chat/route.ts` `requestSchema`.
- `src/app/api/chat/utils/tools/show-contact-form.ts` `prefillSchema`, `contactFormOutputSchema`: both moved into the tool definition.
- `src/components/ai-elements/prompt-input.tsx` `supportsFieldSizing`.
- `src/components/features/assistant/message-list.tsx` `hasReplyContent`.
- `src/components/features/assistant/text-selection-popup.tsx` `isInsideControl`. `CONTROL_SELECTOR` and its comment stay.
- `src/components/features/assistant/tools/portfolio-contributions.tsx` `formatCount`.
- `src/components/features/blog/post-filters.tsx` `getFilterTags`: the chain now runs straight into the JSX `map`.
- `src/components/features/contributions.tsx` `LEVELS`: inlined as `Array.from(..., (_, level) => level).map(...)`. Keying straight off the `Array.from` index trips `noArrayIndexKey`.
- `src/components/features/work/experience-timeline.tsx` `startYear`: into `toEntries`.
- `src/components/ui/form.tsx` `shake`: `control?.animate(...)` inside `replayShake`.
- `src/components/ui/signature-pad.tsx` `getStrokeColor`.
- `src/lib/ai/providers.ts` `chatModel`, `moderationModel`: moved under their `'chat-model'` and `'moderation-model'` keys.
- `src/lib/confetti.ts` `readPalette`.
- `src/lib/link-preview.ts` `getLinkPreview`: folded into `getLinkPreviewImage`; the unused `LinkPreviewEntry` import is removed.
- `src/lib/metadata.ts` `getSimpleOgImage`: the URL is built inline. The `URLSearchParams` key order stays title, then description.
- `src/server/comments/moderation.ts` `normalizeWhitespace`.
- `src/server/db/queries/guestbook.ts` `fetchSharedGuestbookEntries`: now the function passed to `unstable_cache`, the way `github-contributions.ts` does it.

## Task A: Kept (261), one reason each

Each category's reason applies to every entry under it. Entries with a trailing note have a more specific reason.

### Regex: hoisted regex (ultracite useTopLevelRegex; not recompiled per call) (18)

- `scripts/link-previews/utils.ts` `sourceUrlPattern`
- `src/app/(llms)/utils/site-path.ts` `TRAILING_SLASHES`
- `src/app/(llms)/utils/site-path.ts` `WORK_PREFIX`
- `src/app/(resume)/resume/page.tsx` `markdownLink`
- `src/app/(resume)/resume/page.tsx` `trailingSlash`
- `src/app/(resume)/resume/page.tsx` `urlPrefix`
- `src/app/api/chat/utils/tools/search-docs.ts` `WHITESPACE`
- `src/components/features/assistant/tools/navigate.tsx` `LOCKED_OVERFLOW`
- `src/components/features/blog/author-byline.tsx` `coAuthorSeparator`
- `src/components/features/error-page.tsx` `LINE_BREAK`
- `src/components/inline-markdown.tsx` `linkPattern`
- `src/components/preview-link.tsx` `externalHrefPattern`
- `src/components/preview-link.tsx` `internalHrefPattern`
- `src/lib/github-code.ts` `LINE_RANGE_REGEX`
- `src/lib/og.ts` `SVG_OPEN_TAG`
- `src/lib/page-preview.ts` `pagePreviewPattern`
- `src/lib/pagination.ts` `PAGE_PATTERN`
- `src/lib/url.ts` `relativeMarkdownLink`

### Intl: hoisted Intl formatter, built once instead of per call (7)

- `src/app/(home)/about/_components/feed/event.tsx` `commitListFormat`
- `src/app/(home)/contact/actions/contact.ts` `sentAtFormat`
- `src/app/(home)/guestbook/_components/reactions.tsx` `reactionCountFormat`
- `src/components/content/mdx/github-repo.tsx` `compactNumber`
- `src/lib/format-date.ts` `dateFormatter`
- `src/lib/format-date.ts` `longDateFormatter`
- `src/lib/format-date.ts` `monthDayFormatter`

### Cache: module-level cache/memo wrapper (unstable_cache/React cache/lazy promise); identity must persist (13)

- `scripts/link-previews/utils.ts` `mdProcessor`
- `scripts/link-previews/utils.ts` `mdxProcessor`
- `src/app/(home)/about/_components/feed/data.ts` `getCachedActivityItems`
- `src/app/(home)/about/_components/feed/data.ts` `getCachedMergedPullRequests`
- `src/app/api/chat/utils/tools/search-docs.ts` `searchServer`
- `src/components/features/blog/post-comments.tsx` `Comments`: React.lazy must be module-level
- `src/components/preview-link.tsx` `fetchLinkPreview`
- `src/components/preview-link.tsx` `fetchPagePreview`
- `src/lib/github-contributions.ts` `getCachedGitHubContributions`
- `src/lib/link-preview.ts` `getLinkPreviewManifest`
- `src/lib/og.ts` `loadFonts`
- `src/lib/og.ts` `loadPortrait`
- `src/server/db/queries/guestbook.ts` `getSharedGuestbookEntries`: unstable_cache wrapper (its fetcher was inlined into it)

### Table: lookup table or data set; inlining would bury data in logic (22)

- `src/app/(home)/_components/hero.tsx` `gradientAvifSet`: documented asset set with its own comment block
- `src/app/(home)/blog/[slug]/_components/header.tsx` `cornerTicks`
- `src/app/(llms)/utils/site-pages.ts` `pageOrder`
- `src/app/(llms)/utils/site-pages.ts` `sectionsByPath`
- `src/app/og/_lib/template.tsx` `pageTitleSizes`
- `src/app/og/_lib/template.tsx` `postTitleSizes`
- `src/components/ai-elements/tool.tsx` `defaultLabels`
- `src/components/ai-elements/tool.tsx` `statusTone`
- `src/components/copy-state-icon.tsx` `iconByState`
- `src/components/features/assistant/message-metadata.tsx` `toolStatus`
- `src/components/features/contributions.tsx` `MONTH_LABELS`
- `src/components/features/not-found/not-found-content.tsx` `destinations`
- `src/components/features/search/footer.tsx` `ENTER_LABELS`
- `src/components/layout/header/theme-toggle.tsx` `lightDarkActive`
- `src/components/portrait/bonk-chip.tsx` `COMPLAINTS`
- `src/components/shader/grain-backdrop.tsx` `PALETTES`
- `src/constants/search.tsx` `commandKinds`
- `src/lib/confetti.ts` `COUNTS`
- `src/lib/github-code.ts` `SHIKI_LANG_KEYS`
- `src/lib/og.ts` `FONT_FILES`
- `src/lib/og.ts` `LATIN`
- `src/lib/og.ts` `LATIN_EXT`

### Comp: React component with a real role (own props/hooks/JSX block); a name in the tree beats a JSX blob (41)

- `emails/newsletter-welcome.tsx` `PostCard`
- `src/app/(auth)/account/_components/account-settings.tsx` `EditNameDialog`
- `src/app/(auth)/account/_components/active-sessions.tsx` `SessionCard`
- `src/app/(home)/_components/testimonials.tsx` `TestimonialCard`
- `src/app/(home)/about/_components/feed/event.tsx` `EventDate`
- `src/app/(home)/about/_components/feed/event.tsx` `EventRow`
- `src/app/(home)/about/_components/stack.tsx` `TechBadge`
- `src/app/(home)/about/_components/story.tsx` `ChapterRow`
- `src/app/(home)/about/_components/story.tsx` `Snapshot`
- `src/app/(home)/blog/[slug]/_components/header.tsx` `FrameDecoration`
- `src/app/(home)/blog/_components/newsletter-form.tsx` `FieldErrorAlert`
- `src/app/(home)/uses/_components/hardware.tsx` `HardwareCard`
- `src/app/(home)/uses/_components/software.tsx` `AppIcon`
- `src/app/og/_lib/template.tsx` `PortraitChip`
- `src/app/og/_lib/template.tsx` `Rails`
- `src/app/provider.tsx` `ThemeShortcut`
- `src/components/ai-elements/shimmer.tsx` `ShimmerComponent`
- `src/components/content/mdx/github-repo.tsx` `GithubRepoFallback`
- `src/components/features/assistant/input.tsx` `PromptContext`
- `src/components/features/assistant/input.tsx` `RegenerateButton`
- `src/components/features/assistant/message-list.tsx` `ContactFormBody`
- `src/components/features/assistant/message-list.tsx` `ContactFormPart`
- `src/components/features/assistant/message-list.tsx` `ReplyError`
- `src/components/features/assistant/panel.tsx` `PageScrollLock`
- `src/components/features/assistant/tools/portfolio.tsx` `ContributionsItem`
- `src/components/features/assistant/tools/portfolio.tsx` `ExperienceItems`
- `src/components/features/assistant/tools/portfolio.tsx` `PostItemRow`
- `src/components/features/assistant/tools/portfolio.tsx` `ProjectItemRow`
- `src/components/features/assistant/tools/portfolio.tsx` `TestimonialItems`
- `src/components/features/auth/sign-in-modal.tsx` `SignInDialog`
- `src/components/features/work/experience-timeline.tsx` `TimelineRow`
- `src/components/layout/lenis.tsx` `SmoothScroll`
- `src/components/page-actions.tsx` `LLMCopyButton`
- `src/components/page-actions.tsx` `ViewOptions`
- `src/components/preview-link.tsx` `HoverPreviewLink`
- `src/components/preview-link.tsx` `LinkPreviewPopup`
- `src/components/preview-link.tsx` `PagePreviewPopup`
- `src/components/smooth-cursor.tsx` `DefaultCursor`
- `src/components/ui/emoji-picker.tsx` `EmojiPickerCategoryHeader`
- `src/components/ui/emoji-picker.tsx` `EmojiPickerEmoji`
- `src/components/ui/emoji-picker.tsx` `EmojiPickerRow`

### Hook: custom hook grouping related state/effects; inlining would bloat the component (6)

- `src/app/(home)/_components/contributions.tsx` `useDayTooltip`
- `src/components/features/assistant/panel.tsx` `useMorph`
- `src/components/features/assistant/panel.tsx` `useReturnFocus`
- `src/components/page-actions.tsx` `useMarkdownCopy`
- `src/components/portrait/bonk-chip.tsx` `useBonk`
- `src/components/smooth-cursor.tsx` `usePointerTracking`

### Shadcn: shadcn/ui library surface exported via the export list (unused today, kept with the registry component) (36)

- `src/components/ui/alert-dialog.tsx` `AlertDialogAction`
- `src/components/ui/alert-dialog.tsx` `AlertDialogMedia`
- `src/components/ui/alert.tsx` `AlertAction`
- `src/components/ui/alert.tsx` `AlertDescription`
- `src/components/ui/avatar.tsx` `AvatarBadge`
- `src/components/ui/avatar.tsx` `AvatarGroup`
- `src/components/ui/avatar.tsx` `AvatarGroupCount`
- `src/components/ui/card.tsx` `CardAction`
- `src/components/ui/card.tsx` `CardContent`
- `src/components/ui/card.tsx` `CardDescription`
- `src/components/ui/card.tsx` `CardFooter`
- `src/components/ui/card.tsx` `CardHeader`
- `src/components/ui/card.tsx` `CardTitle`
- `src/components/ui/carousel.tsx` `CarouselNext`
- `src/components/ui/carousel.tsx` `CarouselPrevious`
- `src/components/ui/command.tsx` `CommandShortcut`
- `src/components/ui/dialog.tsx` `DialogClose`
- `src/components/ui/dialog.tsx` `DialogTrigger`
- `src/components/ui/dropdown-menu.tsx` `DropdownMenuCheckboxItem`
- `src/components/ui/dropdown-menu.tsx` `DropdownMenuGroup`
- `src/components/ui/dropdown-menu.tsx` `DropdownMenuLabel`
- `src/components/ui/dropdown-menu.tsx` `DropdownMenuPortal`
- `src/components/ui/dropdown-menu.tsx` `DropdownMenuRadioGroup`
- `src/components/ui/dropdown-menu.tsx` `DropdownMenuRadioItem`
- `src/components/ui/dropdown-menu.tsx` `DropdownMenuShortcut`
- `src/components/ui/dropdown-menu.tsx` `DropdownMenuSub`
- `src/components/ui/dropdown-menu.tsx` `DropdownMenuSubContent`
- `src/components/ui/dropdown-menu.tsx` `DropdownMenuSubTrigger`
- `src/components/ui/input-group.tsx` `InputGroupText`
- `src/components/ui/kbd.tsx` `KbdGroup`
- `src/components/ui/pagination.tsx` `PaginationEllipsis`
- `src/components/ui/pagination.tsx` `PaginationNext`
- `src/components/ui/pagination.tsx` `PaginationPrevious`
- `src/components/ui/popover.tsx` `PopoverDescription`
- `src/components/ui/popover.tsx` `PopoverHeader`
- `src/components/ui/popover.tsx` `PopoverTitle`

### Mascot: mascot timing/sprite logic: brief says leave; reviewed by the assistant agent (16)

- `src/components/features/assistant/mascot/controller.ts` `HIDDEN`
- `src/components/features/assistant/mascot/hooks.ts` `activityFor`
- `src/components/features/assistant/mascot/hooks.ts` `showsProgress`
- `src/components/features/assistant/mascot/hooks.ts` `useNap`
- `src/components/features/assistant/mascot/rig.tsx` `FLIP`
- `src/components/features/assistant/mascot/rig.tsx` `VIEW`
- `src/components/features/assistant/mascot/sprite.tsx` `getRest`
- `src/components/features/assistant/mascot/use-look.ts` `flush`
- `src/components/features/assistant/mascot/use-sprite-frames.ts` `BEATS`
- `src/components/features/assistant/mascot/use-sprite-frames.ts` `IN_BETWEENS`
- `src/components/features/assistant/mascot/use-sprite-frames.ts` `NAP_DOWN`
- `src/components/features/assistant/mascot/use-sprite-frames.ts` `PANT`
- `src/components/features/assistant/mascot/use-sprite-frames.ts` `cueFor`
- `src/components/features/assistant/mascot/use-sprite-frames.ts` `rerun`
- `src/components/features/assistant/mascot/use-sprite-frames.ts` `sameBody`
- `src/components/features/assistant/mascot/use-sprite-frames.ts` `tween`

### Deferred: file imports fumadocs-ui (deferred to the Base UI migration worktree); not edited (23)

- `src/app/(home)/search/_components/search-client.tsx` `tagValues`
- `src/app/(home)/search/_components/search-client.tsx` `ItemBadge`
- `src/app/(home)/search/_components/search-client.tsx` `ResultsSkeleton`
- `src/app/(home)/search/_components/search-client.tsx` `SearchComboboxInput`
- `src/app/(home)/search/_components/search-client.tsx` `SearchResultItem`
- `src/app/(home)/search/_components/search-client.tsx` `emptyLinkByScope`
- `src/app/(home)/search/_components/search-client.tsx` `excerptWidths`
- `src/app/(home)/search/_components/search-client.tsx` `getItemTag`
- `src/app/(home)/search/_components/search-client.tsx` `pageDialogHandle`
- `src/app/(home)/search/_components/search-client.tsx` `scopeParser`
- `src/components/ai-elements/markdown.tsx` `WHITESPACE_LOOKAHEAD`
- `src/components/ai-elements/markdown.tsx` `processCached`
- `src/components/ai-elements/markdown.tsx` `rehypeWrapWords`
- `src/components/content/mdx/github-code.tsx` `GitHubSourceLink`
- `src/components/content/mdx/mermaid.tsx` `FONT_IMPORT`
- `src/components/features/search/dialog.tsx` `useSearchSounds`
- `src/components/features/toc/minimap.tsx` `TOCMinimapContent`
- `src/components/features/toc/popover.tsx` `TOCPopoverContent`
- `src/components/layout/footer/links.tsx` `FooterLink`
- `src/components/layout/header/mobile/index.tsx` `KEEP_OPEN_SELECTOR`
- `src/components/layout/header/mobile/index.tsx` `getFocusable`
- `src/components/layout/header/mobile/index.tsx` `useCloseMenuOnOutsideClick`
- `src/components/layout/header/mobile/index.tsx` `useRemountAfterThemeApplied`

### Next: Next.js convention (default export / next/font must be a module-level const) (4)

- `src/app/error.tsx` `RootError`
- `src/app/layout.tsx` `RootLayout`
- `src/app/layout.tsx` `geistMono`
- `src/app/layout.tsx` `geistSans`

### Identity: stable identity needed (useSyncExternalStore getter, ref callback, rAF callback, module handle) (5)

- `src/components/features/assistant/assistant.tsx` `transport`: module-level chat transport; recreating it per render would reset useChat
- `src/components/features/assistant/panel.tsx` `trackBandHeight`: ref callback; an inline arrow would re-run on every render
- `src/components/features/blog/post-comments.tsx` `commentsWanted`: module-level promise that the lazy Comments import waits on
- `src/components/layout/footer/clock.tsx` `getSecond`
- `src/components/layout/footer/clock.tsx` `getServerSecond`

### Tuned: tuned together as a set with its siblings (11)

- `src/components/features/assistant/panel.tsx` `GROW_MS`
- `src/components/features/assistant/panel.tsx` `MORPH_EASING`
- `src/components/features/assistant/panel.tsx` `SHRINK_MS`
- `src/components/portrait/bonk-chip.tsx` `STREAK_RESET_MS`
- `src/components/portrait/bonk-chip.tsx` `SULK_AT`
- `src/components/portrait/bonk-chip.tsx` `SULK_MS`
- `src/components/portrait/portrait.tsx` `MAX_OFFSET_SVG`
- `src/components/portrait/portrait.tsx` `REACH_PX`
- `src/components/ui-sounds.tsx` `PRESS`: one of the PRESS / PRESS_OPT_OUT selector pair
- `src/lib/confetti.ts` `GRAVITY`: physics set with DRAG and LIFETIME_MS
- `src/lib/cover.ts` `WARMUP_DRAWS`: part of the PRNG constants with MODULUS; the name says why the loop exists

### Logic: multi-branch logic whose name states the rule; inlining would nest it inside a larger function (53)

- `src/lib/confetti.ts` `cannon`: paired generator with rain (detector misses its spread uses)
- `src/lib/confetti.ts` `rain`: paired generator with cannon
- `scripts/check-links.ts` `getHeadings`
- `scripts/link-previews/index.ts` `readMode`
- `scripts/link-previews/utils.ts` `extractSourceUrls`
- `scripts/link-previews/utils.ts` `extractUrls`
- `src/app/(auth)/account/_components/active-sessions.tsx` `parseUserAgent`
- `src/app/(home)/about/_components/feed/data.ts` `getMergedPullRequests`: error-boundary wrapper mirroring getActivityItems; inline needs a let plus try in the middle of another function
- `src/app/(home)/about/_components/feed/data.ts` `getPushEventCommits`
- `src/app/(home)/about/_components/feed/event.tsx` `describeCreate`
- `src/app/(home)/about/_components/feed/event.tsx` `describeDelete`
- `src/app/(home)/about/_components/feed/event.tsx` `describeEvent`
- `src/app/(home)/about/_components/feed/event.tsx` `describeIssue`
- `src/app/(home)/about/_components/feed/event.tsx` `describeIssueComment`
- `src/app/(home)/about/_components/feed/event.tsx` `describePullRequest`
- `src/app/(home)/about/_components/feed/event.tsx` `describePush`
- `src/app/(home)/about/_components/feed/event.tsx` `pullRequestVerb`
- `src/app/(home)/about/_components/story-track.tsx` `markerProgress`
- `src/app/(home)/about/_components/story-track.tsx` `roundedPath`
- `src/app/(home)/about/_components/story-track.tsx` `traceTrack`
- `src/app/(home)/guestbook/_components/reactions.tsx` `updateOptimisticReactions`
- `src/app/(home)/guestbook/page.tsx` `loadEntries`: gives the .catch with unstable_rethrow one promise to wrap
- `src/app/api/chat/route.ts` `parseMessages`
- `src/app/api/chat/utils/tools/render-portfolio.ts` `buildSpec`
- `src/app/api/chat/utils/tools/render-portfolio.ts` `findExperience`
- `src/app/api/chat/utils/tools/render-portfolio.ts` `findPost`
- `src/app/api/chat/utils/tools/render-portfolio.ts` `findTestimonial`
- `src/app/api/chat/utils/tools/render-portfolio.ts` `findWork`
- `src/app/api/chat/utils/tools/render-portfolio.ts` `pickTestimonials`
- `src/components/content/mdx/github-repo.tsx` `formatPushedAt`
- `src/components/features/assistant/context.tsx` `panelMode`: a one-expression inline needs a nested ternary, which ultracite forbids
- `src/components/features/assistant/input.tsx` `readSavedInput`: paired with writeSavedInput, both behind one storage-blocked comment
- `src/components/features/assistant/message-list.tsx` `contactFormStatus`
- `src/components/features/assistant/tools/navigate.tsx` `isScrollLocked`
- `src/components/features/assistant/tools/portfolio-contributions.tsx` `lastWeeks`
- `src/components/features/blog/post-ledger.tsx` `groupByYear`
- `src/components/features/contributions.tsx` `fillHoles`
- `src/components/features/contributions.tsx` `getMonthLabels`
- `src/components/features/contributions.tsx` `groupByWeeks`
- `src/components/features/error-page.tsx` `withOccurrenceKeys`
- `src/components/features/search/results.tsx` `rehypeCustomElements`
- `src/components/features/search/utils/groups.ts` `groupSearchResultsByPage`
- `src/components/features/work/experience-timeline.tsx` `toEntries`
- `src/components/icons/icons.tsx` `toStrokeWidth`
- `src/components/layout/footer/clock.tsx` `getParts`: footer clock (past regression area); parsing helper reads clearly as is
- `src/components/layout/header/theme-toggle.tsx` `shouldSkipViewTransitionForBrowserTint`: the name carries the why (browser tint); theme toggle is a past regression area
- `src/lib/ai/chat/catalog.ts` `escapePointer`: names the JSON Pointer escaping rule
- `src/lib/github-code.ts` `parseLineRange`
- `src/lib/og.ts` `WASH_GRADIENT`: names a fragment of a one-line SVG string; inlining makes that line unreadable
- `src/lib/og.ts` `grainFilter`: names a fragment of a one-line SVG string; inlining makes that line unreadable
- `src/lib/pagination.ts` `parsePageParam`
- `src/server/comments/moderation.ts` `extractContent`
- `src/server/db/queries/guestbook.ts` `getViewerReactionKeys`

### Guard: type predicate: inlining loses the narrowing (4)

- `src/app/(auth)/account/_components/active-sessions.tsx` `isPlatformType`
- `src/components/features/assistant/message-metadata.tsx` `hasOwnStatus`
- `src/components/features/search/utils/tags.ts` `isSearchTag`
- `src/lib/toast.ts` `isVariant`

### Schema: hoisted zod schema reused per call / carries a satisfies type contract (2)

- `src/lib/github-contributions.ts` `contributionResponseSchema`
- `src/lib/validators/comments.ts` `CommentMentionContentSchema`

## Task B: dashed utilities fold and border token

### What changed
- `@layer utilities` is gone from `src/styles/globals.css`; `grep -n "@layer utilities" src/styles/globals.css` finds nothing.
- These became `@utility` rules: `bg-dashed`, `dashed-stack`, `icon-pop`, `icon-tilt`, `icon-tilt-reverse`, `icon-turn`, `icon-arrow`, `icon-arrow-button`, `icon-turn-button`, `typography-hero`, `typography-title` and `typography-body`.
  - The `hover:` and `group-hover:` parts still come from `@apply` inside each `@utility`, so they keep working.
  - None of these utilities is used with a variant today (no `md:dashed-stack` and the like). Now they could be.
- The dashed set is down to four utilities: `dashed-grid`, `dashed-grid-2`, `dashed-stack` and `bg-dashed`.
  - `dashed-frame` (one use, the account delete dialog) is inlined as `border border-dashed`.
  - `divider-top-dashed` (two uses: the home testimonials carousel and the home WorkGrid) is inlined as `w-full border-t border-dashed`.
  - Both were full-strength borders (their `@apply border-border` resolved to Tailwind's own utility, not the 70% override). So the inlined forms leave the color to the base `*` rule, which is full strength.
- The `.border-border` and `.divide-border` overrides are deleted. So are the `/70 dark:` pairs inside `dashed-grid` and `dashed-stack`, which now say plain `border-border` and `divide-border`.

### Border token decision
Tailwind v4 resolves `border-*` and `divide-*` colors from `--border-color-*` before `--color-*`. So `border-border` and `divide-border` get their own theme value, and `--color-border` itself is unchanged. Changing `--color-border` would have changed `bg-border`, `ring-border`, `stroke-border`, `decoration-border`, `scrollbar-thumb-border` and the `bg-dashed` hatching.

The strength is a percentage variable rather than a whole color variable. The mix then resolves on the element itself, so the resume's print override of `--color-border` (neutral-300) still flows into its dashed rules.

Before:
```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
}

@utility dashed-grid {
  & > * {
    @apply border-dashed border-border/70 dark:border-border;
  }
  ...
}

@layer utilities {
  .border-border {
    @apply border-border/70 dark:border-border;
  }

  .divide-border {
    @apply divide-border/70 dark:divide-border;
  }

  .dashed-frame {
    @apply border border-border border-dashed;
  }

  .dashed-stack {
    @apply divide-y divide-dashed divide-border/70 dark:divide-border;
  }

  .divider-top-dashed {
    @apply w-full border-border border-t border-dashed;
  }
  ...
}
```

After:
```css
/* `border-border` and `divide-border` draw at --border-strength (dimmer in
   light mode); every other use of the border color stays at full strength */
@theme inline {
  --border-color-border: color-mix(
    in oklab,
    var(--color-border) var(--border-strength),
    transparent
  );
}

@layer base {
  :root {
    ...
    --border-strength: 70%;
  }

  * {
    border-color: var(--color-border);
    @apply outline-ring/50;
  }
}

.dark {
  ...
  --border-strength: 100%;
}

@utility dashed-grid {
  & > * {
    @apply border-dashed border-border;
  }
  ...
}

@utility dashed-stack {
  @apply divide-y divide-dashed divide-border;
}
```

### Spots that needed care to stay identical
The old override only matched the bare `.border-border` class. Variant forms (`lg:`, `after:`, `[&>...]:`, `prose-*:`) and the base `*` rule all drew at full strength. Under the new token they would have gone to 70%, so each one was pinned:
- Base `* { @apply border-border }` is now `border-color: var(--color-border)`. That is the same full-strength default as before.
- `src/components/layout/site-shell.tsx`: dropped `[&>:last-child]:border-border`. It was redundant with the full-strength default.
- `src/app/(home)/blog/[slug]/page.tsx`: dropped `lg:border-border` on the TOC rail. Same reason.
- `src/components/ui/avatar.tsx`: `after:border-border` became `after:border-(--color-border)`, because pseudo-elements don't get the `*` rule.
- `prose-content`: `prose-hr:border-border` and `prose-blockquote:border-border` became `border-(--color-border)`.
- `src/app/(home)/contact/_components/hero.tsx`: removed the dead `transition-colors` on the `icon-pop` links.
  - Before, the later `@layer utilities` rule overrode it, so only transform transitioned.
  - As an `@utility`, the sort order flipped and colors won.
  - Removing it keeps transform-only, as before.
- `site-shell.tsx` and `blog/[slug]/page.tsx` import fumadocs (deferred files). Each edit is a single class removal that Task B needed.

### Usage census (before the change)
- `border-border` 59
- `bg-border` 10
- `ring-border` 4
- `divide-border` 4
- `dark:border-border` 3 (dark is unchanged)
- 1 each: `stroke-border`, `scrollbar-thumb-border`, `decoration-border`, `lg:border-border`, `after:border-border`, `[&>:last-child]:border-border`, `prose-hr:border-border`, `prose-blockquote:border-border`
- No `outline-border`, `text-border`, `from-border`, `border-x-border` or similar.
- No fumadocs-ui or fuma-comment dist file uses `border-border` or `divide-border`.

## Needs owner decision
1. Inconsistent strength in light mode: the spots pinned above draw at full strength while bare `border-border` draws at 70%.
   - The spots: the post TOC rail, the last section rule above the footer, the avatar outline, prose `hr` and blockquote rules, the `*` default for any `border` without a color class (which includes the testimonials and WorkGrid top dividers and the delete dialog frame), and the old `divider-top-dashed` and `dashed-frame`.
   - This was already true before the change, and is now visible in the code.
   - Proposal: make them plain `border-border` (and the `*` default `@apply border-border`) for one consistent 70% light border. This is a slight light-mode pixel change.
2. Before the change, `transition-colors` on the contact hero social links never applied. It still doesn't: the class is removed, not revived.
   - Proposal, if color fades are wanted there: give `icon-pop` `transition-[color,background-color,scale]`. This changes the motion.

## Deferred (fumadocs-ui imports; candidates left untouched)
23 candidates, listed above under Deferred:
- `search-client.tsx` (10)
- `markdown.tsx` (3)
- `mobile/index.tsx` (4)
- `toc/minimap.tsx`, `toc/popover.tsx`, `github-code.tsx`, `mermaid.tsx`, `footer/links.tsx` and `search/dialog.tsx` (1 each)

`layout.tsx`'s three are listed under Next instead.

## Verification
- `bunx tsc --noEmit -p .`: pass.
- `bunx biome check` on the 45 touched files: clean. `--write` ran on those files only and reformatted three of them:
  - `guestbook.ts` re-indented the fetcher.
  - `link-previews/index.ts` and `contributions.tsx` wrapped lines.
- `bun run check:spelling`: clean.
- Detector: 320 to 261.
- Computed styles: `styledump.cjs` (scratch) records 21 border, divide, max-width, transition and background properties for every element and pseudo-element.
  - Coverage: 14 pages (the 12 screenshot pages plus /resume and /account), 1440 and 390 widths, light and dark, plus /resume in print media.
  - Final against the pre-pass dump: identical in light.
  - In dark, the only difference is the serialization of the same color: `rgba(102,102,102,0.2)` became an `oklab(... / 0.2)` from the 100% `color-mix`, and the resume print border is the same neutral-300.
  - Screenshots confirm those dark-mode values paint the same pixels.
- Screenshots (`shots.cjs`, 12 pages, 1440 and 390, light and dark, plus the Simba panel), taken before this pass (`pre-sua`), after Task B and after Task A:
  - Every page is pixel-identical, borders and dividers included.
  - The one difference was `search-1440`, from timing, not this change:
    - The pre-pass capture caught the results skeleton before results loaded.
    - A retake caught a results-list scrollbar fading (4 px column at x 1346).
    - A third capture matched the after-B shots exactly.
- Against the pre-sweep `base-*` shots, the remaining differences come from earlier sweep work and are present in the pre-pass shots too:
  - Contact and home: one icon.
  - Post: page height.
  - Simba panel.
  - Search: the scrollbar.
- Routes smoke-tested with 200s: `/blog/rss.xml`, `/og?title=...`, `/llms.txt`, `/resume`, `/blog/tags/learning` (renders "All posts"). `/api/chat` with empty messages returns 400.
- Not run: `next build`, per the brief.
