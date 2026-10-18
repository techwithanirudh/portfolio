import type { ReactNode } from 'react'
import { PreviewLink } from '@/components/preview-link'

// TODO(slopradar): library-exists: a regex link parser beside react-markdown, which experience-timeline.tsx already uses with the same a to PreviewLink mapping; reuse that renderer (check copy with * or _ still reads the same)
const linkPattern = /\[([^\]]+)\]\(([^)\s]+)\)/g

interface InlineMarkdownProps {
  linkClassName?: string
  text: string
}

export function InlineMarkdown({ linkClassName, text }: InlineMarkdownProps) {
  const parts: ReactNode[] = []
  let cursor = 0

  for (const match of text.matchAll(linkPattern)) {
    const [source, label, href = ''] = match
    parts.push(
      text.slice(cursor, match.index),
      <PreviewLink className={linkClassName} href={href} key={match.index}>
        {label}
      </PreviewLink>
    )
    cursor = match.index + source.length
  }
  parts.push(text.slice(cursor))

  return parts
}
