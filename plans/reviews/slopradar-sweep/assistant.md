# Slopradar sweep: assistant

Scope: `src/components/features/assistant/**` (mascot, tools, gutter), `src/app/api/chat/**`, `src/lib/ai/**`, plus three extra passes the coordinator added: the expanded-panel Simba fix, the `api/chat/utils/tools` folder, and the mascot folder. There were 36 markers in scope. All 36 are resolved: `grep -rn "TODO(slopradar)"` over the scope returns nothing.

Counts: 21 fixed (2 of them partially, with the rest under owner decision), 6 judged not worth it, 14 needing an owner decision (some cover two markers), 0 deferred. No file in scope imports fumadocs-ui.

## Fixed (21)

Assistant UI
- `class-names.ts:1`: deleted the comment that narrated the code below it.
- `message-metadata.tsx:108`: dropped the dead `motion-reduce:animate-none` on the pulse. The globals.css reduced-motion rule already cuts it to one 0.01ms run with no fill.
- `input.tsx:166`: dropped the dead `id='nd-ai-input'`. Nothing reads it.
- `input.tsx:36`: dropped `tabIndex` and `pointer-events-none` from Regenerate. A disabled native button is not focusable, and the Button base already sets `disabled:pointer-events-none`. Measured: computed pointer-events is `none` and the box is unchanged.
- `message-list.tsx:196`: the context text is now read straight off the typed `data-context` part, so the `'data' in` check and the `safeParse` are gone. `ChatDataTypes` lost its `UIDataTypes &` index signature so that `part.type` narrows. It stays a `type`, with a biome-ignore that gives the reason (an interface has no implicit index signature).
- `contact-form.tsx:207`: Send's className is now just `flex-1`, and Cancel's className is gone. `size='sm'` already sets `h-8 gap-1.5` and the base sets `text-sm`.
- `celebrate.tsx:14`: the run-once guard moved to `tools/run-once.ts` as `claimToolCall`, and celebrate and navigate both use it.
- `celebrate.tsx:53`: `ToolDoneLine` was added to `status-line.tsx` and is used by celebrate and navigate. The DOM is identical.
- `celebrate.tsx:39`: a failed `import('@/lib/confetti')` is now caught and falls back to `toast.success`. Only the error path changes.
- `header.tsx:11` (partial): dropped `[&_svg]:size-4`, which repeated the base. Measured identical: svg 16px, buttons 39x39, screenshots pixel-identical.

Chat and lib
- `types.ts:18`: `MyUIMessage` renamed to `ChatUIMessage` (8 files).
- `types.ts:21`: `CustomDocument` is now `SearchDocument`, private to `search-docs.ts`.
- `types.ts`: `contextDataSchema` was only used as a type after the message-list fix, so it became a plain `{ text: string }` and the zod import is gone.
- `route.ts:131` and `tools/index.ts:9`: there is now one `createChatTools(writer)`. `ChatTools` is `InferUITools<ReturnType<typeof createChatTools>>`, and the drifted stub searchDocs tool is deleted.
- `navigate.ts:10`: `navigate.ts` is now the tool only. The output schema lives beside `resolveNavigation` in the shared resolver (see the tools pass).
- `mascot/constants.ts:48`: `POSES` and `SIMBA_ANIMATIONS` are each exported once, checked with `satisfies`. `toolAnimations` got the same treatment.

## Judged not worth it (6)
- `input.tsx:59` (useLocalStorage): it JSON-serializes, so drafts already saved as raw strings under `simba:draft` would stop restoring, and it adds cross-tab sync. That is a behavior change, not a cleanup.
- `text-selection-popup.tsx:92` (1200 cap plus `.max()`): no schema is parsed anywhere any more, so `.max()` would enforce nothing. Enforcing it on the server is the `route.ts:72` owner item. The single use stays inline.
- `contact-form.tsx:6` (layering): moving the server action means editing `app/(home)/contact`, which is another agent's scope. It is a plain server-action import.
- `contact-form.tsx:128` (shared field config): crosses scope, and the two forms differ in classes, labels and placeholders. A shared config would be more code than the three blocks.
- `lib/ai/chat/types.ts:4` (lib imports a route's tool map): it is a type-only import, and moving the server tools into `lib` is churn.
- `route.ts:53` (logError helper): the guestbook copies are in another scope and log extra fields. It is a 6-line function used twice here.
- `panel.tsx:153` (split the class string into constants): these would be the single-use constants the owner dislikes, and joining them with cn would let tailwind-merge reorder or drop conflicting geometry classes, which is a visual risk.

## Needs owner decision
- `header.tsx:11` (rest of the marker): `size='icon-lg'` would make the buttons 40px. They render at 39x39 today (h-full of the 39px box under the border). Keep the overrides, or accept the 1px change.
- `header.tsx:52`: cross-fade the expand and shrink icons through IconSwap keyed on `expanded`. This is a visible motion change.
- `text-selection-popup.tsx:96`: replace floating-ui and the hand-written dismissal with a Base UI Popover (virtual anchor, `initialFocus={false}`). This changes focus, dismissal and the portal.
- `route.ts:72`: `safeValidateUIMessages({ messages, tools, dataSchemas })` would reject malformed parts that pass today. Proposal: add a `context: z.object({ text: z.string().max(1200) })` data schema, which also enforces the selection cap.
- `search-docs.ts:75`: return `{ title, url, description }` per hit, or shape the output with toModelOutput. This changes what the model reads.
- `search-docs.ts:12`: use the fumadocs search API instead of a second FlexSearch index. This changes ranking, and the search route is a fumadocs file.
- `celebrate.ts:7`: drop `success: true`. This changes the tool output the model reads and the stored parts. Proposal: return `{ intensity }` and gate on `output?.intensity`.
- `render-portfolio.ts:155` and `catalog.ts:92`: drop `slugs` from the project state. This changes the spec's wire format, which the brief says to keep identical. Drop both together if wanted.
- `prompts/chat/directives.ts:1`, `tools.ts:1` and `tools.ts:2`: dedupe the prompt text (the contact-form directive appears 3 times, the dash rule twice, the `<inputs>` blocks restate the zod describes, and the celebrate block retells the tool description). Prompt wording is model behavior and the cut is not provably equivalent. Proposal: keep when-to-use in `tools.ts`, drop the `<inputs>` blocks, and check a few chats.
- **Existing bug, not changed:** the "hidden" Regenerate button computes `opacity: 0.5`, not 0. The Button base's `disabled:opacity-50` beats `opacity-0`, so it shows at half opacity whenever there is no assistant reply. It is visible in the baseline screenshots too.
- **get-page-content output change (allowed by the brief, listed for the owner):** see the tools pass below.

## Deferred
- None. No file in scope imports fumadocs-ui. `site-pages.ts` (lib's scope) imports a fumadocs-core type; I only import from it.

## Tools folder pass (`src/app/api/chat/utils/tools`)
- NEW `src/app/(llms)/utils/site-path.ts` (agreed with the lib agent) is the single resolver:
  - `parseSitePath` now returns `segments` too, so no caller splits paths by hand.
  - `navigateOutputSchema` and `resolveNavigation` have 2 callers: the navigate tool and the render-portfolio MoreLink.
  - `getAboutMarkdown` builds the exact string `/about.md` serves.
  - `getPageMarkdown(path)` maps a site path to exactly what the matching `.md`/`.mdx` route serves: blog uses `getBlogLLMText`, projects use `getWorkLLMText`, about uses `getAboutMarkdown`, and the other names use `markdownPages`.
- `(llms)/about.md/route.ts` now returns `markdownResponse(await getAboutMarkdown())`. This is the only `(llms)` route edit, coordinated with the lib agent.
- `get-page-content.ts` calls `getPageMarkdown`. `getStaticPageText`, `getText`, the hand splitting and the profile-facts glue are gone.
- `navigate.ts` is the tool only. `render-portfolio.ts` `toSlugs` reads `.segments`.
- `search-docs.ts`: the `Tag` constant is inlined, and the `tagParam` juggling is now `tag === 'all' ? undefined : { tag }`.
- `TRAILING_SLASHES` and `WORK_PREFIX` stay at the top level because ultracite's `useTopLevelRegex` requires it. `MAX_ELEMENTS` and `MAX_TESTIMONIALS` were kept because they are named limits.
- **Output change for the owner:**
  - `getPageContent('about')` now equals `/about.md`. That adds the GitHub commit history, so each call makes one GitHub fetch through `getCommitHistoryText`.
  - Blog and project output now equals the `.mdx` routes (title, URL, Source, tags, description, last updated) instead of the raw processed markdown.
  - Verified byte-equal to the route bodies for about, uses, stack, contact, 2 posts and a project.
- **Snapshots** (`scratchpad/tools-snapshots/`, before and after):
  - Tool outputs come from a temporary route `api/chat/snapshot-tmp`, which has been deleted.
  - All 13 navigate outputs (/work/x, trailing slashes, #section, a bad #section, an unknown path with suggestions, an external URL, a localhost URL, the tags page, padded input) are identical.
  - getPageContent changed only for the about and blog/project paths, as intended. The bad paths still return "Page not found".
  - All 16 llms routes are byte-identical. The `blog.mdx/nope` 404 HTML differs only in chunk hashes.
- **Live Simba** (real model, `/uses`):
  - getPageContent(uses) answered the keyboard question.
  - searchDocs plus getPageContent(blog/hello-world) returned the new `.mdx` text.
  - renderPortfolio with a Project and a MoreLink to `/work` resolved the link to `/projects`.
  - navigate to `/about#story` landed on `/about#story`.
  - All requests returned 200.

## Mascot folder pass (rig-art.ts untouched, byte-identical)
- `rig.tsx`: the `Staging` interface, the `HIDDEN` staging and `stagingFor()` are inlined into SimbaRig.
- `use-sprite-frames.ts`:
  - Inlined `quick()`, `DROWSY_BLINK`, `WAKE_FRAME_MS`, `PHRASE_GAP_*`, `BEAT_*`, `PANT_*` and `advance()`.
  - The twin functions `into()` and `outOf()` became one `inBetween(shown, 'into' | 'out')`.
  - Math.random is called in the same order as before.
  - `cueFor` still returns an updater factory: the pant check mutates `pantAt`, so it can't move into a setState updater, which StrictMode double-invokes.
- `use-reading-eyes.ts`: 13 single-use constants and `VARS` are inlined. `FIRST_LINE_Y`, `LINE_STEP_Y` and `RETURN_MS` are used 2 or 3 times and stay.
- `use-look.ts`: the `LOOK_*` constants are inlined.
- `simba-chip.tsx`: the `HEAD` view is inlined.
- `hooks.ts`: `NAP_AFTER_MS` is no longer exported (nothing outside uses it).
- `constants.ts`: single names, as listed under Fixed.
- `controller.ts` is unchanged. Its state machine is already minimal: each flag (queue, activity, drowsy, away, resting) carries a distinct rule. `REST`, `HIDDEN` and `SLEEP` must stay module objects, because their identity avoids extra useSyncExternalStore renders and `SLEEP` is compared by identity.
- No sprites became unused through this pass. `sideRest`, `breathIn`, `breathOut`, `earTwitch`, `weightShift`, `slowBlink`, `booksUp1`, `happy1`, `happy2`, `curiousTilt1`, `curiousTilt2` and `sleeping1` were already unreferenced by the code, and are left in `rig-art.ts` as instructed.
- Folder size: 1438 lines before, 1329 after. That includes the gutter merge into `presence.ts` and deleting `gutter.tsx`.

## Expanded-panel Simba (behavior change requested by the owner)
- **Option chosen:** the simpler one. There is now one sprite, the trigger. The corner copy (`GutterMascot`, `gutter.tsx`) is deleted, and `useGutterSpot` moved into `presence.ts` beside `useTriggerAway`.
- **How it works:**
  - In gutter mode (open, expanded, viewport at least 1000px) the trigger is no longer away. It stays put and is raised above the panel by `min-[1000px]:[:root:has([data-simba-panel])_&]:z-51`.
  - The `:has()` keeps him on top for as long as the popup is mounted, which covers the expand morph, the collapse morph and the close-from-expanded exit, with no timers.
  - In gutter mode a click plays ClickedOn instead of toggling. `onMouseDown` preventDefault keeps focus in the panel's trap.
  - The panel's `onOpenChange` ignores an outside-press on `[data-gutter]`.
  - He is `aria-hidden` with `tabIndex -1` there, matching the old inert trigger plus aria-hidden copy, and hover/active scale are off, as on the old copy.
- **Unchanged:** one controller; the docked and sheet modes; below 1000px he still steps away; reduced motion.
- **Small side effect:** at 1000px and up, while the docked panel is open, the trigger also sits at z-51. The two don't overlap, but another z-50 overlay opened over an open docked panel would now sit under him.
- **Verified with `scratchpad/expanded-gutter3/run.cjs`** (a copy of expanded-gutter2 that clicks the trigger rig):
  - Video (expand, read, talk, click, collapse): 574 rAF samples, exactly one Simba at opacity 1 in every one, the panel stays open after the click, and the box never moves.
  - Close from expanded: 259 samples, all exactly one. Reduced-motion close is the same.
  - The baseline showed a 438ms gap on expand (plus a fade), a gap and a fade on collapse, and a 110ms blank mid-answer.
  - Widths: at 960px there is no visible Simba (away), as before. At 1000px and 1600px it is the trigger at its usual spot.
  - Clip: `scratchpad/expanded-gutter3/expanded-constant.mp4` (plus a `.gif`) and `strip.png`.

## Verification
- `bunx tsc --noEmit`: clean. `bun run check`: 431 files, clean. `bun run check:spelling`: clean.
- **Deterministic mascot trace** (new: `scratchpad/sweep-assistant/det/det.cjs`). It seeds Math.random, uses the Playwright fake clock and logs every sprite and attribute change for: 60s idle, open, a streamed answer with a tool, close, click, the nap and the wake.
  - Before vs after the mascot pass: 162 lines, identical. The only difference is `--look-y` 0.051 vs 0.053px, hover-transition noise that two baseline runs also show.
  - Reduced motion: identical.
  - After the gutter change: identical too (docked path).
- **Old harnesses** (`scratchpad/sweep-assistant/{before,after}`):
  - reading-eyes: same values (lx ±2.8, ly 1.6, 1.95, 2.3, 2.65, the lid at 17px when it blinks, the same afterRest and afterMove).
  - close-fix close-btn and midstream: same structure.
  - talking `stream` and idle-nap `answer` and `click` were already broken before my edits (a stale script and 0 frames).
- **Reels** (`scratchpad/sweep-assistant/rec2.cjs`, a copy of `reel/rec.cjs` with the current animation names):
  - Clips: `mascot-before.mp4` and `mascot-after.mp4`.
  - Fixed sequences match (reactions, greet, the celebrate durations).
  - The after reel's nap phase is invalid: a remount from another agent's HMR left `window.__m` stale at 14s. The deterministic trace covers the nap and the wake, and they are identical.
- **Screenshots** (`sweep-shots`, mine-assistant vs base): the only differences are the GitHub icon on home and contact (another agent's icons change), max 1/255 noise on guestbook, a 1-row search-390 strip, and a 7x3px edge of the hover-scaled trigger in the simba-panel shot. The simba-panel shot is otherwise identical.
- **Files outside scope:**
  - `src/app/(llms)/utils/site-path.ts` (new) and `src/app/(llms)/about.md/route.ts`, both agreed with the lib agent.
  - The temporary `src/app/api/chat/snapshot-tmp/route.ts` was created and deleted.
  - The dev server was down twice and I restarted it once, per the brief.
