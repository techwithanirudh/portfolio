# Fullscreen Simba panel: dock on navigation

Bug: in the fullscreen (expanded) panel, following a link (project card, "view all" MoreLink, chat link, navigate tool) or Back/Forward changed the page, but the panel stayed fullscreen over it.

## Mechanism (src/components/features/assistant/panel.tsx only)

- `DockOnRouteChange`: a null component rendered only while `open && expanded` (same pattern as `PageScrollLock`). It records the pathname it mounted on and calls `setExpanded(false)` when `usePathname()` differs. That covers every route change from any source: Link clicks, `router.push` (navigate tool), Back/Forward. It unmounts once docked, so it never runs in docked or sheet mode and never fires on typing, streaming or tool output.
- `onClickCapture` on the Popup: a plain left click on a same-origin `<a>` without `target` or modifier keys docks immediately. Needed for same-page hash links (no pathname change) and starts the glide at click time for cross-page links instead of after the new page commits.
- Both paths go through the existing `setExpanded(false)`, which captures `morphFrom` and runs the same 300 ms shrink morph and Simba glide as Escape. Panel stays open, conversation untouched.
- Unchanged: context.tsx, tools/navigate.tsx (it already docks before `router.push` when expanded on a docked viewport, which the hash-scroll wait relies on), docked-mode and sheet-mode behavior.

## Verification

- `bunx tsc --noEmit -p .`: clean.
- `bunx biome check src/components/features/assistant/panel.tsx`: clean (after `--write` formatting).
- `bun run check:spelling`: clean.
- `bun run doctor`: no issues, score 100.
- Browser (Playwright) verification: NOT RUN. `df -h /System/Volumes/Data` showed 2.2 GB free at start and 1.2 GB after the static checks (below the 3 GB stop line; navigating to project pages also makes the dev server compile new routes into .next). Pending, per path at 1440x900 and 390x844: project card, view all, navigate tool, chat hash link, Back/Forward; assert URL changed, panel open, no data-expanded, messages present, single Simba sprite, no console errors; docked navigation unchanged.

## Residual / open

- 640 to 1023 px (sheet mode, not docked): fullscreen now collapses to the modal sheet on navigation, mirroring Escape; the sheet still covers the new page (pre-existing sheet behavior; the navigate tool closes the panel there instead).
- Same-page hash Back/Forward (pathname unchanged) does not dock; only reachable after a hash link, which already docked.
- Hash-link scroll after docking depends on the scroll lock lifting before Next scrolls to the fragment; untested.
- Under 640 px there is no fullscreen (expand button is `max-sm:hidden`), so 390x844 is unaffected.
