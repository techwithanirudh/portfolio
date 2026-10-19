# Emails restyle

Both templates in `emails/` (newsletter welcome, contact notification) now share one theme and look like the site. Nothing is committed.

## What changed

- `emails/theme.ts` (new): palette, dark palette, font stacks, web font URLs, radii, every shared inline style, and the head CSS (Caveat `@font-face`, `color-scheme`, dark overrides).
- `emails/components.tsx` (new): `EmailShell` (html, head, fonts, preview, page background, dashed frame, header row with wordmark and a label), `Block` (a section with a dashed top border, like `dashed-stack` / `divider-top-dashed`), `Wordmark` (`imanirudh` plus the primary dot, semibold, -0.5px tracking, same as the header), `ArrowButton` (the site's default button with a trailing arrow).
- `public/emails/arrow-right.png` (new, 448 bytes, 48x48 at 3x for 16px): the Lucide `ArrowRight` the site uses on `Contact me`, stroke `#fafafa` on transparent. It's loaded from `url('/emails/arrow-right.png')`, so it only shows up in real mail after a deploy.
- `newsletter-welcome.tsx`: Bricolage Grotesque and Alex Brush are gone. The email uses Geist, and the signature uses Caveat (the site's `font-hand`). The heading is "Welcome" with the blue dot, like the site's hero titles. The new "Read the blog" button links to `/blog`. Posts are stacked dashed sections with bordered 8px-radius images and a "Read post" link. The footer says why the reader got the email. The image no longer has a fixed `height='320'` with `object-cover`: it's now `width=536`, `height:auto`, so clients without `object-fit` don't squash it. The copy is the same apart from one colon that became a period.
- `contact-notification.tsx`: the inlined hex values are gone and the theme is used instead, which clears the TODO(slopradar) magic-string item. `<Preview>` now gets `message` unchanged, which clears the redundant-truncation item. The message sits in a card (popover fill, border, 8px radius), and there's a "Reply to {name}" arrow button (`mailto:`) and a footer link to `/contact`.
- No TODO(slopradar), em dashes or en dashes are left in `emails/`.

## Token mapping (light / dark)

| Role | Source | Light | Dark |
| --- | --- | --- | --- |
| background | `--color-fd-background` hsl(0 0% 96%) / 7.04% | `#f5f5f5` | `#121212` |
| foreground | `--color-fd-foreground` 3.9% / 92% | `#0a0a0a` | `#ebebeb` |
| muted text | site override hsl(0 0% 39%) / hsla(0 0% 70% / .8) on bg | `#636363` | `#929292` |
| border | `--color-fd-border` hsla(0 0% 80% / .5) / hsla(0 0% 40% / .2), flattened on bg | `#e0e0e0` | `#232323` |
| card (message, image border) | `--color-fd-popover` 98% / `--color-fd-card` 9.8% | `#fafafa` | `#191919` |
| primary | `--color-fd-primary` hsl(226 55% 45%) / hsl(234 100% 83%) | `#3451b2` | `#a8b1ff` (links and dot only) |
| primary foreground | hsl(0 0% 98%) | `#fafafa` | n/a |

Button, from `buttonVariants` default at size `lg` with a trailing icon: 6px radius (`rounded-md`, radius 8px minus 2), 1px primary ring as a border, weight 500, 14/20 type, 40px tall (9px 12px 9px 16px padding plus the border), a white top sheen gradient, and the inset plus drop shadow. The heading uses weight 400 with about -0.045em tracking, like the CTA's `font-normal tracking-tighter`.

## Decisions for the owner

1. The arrow PNG is under `public/emails/`, so it only works on the deployed host. Until then, or when images are blocked, the button shows only its label (`alt=''`).
2. The button stays primary blue in dark mode (the site's dark primary is a light lilac with dark text). A white arrow PNG can't be used on both, so I kept blue with white text. Dark mode switches links and the dot to `#a8b1ff`.
3. The newsletter gained a "Read the blog" button and a footer line ("You're getting this because you subscribed on imanirudh.com."). There's still no unsubscribe link. The template has no unsubscribe URL prop, so add one if Resend's list-unsubscribe header isn't enough.
4. Contact notification: the preview snippet now runs to react-email's 150 character cap, not 120. The new "Reply to {name}" button duplicates the `replyTo` header, which is a convenience; delete it if you'd rather not have it.
5. Crosses: the site's `+` corner marks rely on absolute positioning and can't be reproduced safely with tables, so I left them out. The grid feel comes from the dashed side frame and the dashed section dividers only. The site's `.bg-dashed` hatch also isn't used, because Gmail strips gradient backgrounds.

## Client caveats (not verified in real clients)

- I rendered only in headless Chromium at 600px, light and dark (`prefers-color-scheme`). I didn't test Gmail (web or app), Outlook (Windows, web or Mac) or Apple Mail.
- Gmail: it drops `<style>` dark rules and `@font-face`, so you get Helvetica or Arial and Gmail's own dark inversion. It keeps the inline layout, the dashed borders and the solid button fill, and drops the gradient sheen and the box-shadow.
- Outlook for Windows (Word engine): no web fonts (`mso-font-alt` falls back to Helvetica, then Arial). `border-radius`, `box-shadow` and `background-image` are ignored, so the button is a square solid blue block. Dashed borders on tables usually render, but may show up as dotted. The react-email `Button` handles Outlook padding with its mso spacers.
- Apple Mail and iOS Mail support the fonts, the radius and the dark overrides, so they're closest to the renders.

## Checks

- `bunx biome check emails/`: clean, after `biome check --write emails/`, which only touched the two templates.
- `bunx tsc --noEmit -p .`: clean.
- `cspell` on `emails/*`: clean (I dropped `Segoe UI` from the stack rather than add a word).
- `bun run email:build`: exits 0 but builds nothing. It stops at a prompt to install `@react-email/ui`, which isn't in the repo. This was already the case before my changes, and I didn't install it.
- `email export`: fails on `newsletter-welcome` with `posts` undefined, because export renders without PreviewProps. This happened on the original template too. It does show that `components.tsx` and `theme.ts` aren't picked up as templates.
- I rendered with `@react-email/render` and each template's `PreviewProps` instead (bun-bundled script, Playwright chrome-headless-shell, requests to the site's host served from `public/`).
