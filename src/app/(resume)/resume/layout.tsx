import type { ReactNode } from 'react'

// `@page { margin: 0 }` leaves Chrome no margin box to draw its own
// header and footer (date, title, URL, page number) in. On paper the resume
// is always light, whatever theme the site is in.
// TODO(slopradar): magic-string: the light primary hsl(226, 55%, 45%) is copied here and in og/_lib/template.tsx, export the light tokens once (src/lib/theme-color) and read them in both
const resumeCss = `
@page { margin: 0; }

@media print {
  html,
  body {
    background: #fff;
  }

  [data-resume] {
    color-scheme: light;
    --color-background: #fff;
    --color-foreground: var(--color-neutral-900);
    --color-muted-foreground: var(--color-neutral-600);
    --color-border: var(--color-neutral-300);
    /* The light theme's primary, so links stay readable on white */
    --color-primary: hsl(226, 55%, 45%);
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
