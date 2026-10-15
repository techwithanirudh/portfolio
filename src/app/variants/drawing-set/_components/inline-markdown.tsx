import Link from 'next/link'
import type { ReactNode } from 'react'

const LINK = /\[([^\]]+)\]\(([^)]+)\)/g

/**
 * Renders the `[text](url)` links in experience descriptions as real links,
 * and leaves everything else as text. Internal paths use `next/link`.
 */
export function InlineMarkdown({ children }: { children: string }) {
  const nodes: ReactNode[] = []
  let last = 0
  for (const match of children.matchAll(LINK)) {
    const [whole, text, href] = match
    const index = match.index ?? 0
    if (index > last) {
      nodes.push(children.slice(last, index))
    }
    nodes.push(
      href?.startsWith('/') ? (
        <Link className='ds-link text-(--ink)' href={href} key={index}>
          {text}
        </Link>
      ) : (
        <a
          className='ds-link text-(--ink)'
          href={href}
          key={index}
          rel='noopener'
          target='_blank'
        >
          {text}
        </a>
      )
    )
    last = index + whole.length
  }
  if (last < children.length) {
    nodes.push(children.slice(last))
  }
  return <>{nodes}</>
}
