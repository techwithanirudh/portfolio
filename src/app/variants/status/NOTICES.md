# Third-party notices: Status variant

This variant adapts code from one MIT-licensed repository. Every adapted file
starts with a header comment naming its source. Everything else in this
folder (the uptime bars, heatmap, incident history, component rows, status
groups, dependencies table, clock face, Simba drawing and all derived-data
logic in `_lib/`) is original to this variant.

## nelsonlai.dev

Source: https://github.com/nelsonlaidev/nelsonlai.dev (local clone at
`/home/user/ref/nelsonlai.dev`, HEAD 86eab10). © 2025 Nelson Lai, MIT.

| File in this variant | Adapted from | What changed |
|---|---|---|
| `_components/tile.tsx` | `src/components/home/about-me.tsx`, `src/components/home/connect.tsx`, `src/components/home/coding-hours.tsx` | The shared card shell (`rounded-2xl p-4 lg:p-6 shadow-feature-card`, icon + title header) extracted into `Tile` / `TileHeader` with 12-column spans |
| `_components/counter.tsx` | `src/components/counter.tsx` | Server renders the final value; resets to 0 only when the count-up starts; skips the animation under reduced motion |
| `_components/marquee.tsx` | `src/components/ui/marquee.tsx` | Horizontal only, `range()` util inlined, duplicate copy `aria-hidden`, reduced-motion fallback in CSS |
| `_components/rotating-word.tsx` | `src/components/home/hero.tsx` (`Introduction`) | Gradient words replaced by one accent; `useReducedMotion` added; the `layout` reflow is dropped because the word sits on its own line; words exposed once to screen readers |
| `_components/hero.tsx` | `src/components/home/hero.tsx` | Layout idea only (introduction + avatar); content and the career strip are new |
| `_components/command-menu.tsx` | `src/components/command-menu.tsx` | Same `CommandSection` / `CommandAction` model and Cmd+K handler; groups are now pages, projects, posts, actions and socials; uses this repo's `@/components/ui/command` |
| `_components/stats-tile.tsx` | `src/components/stats.tsx` | Typed card array, count-up value and hover slide-in link kept; values computed from content instead of API calls |
| `_components/connect-tile.tsx` | `src/components/home/connect.tsx` | Reads this repo's `socials`; adds handles |
| `_components/stack-tile.tsx` | `src/components/home/stacks-card.tsx` | Two-way marquees kept; Simple Icons (not installed) replaced by the repo's own tech-stack icons |
| `variant.css` | `src/styles/globals.css` | `--feature-card` shadow pair (light value gains a hairline ring) and the `marquee-x` keyframes, scoped under `.v-status` |

Not copied: `location-card.tsx` needs `cobe`, which is not installed; the
Local time tile draws an SVG clock face instead. `coding-hours.tsx` needs
WakaTime; its card shape is reused for the GitHub contributions tile, which
reads `getGitHubContributions` from this repo.

### License

```
MIT License

Copyright (c) 2025 Nelson Lai

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
