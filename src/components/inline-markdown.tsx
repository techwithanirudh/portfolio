import type { ReactNode } from 'react'
import { PreviewLink } from '@/components/preview-link'

const linkPattern = /\[([^\]]+)\]\(([^)\s]+)\)/g

interface InlineMarkdownProps {
  linkClassName?: string
  /** False renders external links as plain links with no hover preview */
  previews?: boolean
  text: string
}

// Copy written once as text with `[label](href)` links, so the page and the
// llms routes read the same string
export function InlineMarkdown({
  linkClassName,
  previews = true,
  text,
}: InlineMarkdownProps) {
  const parts: ReactNode[] = []
  let cursor = 0

  for (const match of text.matchAll(linkPattern)) {
    const [source, label, href = ''] = match
    parts.push(
      text.slice(cursor, match.index),
      <PreviewLink
        className={linkClassName}
        href={href}
        key={match.index}
        preview={previews ? undefined : null}
      >
        {label}
      </PreviewLink>
    )
    cursor = match.index + source.length
  }
  parts.push(text.slice(cursor))

  return parts
}
