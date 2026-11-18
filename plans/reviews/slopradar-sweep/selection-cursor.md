# Selection popup cursor

Owner report: when you hover the "Ask Simba" selection popup, the smooth cursor shows as a dark dot inside an olive ring on top of the button text.

## Root cause

- The cursor is not broken. Over any button it switches to a filled white 24px disk (scale 1.2) with `mix-blend-exclusion`, so it shows the complement of whatever is under it. Over the lilac/indigo primary it reads as an olive disk. The contact form's "Send message" button renders the same disk at the same size and colour (before-primary-*.png).
- The "dark dot" is the cream Simba face in `SimbaChip`. The chip sits at the centre of the popup button, which is where the pointer lands, and exclusion inverts the face to a dark blob with a blue rim.
- The behaviour on origin/main was the same. `smooth-cursor.tsx` only lost `willChange: 'transform'` and the unused props, and main's popup (a hand-rolled floating-ui portal to body) rendered the same `Button` with `SimbaChip`. The Base UI Popover swap (decision 26) did not change the z-index outcome or the target detection: the cursor stays at `z-99999` on body, and `closest('a, button')` still matches.
- The project already handles this for other overlays. `ui/popover.tsx` puts `data-native-cursor` on every Popup, and the Simba trigger (`assistant/trigger.tsx`) does the same so the mascot is never inverted. The selection popup uses the raw Base UI Popover, so it missed that attribute.

## Fix

`src/components/features/assistant/text-selection-popup.tsx`: add `data-native-cursor` to `Popover.Popup`. Over the popup the smooth ring now fades out (opacity 0, scale 2) and the native pointer shows, the same as other popovers and the Simba trigger. `smooth-cursor.tsx` is unchanged, so the cursor looks the same everywhere else.

## Verification

Tested in Playwright chromium headless shell 1243 at 1280x900, deviceScaleFactor 2, fine pointer, light and dark, against localhost:3111.

- Before, with the pointer over the popup: the cursor element had opacity 1, mix exclusion, and the white disk at scale 1.2. In both themes the chip showed inverted.
- After, with the pointer over the popup: the cursor element has opacity 0 and scale 2, and the chip and text render normally.
- Contact "Send message" hover: the after screenshots are byte-identical to the before ones in both themes.
- Clicking the popup opens `[data-simba-panel]`, and the panel contains the selected paragraph text.
- With `.focus()` on the button, the 3px `ring-ring/50` focus ring renders.
- `bunx tsc --noEmit -p .` passes, `bunx biome check` on the file is clean, `bun run check:spelling` is clean, and `bun run doctor` scores 100/100.

Crops are in the session scratchpad under `cursor/`: `before-popup-{light,dark}.png`, `after-popup-{light,dark}.png`, `before/after-primary-{light,dark}.png`, `after-popup-focus-light.png` and `chip-nocursor.png`.
