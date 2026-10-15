# Notices: Artboard variant

All code in `src/app/variants/artboard/` is original to this repository.

## Copied or adapted files

None. The brief allowed small utilities from chanhdai.com (MIT), such as the
`screen-line` rule utility and `Panel`; this variant ended up not needing
them, because its rulers, panels and artboard frames are drawn differently
(SVG-free CSS tick rulers, sticky panel columns, frames with live size
labels). If any chanhdai.com code is adapted later, add its path here with
the MIT license text below and a header comment in the file:
`// Adapted from chanhdai.com/<path> (MIT, © 2026 Chánh Đại). See ../NOTICES.md`.

Nothing was taken from braydoncoyer.dev or gregives.co.uk (no license).

## Drawn for this variant

- `_components/simba.tsx`: the Simba line drawing (head, ears, top knot,
  muzzle) is original, written by hand as M / C / L / Z path data.
- `_components/title-bar.tsx`: the anchor-and-handles mark is original.

## Third-party packages used (already dependencies of the repo)

- `lucide-react` (ISC) for UI icons.
- `motion` (MIT) for the selection dock transition and `MotionConfig`.
- `radix-ui` (MIT) for the mobile Layers sheet (Dialog) and, via
  `@/components/ui/tooltip`, the toolbar tooltips.
- `next-themes` (MIT) for the theme toggle.

## Reference license kept for future adaptation

chanhdai.com, `LICENSE`:

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
