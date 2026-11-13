# Simba and the panel (agent simba-panel)

The owner asked for three things, building on the one-sprite approach in `assistant.md` ("Expanded-panel Simba"). There is still exactly one Simba, the trigger.

## 1. In fullscreen, he sits on the input bar
- `panel.tsx` adds `trackBandHeight`, a ref callback on the input band. A ResizeObserver writes the band's height to `--simba-band` on `<html>` and removes it on unmount.
- `trigger.tsx`, gutter mode: `data-gutter:translate-y-[calc(max(1rem,env(safe-area-inset-bottom))-var(--simba-band))]`. His 88px box bottom lands on the band's top border. The feet are 1px above it, so he sits on the line.
- The lift follows the band when the textarea grows (it is field-sizing, up to max-h-40) or when a context chip appears.
- Measured box bottom equals the band top:

  | Width | Box bottom = band top | Box right |
  | --- | --- | --- |
  | 1000 | 687 | 981 |
  | 1440 | 787 | 1421 |
  | 1600 | 787 | 1581 |
  | 2000 | 987 | 1981 |

- At 999px he is away while the panel is expanded, as before.
- **No padding was needed.** At 1000px the 720px reading column ends at x 854, and his painted pixels start at x 918, so messages are never under him.
- **Scrollbar (long fake stream at 1000px):** the scroller's 10px scrollbar runs from x 979 to 989. His painted pixels end before it. His transparent button box overlaps the track by 2px.

## 2. A click on him never closes the panel
- `trigger.tsx`: when the panel is open, a click or keypress plays the grin (`animations.open`, which is ClickedOn) and does nothing else. When closed, it opens the panel.
- `aria-label` is always "Ask Simba". `aria-expanded` carries the state. The header's close button is the only "Close Simba".
- `onMouseDown` preventDefault applies whenever the panel is open, so focus stays in the panel (and in the expanded panel's trap).
- `data-simba-trigger` marks the trigger. The panel's `onOpenChange` ignores an outside press inside it in every mode, the sheet mode at 640 to 1023px included.
- Checked with `run.cjs clicks` at 1440:
  - Docked: mouse click, Enter and Space (focused, and reached by Tab from the textarea) all leave the panel open.
  - Close button and Escape close it.
  - Closed: Enter and click open it.
  - Fullscreen: a click leaves it open and expanded. Tab never reaches him (he is aria-hidden with tabIndex -1, outside the trap). Forced focus plus Enter and Space still leave it open.
  - Close button closes. Escape collapses, and a second Escape closes.

## 3. Closing from fullscreen
**Before** (`before-close-1000`, `before-video-{1440,2000}`): on the first exit frame the popup jumps from 0,0 1989x1100 to the docked box 1613,488 360x500. The backdrop also goes to `display:none` at once (opacity 1, then hidden). Then a small docked panel fades and scales out at 150ms.
- **Cause:** `context.tsx` reset `expanded` during the render where `open` turned false, so the exit ran in docked geometry, and `mode === 'docked'` hid the backdrop. At 1000px (sheet mode) the backdrop stayed, but the panel still jumped.

**Fix (option B, fade out in place while Simba glides home):**
- `context.tsx` no longer resets `expanded` on close. The panel's `onOpenChangeComplete(false)` docks it once the exit has finished.
- The expanded exit is a plain fade over 300ms: `sm:data-expanded:data-ending-style:scale-100 duration-300`. The backdrop's expanded exit is also 300ms.
- While the popup is mounted (at 1000px and up), the trigger's translate moves at 300ms with the morph easing `cubic-bezier(0.2,0,0,1)`. Scale and opacity keep 200ms ease-out-strong, so hover and press feel the same.
- **Why option B:** it needs no extra stage. Option A would chain the collapse morph and then a docked fade, which is longer and has two motions. Option B uses one duration for the fade, the backdrop and the glide. It is CSS only, and the 300ms translate timing also lines up with the 300ms collapse morph. The expand rise ends 80ms before the 380ms grow, which is not visible with this easing.

**After** (`after-video-2000`):
- The popup stays at 0,0 1989x1100 and only its opacity drops: 1, 0.40, 0.05, 0. The backdrop falls in step.
- Simba glides from y 899 through 938 and 980 to 996 over about 300ms.
- 1440 (`after-close-1440`, `after-video-1440`) and 1000 (`after-close-1000`) behave the same way.

**Reduced motion** (`after-close-reduced-1440`): a plain fade. Simba jumps home on the first frame, because the global reduced-motion rule drops translate transitions.

**Exactly one Simba:** every run shows exactly one Simba at full opacity in every rAF sample, with none missing and none doubled (max visible 1, min full-opacity 1). The runs:
- before and after videos at 2000 and 1440
- closes at 1000, 1440 and 999
- the reduced-motion close
- the mid-answer close

Two exceptions are by design:
- **At 999px** he fades back in under the fading panel, because he is away below 1000px while the panel is expanded.
- **Mid-answer close:** the settle on close is unchanged. `useMascotPanel` sees the same open and away transitions, because `away` is `open && expanded`, which is false after the close.

**Collapse and expand:** during the expand morph he rises from his dock to the bar. During the collapse he drops back, timed to the shrink.

## Evidence
All under `scratchpad/simba-panel/`:
- `{before,after}-{2000,1440}-strip.jpg`: frames from the close mark to +500ms.
- `{before,after}-1000-strip.jpg` and `after-reduced-1440-strip.jpg`.
- `{before,after}-{2000,1440}.mp4`: expand, then close.
- `*/log.json`, plus the `.txt` summaries of the rAF logs: panel rect, opacity and transform, backdrop opacity, band rect, Simba box, opacity and z-index.
- `run.cjs`, the harness. Modes: `close`, `video`, `geo`, `long`, `clicks`, and `HOW=mid` for closing mid-answer.
- To record the before state, the three files were swapped back for about 90 seconds, then restored. Restoring was checked with `cmp`.

## Files
- `src/components/features/assistant/trigger.tsx`
- `src/components/features/assistant/panel.tsx`
- `src/components/features/assistant/context.tsx`

## Checks
- `bunx tsc --noEmit`: clean.
- `bun run check`: my files are clean. The only failure is a format issue in `src/components/hash-link-history.tsx`, which belongs to the backbutton agent.
- `bun run check:spelling`: clean.

## Residual
- A panel reopened during the 300ms exit comes back expanded, because the exit has not finished docking it. This is natural, since the reopen reverses the close.
- Under reduced motion the docked panel's exit still jumps to scale 0.96 before fading. This was already the case; adding `motion-reduce:data-ending-style:scale-100` would fix it, and is left for the owner.
- His 88px hit box overlaps the scroller's scrollbar track by 2px at the bottom right.
- The disk is nearly full (about 600MB free), which is not from this work.
