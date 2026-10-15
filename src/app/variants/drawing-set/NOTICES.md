# Third-party notices: Drawing Set

This variant adapts code from **chanhdai.com** (https://github.com/ncdai/chanhdai.com), used under the MIT License reproduced below. Only code was copied. Per that repository's `TRADEMARK.md`, none of its name, wordmark, mark, avatars or other brand assets are used here.

## Files adapted from chanhdai.com

| File in this variant | Source file in chanhdai.com | What changed |
|---|---|---|
| `variant.css` (the `screen-line-*`, `screen-dashed-line-bottom`, `stripe-divider`, `diagonal-stripes` classes and the `--line` token) | `src/styles/globals.css` | Rewritten from Tailwind `@utility` blocks into plain classes scoped under `.v-drawing-set`; colors come from the variant's tokens |
| `_components/panel.tsx` | `src/features/portfolio/components/panel.tsx` | Dropped `border-x` (the sheet column draws the verticals); added `PanelMeta`; drawing-set type scale |
| `_components/collapsible-list.tsx` | `src/components/collapsible-list.tsx` | Rebuilt on Radix `asChild` instead of Base UI `render`; item count in the toggle; class hooks for grid layouts |
| `_components/icon-tile.tsx` | `src/components/ui/icon-tile.tsx` | Squared corners and token colors |
| `_components/tag.tsx` | `src/components/ui/tag.tsx` | Squared corners and token colors |
| `_components/experience-item.tsx` | `src/features/portfolio/components/experiences/experience-item.tsx` | Reads this repo's `ExperienceItemType`; static redline "Current" marker in place of the pinging dot; no UTM rewriting |
| `_components/experience-position-item.tsx` | `src/features/portfolio/components/experiences/experience-position-item.tsx` | Radix Collapsible; boxed plus/minus glyph in place of the animated chevrons; ISO-style periods; inline Markdown links instead of the `Markdown` component. `formatDuration` and `parsePeriodDate` are copied unchanged |
| `_components/title-block.tsx` | `src/components/site-footer-cad.tsx` | Rebuilt as a drawing title block (Project, Title, Drawn, Checked, Scale, Sheet, Rev, Date, Build, Stack, Typeface, Source) with a sheet index; `Field` and `BuildValue` kept from the original |
| `_components/build-info.ts` | `src/lib/build-info.ts` | Source URL and time zone from this site's profile; stack list changed |
| `_components/handwritten-note.tsx` | `src/features/portfolio/components/handwritten-note.tsx` | Accent color and size; `HandwrittenArrow` path unchanged |
| `_components/local-time.tsx` | `src/features/portfolio/components/overview/current-local-time-item.tsx` | Split into icon and value halves sharing one id; "// 5h 30m ahead of you" wording with minutes; `clockHandsPath` and the serialized pre-hydration script approach kept |
| `_components/inline-script.tsx` | `src/components/inline-script.tsx` | Unchanged apart from formatting |

Everything else in this folder (sheet header, pointer readout, balloons, dimension lines, revision table and cloud, BOM, finish symbols, Simba stamp, note box, tools list) is original to this repository.

## MIT License (chanhdai.com)

```
MIT License

Copyright (c) 2026 Chánh Đại

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
