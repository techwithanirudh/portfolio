import type { ReactNode } from 'react'

// `@page { margin: 0 }` leaves Chrome no margin box to draw its own
// header and footer (date, title, URL, page number) in.
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
