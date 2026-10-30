# Slopradar sweep: tooling

Scope: `emails/**`, `scripts/**`, `next.config.ts`, `package.json` (no markers), the 3 markers in `src/styles/globals.css`. 10 markers in total; none remain.

## Fixed (1)

- next.config.ts:33 env-rule: `SOURCE_MAPS` and `ANALYZE` are now declared as optional server vars in `src/env.ts` and read from `env` in next.config.ts (`import { env } from './src/env'` replaces the side-effect import, so env validation still runs at startup). The schema is `z.string().optional()` and the `=== 'true'` comparisons stay as they were, so any existing value behaves the same.
  - Out-of-scope edit: `src/env.ts`, two lines added (`ANALYZE`, `SOURCE_MAPS`, in alphabetical position). Another agent has uncommitted edits in that file. I left them alone.

## Extra task: resume print CSS, moved to a CSS named page (done, kept)

- Before the change, these @page values were in effect on /resume: `margin: 0` came from the layout's inline `<style>`, which is unlayered, sits in `<body>`, and comes after the globals sheet, so it won over the globals `@page { margin: 12mm }`. `size: A4` came from globals. Every other page used globals' `margin: 12mm; size: A4`. I confirmed this by enumerating the `CSSPageRule`s in the live page and by printing /resume with the inline style removed: that gives 2 pages and the text moves from x=39.6pt to x=73.3pt.
- Change in src/styles/globals.css, inside the existing `@media print` block:
  - added `@page resume { margin: 0; size: A4 }`;
  - added `[data-resume] { page: resume; color-scheme: light; …token overrides… }`, moved from the layout together with its two why-comments.
  - The default `@page` is untouched. The layout's html/body `#fff` background was a duplicate of the existing `html:has([data-resume]), body:has([data-resume])` rule and is dropped.
  - `--color-primary` keeps the literal `hsl(226, 55%, 45%)`: no token stays light in dark mode, because `--color-fd-primary` is overridden in `.dark`.
- Deleted `src/app/(resume)/resume/layout.tsx`: it only returned its children plus the style, and the (resume) group still renders /resume (200) through the root layout. Its TODO(slopradar) magic-string marker went with it. The copy of the color in the og template stays with routes/lib.
- Regenerated route types with `bunx next typegen` so `.next/types/validator.ts` stops pointing at the deleted layout (it does not delete `.next`).
- Verification: Playwright headless Chromium, `page.pdf({ preferCSSPageSize: true, printBackground: true })` under print media, light and dark color schemes. Results before and after:
  - /resume: 1 page A4 (594.96 x 841.92 pt), text box x 39.6–555.9, y 35.1–759.3.
  - /blog/vscode-setup: 4 pages A4, text from x 40.3 (12mm margin).
  - The computed `[data-resume]` tokens are the same (`--color-primary` now serializes as `#3451b2`, which is the same rgb(52, 81, 178)), and `page` is now `resume`.
  - I rasterized all 10 PDF pages with `pdftoppm -r 100` and diffed them with PIL: all pixel-identical.
  - Screen rendering is unaffected, since the moved rules only apply in print.
  - Artifacts are in `scratchpad/sweep-print/` (base-* and after-*).

## Judged not worth it (5)

- emails/contact-notification.tsx:25 magic-string (shared `emails/theme.ts`): the two templates share no color and no font. Contact uses Geist and hex grays with `#3451b2`. Newsletter uses Alex Brush, Bricolage Grotesque and zinc classes. A shared theme module would just move single-use values somewhere else. `primary` is already a local const used 3 times. Making the two palettes match would be a visible change, so the owner would have to ask for it.
- emails/newsletter-welcome.tsx:65 duplication (Font blocks x3): each `<Font>` block has a different family and URL, so no value is actually repeated. A wrapper would add a layer without removing any data.
- scripts/link-previews/utils.ts:23 library-exists (use `extractedReferences`): the premise does not hold under bun. `@/lib/source` under bun has no MDX loader, so each `.mdx` import comes back as its file path. `page.data` then has no frontmatter, no `github`/`website` and no `extractedReferences` (a dry run gave 0 URLs against today's 159). check-links.ts only works because it reads `getText('raw')` from disk. Preloading `fumadocs-mdx/bun`'s `createMdxPlugin` did not populate them either. Getting them would mean running the full MDX compile (twoslash, shiki) inside the script, which is heavier than the current remark parse.
- scripts/link-previews/config.ts:62 duplicate-schema (`frontmatterLinks`): it parses raw frontmatter from both collections, and the parse is lenient on purpose (`.catch(undefined)`; URL validity is checked later by `shouldGeneratePreview`). Deriving it from source.config.ts would import that runtime-heavy module (fumadocs-mdx/config, twoslash) into the script just to reuse two fields, and the rule says source.config.ts only exports collections.
- next.config.ts:94 swallowed-errors (`ignoreBuildErrors`): I kept it and replaced the marker with the one-line reason the marker asked for: `// CI runs \`bun typecheck\`, so \`next build\` skips its own type-check pass` (`.github/workflows/ci.yml:20` runs `bun typecheck`). Whether to drop it is listed below.

## Needs owner decision (4)

- next.config.ts:96 `typescript.ignoreBuildErrors: true`: dropping it would make `next build` fail on type errors, which changes build behavior. Proposal: drop it if Vercel builds should block on types; otherwise keep it as it is now.
- src/styles/globals.css:338 `@layer utilities` to `@utility`: unsafe without an owner decision. `@utility` classes are re-sorted among Tailwind's generated utilities, while the `@layer utilities` block comes after them and wins ties today. Real conflicts exist where that order matters:
  - `contact/_components/hero.tsx:34` has `icon-pop … transition-colors`. Both set `transition-property`, and today icon-pop wins, so the hover scale animates.
  - `blog/[slug]/_components/header.tsx:64,67` has `typography-hero max-w-2xl` and `typography-body … max-w-3xl`. Both set `max-width`, and today typography-* wins.
  - Hover states are not provable by screenshots.
  - Proposal: convert `icon-*` and `typography-*` to `@utility`, and at the same time remove the conflicting classes from those three call sites (keeping today's result: drop `transition-colors`, or merge it into icon-pop; drop `max-w-2xl`/`max-w-3xl`). Then check by hover and screenshot. The dashed classes (`.bg-dashed`, `.dashed-frame`, `.dashed-stack`, `.divider-top-dashed`) are left for the later dashed pass.
- src/styles/globals.css:354 `.border-border` override (border/70 in light mode), and
- src/styles/globals.css:359 `.divide-border` override: these two are one decision. Any fix changes which color every `border-border` / `divide-border` renders, and moving the 70% into `--color-border` would also change `bg-dashed` and the fumadocs `fd-*` borders that read the variable. Proposal: add a `--color-border-subtle` token (border at 70% in light, border in dark), migrate the call sites to `border-border-subtle` / `divide-border-subtle`, and delete both overrides. Before/after screenshots are needed in both themes.

## Deferred (fumadocs files)

None in scope.

## Observation (not a marker)

- `bun run check:links` likely checks only part of what it should: under bun, `@/lib/source` page data has no `toc` or `_exports.elementIds`, so heading anchors (`hashes`) are always empty. It reports "collected 32 URLs, 0 errors". Worth a look separately.

## Verification

- Emails: I rendered both templates with `@react-email/components` `render(…, { pretty: true })` using their PreviewProps, before and after the edits (temp script, now deleted). `cmp`: contact and welcome are byte-identical.
- Link previews: I ran a dry run of `collectUrls()` only (no screenshot generator), before and after. Both give the same 159 URLs from 41 files. Temp scripts deleted.
- `bunx tsc --noEmit`: passed (exit 0) after the main sweep. After the resume task the only error is `src/app/(home)/_components/portrait.tsx(17,30)`, where `./portrait-face` is missing. That file belongs to the portrait agent, not me.
- `bunx biome check --write` on the 6 files I touched: no fixes. `bun run check`: 9 errors, all organizeImports in other agents' files (`src/app/(auth)/account/**`, `uses/_components/hardware.tsx`), none in mine.
- `bun run check:spelling`: pass.
- Env: `ANALYZE=true SOURCE_MAPS=true` gives `env.ANALYZE` and `env.SOURCE_MAPS` = `'true'`. The dev server reloaded next.config.ts by itself and answers 200 on :3111.
- Screenshots: not run. The only globals.css change is removing three CSS comments, which do not reach the compiled CSS, so the pages are pixel-identical without a diff.
