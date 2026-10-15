# Notices: Field Notes variant

This variant adapts code from two MIT-licensed repositories. Each adapted
file starts with a header comment naming its source. Ideas taken from
braydoncoyer.dev (no license, all rights reserved) were rebuilt from scratch:
no code, markup or SVG paths from that repository are used.

## Sources

| File in this variant | Source | Licence |
| --- | --- | --- |
| `about/page.tsx` | victoreke.com `app/about/page.tsx` (bio left, sticky aside with photo, "View Résumé" + download button, email) | MIT, © 2023 Victor Eke |
| `about/page.tsx` ("Let's connect!" block) | jahir.dev `src/app/about/page.tsx` | MIT, © 2022 Jahir Fiquitiva |
| `_components/usage.tsx` | victoreke.com `app/components/pages/Usage.tsx`, `app/components/shared/CustomPortableTextFavicon.tsx`, `app/utils/favicon.tsx` (PortableText is not installed, so the list is rendered from `@/constants/portfolio/uses`; favicons come from the repo's own logos or Google's favicon service) | MIT, © 2023 Victor Eke |
| `_components/people.tsx` | victoreke.com `app/components/pages/Heroes.tsx`, `app/components/shared/EasterEgg.tsx` (checkbox idea; react-icons replaced by a drawn SVG) | MIT, © 2023 Victor Eke |
| `_components/now-card.tsx` | jahir.dev `src/components/ui/about/activity/index.tsx`, `book.tsx`, `activity.styles.ts` (activity card structure: state label, title, detail) | MIT, © 2022 Jahir Fiquitiva |
| `_components/local-time.tsx` | jahir.dev `src/components/molecules/footer/now-playing/time.tsx` (hour clock icon paths, "It's currently…" line) and `doing.tsx` | MIT, © 2022 Jahir Fiquitiva |

Ideas only, rebuilt from scratch (braydoncoyer.dev, no licence):
`_components/journey-path.tsx` (alternating chapters joined by a path with a
dot that follows scroll; here the path is computed from measured photo
positions and dashed) and the tilted photos in `_components/taped-photo.tsx`.

Everything else in this folder is original to this variant.

## victoreke.com licence

```
MIT License

Copyright (c) 2023 Victor Eke

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

## jahir.dev licence

```
MIT License

Copyright (c) 2022 Jahir Fiquitiva

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
