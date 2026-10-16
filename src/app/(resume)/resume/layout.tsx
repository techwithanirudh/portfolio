import type { ReactNode } from 'react'

/**
 * Route-scoped CSS for the resume. Rendered inline so it mounts and unmounts
 * with this segment and never leaks into the rest of the site.
 *
 * - `@page { margin: 0 }` leaves Chrome no margin box to draw its own
 *   header and footer (date, title, URL, page number) in. The page padding is
 *   added back on the content itself, see `print:p-[...]` in `page.tsx`.
 * - The sticky bar's bottom border fades in as the page scrolls, where scroll
 *   driven animations are supported. Elsewhere it stays transparent.
 */
const resumeCss = `
@page { margin: 0; }

@supports (animation-timeline: scroll()) {
  @keyframes resume-bar-stuck {
    from { border-bottom-color: transparent; }
    to { border-bottom-color: var(--color-neutral-200); }
  }

  [data-resume-bar] {
    animation: resume-bar-stuck linear both;
    animation-timeline: scroll();
    animation-range: 0 24px;
  }
}
`

export default function ResumeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{resumeCss}</style>
      {children}
    </>
  )
}
