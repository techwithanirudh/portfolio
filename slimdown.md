# Bundle Slimdown Plan

Audit of `package.json` dependencies — what to remove, replace, or lazy-load.

---

## ~~Dead Dependencies~~ (DONE)

~~`@radix-ui/react-icons`, `react-fast-marquee`, `@number-flow/react`~~ — removed, zero imports.

---

## Lazy-load: clippyts

**49MB on disk. Agent sprite files are 1–3MB each.** The package is loaded globally because:

1. `'clippyts/src/clippy.css'` is imported in the **root layout** (`src/app/layout.tsx:12`) — parsed on every single page load
2. `ClippyProvider` wraps the entire app via `AISearch` in `src/app/provider.tsx:34`
3. Even though `import('clippyts')` is dynamic in `clippy-provider.tsx`, the CSS import and provider initialization still block the critical path

### What it actually does

Renders a nostalgic animated MS Office assistant (Rover) in the bottom-right corner. Clicking it opens the AI chat panel. It plays animations when the chat opens/closes, when a tool is called, and when a message is sent. That's it — it's a clickable mascot.

### Plan: Fully lazy-load (keep the feature, fix the perf)

Move all Clippy costs off the critical path so it loads after the page is interactive.

1. **Move CSS out of root layout** — remove `import 'clippyts/src/clippy.css'` from `src/app/layout.tsx`. Instead, inject it dynamically inside `ClippyProvider` when the agent actually loads (or co-locate the import in the clippy component file so it's only pulled in with that chunk).

2. **Decouple `AISearch` from `ClippyProvider`** — currently `AISearch` in `src/components/ai/chat.tsx` wraps everything in `<ClippyProvider>`. The chat context (`useChat`, the panel, messages) has zero dependency on Clippy. Restructure so:
   - `AISearch` provides the chat context and panel independently
   - `ClippyProvider` is mounted separately, outside the critical path
   - `useClippy()` calls in `chat.tsx` and `ai-search-trigger.tsx` become optional (check if clippy exists before calling)

3. **Defer `ClippyProvider` mount** — don't mount it eagerly. Options:
   - Mount after `requestIdleCallback` / after hydration
   - Mount on first user interaction (click/scroll)
   - Mount a lightweight FAB button immediately, only load the full Clippy agent when the FAB becomes visible or is interacted with

4. **Files to change:**
   - `src/app/layout.tsx` — remove CSS import
   - `src/components/ai/chat.tsx` — unwrap `ClippyProvider`, make clippy animations optional
   - `src/components/ai/ai-search-trigger.tsx` — handle missing clippy gracefully
   - `src/components/clippy/clippy-provider.tsx` — co-locate CSS import, add idle/interaction-based loading

---

## Revert: @daveyplate/better-auth-ui (~493KB bundle)

Wraps the entire app via `AuthUIProvider` in `src/app/provider.tsx`. Every page pays the cost.

### Prior art: `feat/sound` branch

The `feat/sound` branch (`origin/feat/sound`) is the codebase before `better-auth-ui` was added. It already has working custom implementations of everything the UI package provides:

| Current (better-auth-ui) | feat/sound equivalent | Location on feat/sound |
|---|---|---|
| `AuthUIProvider` (global wrapper) | Nothing — not needed | `src/app/provider.tsx` has no auth wrapper |
| `AuthView` (login/register pages) | `SignInCard` — two social buttons using `signIn.social()` | `src/app/(auth)/login/_components/sign-in-card.tsx` |
| `UserButton` (footer avatar dropdown) | Custom `UserButton` — `DropdownMenu` + `Avatar` + `useSession()` | `src/components/auth/user-button.tsx` |
| `useAuthenticate` (guestbook + blog) | `<Link href={getLoginUrl(...)}>` redirect | `src/lib/auth-client.ts` exports `getLoginUrl()` |
| `AccountView` (account settings) | Did not exist yet | Needs to be built or dropped |

### Migration plan

1. **Restore from `feat/sound`:**
   - `src/components/auth/user-button.tsx` — custom `UserButton` with `DropdownMenu` + `Avatar`
   - `src/components/auth/user-avatar.tsx` — `Avatar` with fallback initials
   - `src/app/(auth)/login/_components/sign-in-card.tsx` — two social login buttons
   - `src/app/(auth)/login/page.tsx` — login page layout
   - `getLoginUrl()` helper in `src/lib/auth-client.ts`

2. **Update current code:**
   - `src/app/provider.tsx` — remove `AuthUIProvider` wrapper entirely (the provider on `feat/sound` has no auth wrapper at all)
   - `src/components/sections/footer/index.tsx` — swap `import { UserButton } from '@daveyplate/better-auth-ui'` to `import { UserButton } from '@/components/auth/user-button'`
   - `src/app/(home)/guestbook/_components/form.tsx` — replace `useAuthenticate` with `<Link href={getLoginUrl('/guestbook')}>` (how `feat/sound` did it)
   - `src/app/(home)/blog/[slug]/page.client.tsx` — replace `useAuthenticate` with `getLoginUrl` redirect
   - `src/app/(auth)/auth/[pathname]/page.tsx` — replace `AuthView` with the restored `SignInCard` or redirect to `/login`
   - `src/app/(auth)/account/[pathname]/page.tsx` — decide: build a custom account page or remove the route
   - `src/styles/globals.css` — remove `@import "@daveyplate/better-auth-ui/css"`

3. **Remove:**
   - `bun remove @daveyplate/better-auth-ui`

4. **Auth client cleanup:**
   - The `feat/sound` auth client didn't have `adminClient()` or `multiSessionClient()` plugins — evaluate if those are still needed. If `multiSession` is used on the account page only and account is dropped, it can go too.

---

## Replace: react-wrap-balancer (~3KB, 8 files)

Used in 8 files (16 instances) as `<Balancer>` wrappers around headings and descriptions. CSS `text-wrap: balance` is now supported in all modern browsers and does the same thing natively.

Replace every `<Balancer>` with a `className="text-balance"` (Tailwind utility) on the wrapped element. Then `bun remove react-wrap-balancer`.

---

## Optional: Evaluate keeping or lazy-loading

These aren't urgent but worth considering:

| Package | Size | Usage | Verdict |
|---|---|---|---|
| `lenis` + `tempus` | ~10KB | Smooth scrolling wrapper | Nice-to-have. Remove both if not essential to UX. |
| `@bprogress/next` | ~6KB | Route transition progress bar | Nice-to-have. One provider in `provider.tsx`. |
| `frimousse` | ~20KB | Emoji picker in 1 component | Keep if guestbook uses it, otherwise remove. |

---

## Summary

| Action | Estimated savings | Effort |
|---|---|---|
| ~~Remove 3 dead deps~~ | ~~~38KB~~ | DONE |
| Lazy-load clippyts | ~1-3MB agent files off critical path | Medium — 4 files to restructure |
| Revert better-auth-ui | ~493KB | Low-medium — restore from `feat/sound`, update 7 imports |
| Replace react-wrap-balancer | ~3KB | Low — find-and-replace across 8 files |

**Total remaining: ~496KB+ off the main bundle**, plus the 1-3MB Clippy agent files moved off the critical path.
