'use client'

import type { Root as PageTreeRoot } from 'fumadocs-core/page-tree'
import {
  TOCProvider,
  TOCScrollArea,
  useTOCItems,
} from 'fumadocs-ui/components/toc'
import {
  TOCItem as TOCItemDefault,
  TOCItems as TOCItemsDefault,
} from 'fumadocs-ui/components/toc/default'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { TOCPopover } from 'fumadocs-ui/layouts/docs/page/slots/toc'
import { Icons } from '@/components/icons/icons'
import { cn } from '@/lib/utils'

/**
 * Two fumadocs-powered treatments for the blog's table of contents, split
 * by breakpoint. Both read from a single `TOCProvider` (see `BlogTocProvider`
 * below) so there is one shared scroll-spy for the whole page.
 */

export const BlogTocProvider = TOCProvider

/**
 * Desktop (`lg` and up): an always-expanded left column, styled after
 * https://github.com/braydoncoyer/braydoncoyer.dev -- full heading text
 * indented by depth, with a vertical rail marking the active section as the
 * reader scrolls. The rail/indent/active-tracking behaviour itself is
 * `fumadocs-ui/components/toc/default`'s `TOCItems`/`TOCItem`, imported
 * as-is; only the surrounding column (left-aligned, sticky under the site
 * header) is ours.
 */
export function BlogTocDesktop({ className }: { className?: string }) {
  const items = useTOCItems()

  if (items.length === 0) {
    return null
  }

  return (
    <div
      className={cn(
        'hidden shrink-0 lg:sticky lg:top-14 lg:flex lg:h-[calc(100vh-3.5rem)] lg:w-[240px] lg:flex-col lg:self-start lg:py-8 lg:pr-6',
        className
      )}
    >
      <h2 className='inline-flex items-center gap-1.5 text-fd-muted-foreground text-xs'>
        <Icons.menu className='size-3.5 shrink-0' />
        On this page
      </h2>
      <TOCScrollArea className='ms-px'>
        <TOCItemsDefault>
          {items.map((item) => (
            <TOCItemDefault item={item} key={item.url} />
          ))}
        </TOCItemsDefault>
      </TOCScrollArea>
    </div>
  )
}

// This `DocsLayout` never renders sidebar/nav chrome and its container is
// forced to `display: contents`, so it has no footprint of its own -- it
// exists purely to satisfy `useDocsLayout()`, which `TOCPopover` (below)
// requires, and to give fumadocs' layout CSS variables a `#nd-docs-layout`
// ancestor to attach to. The page tree is empty because this instance
// never renders navigation.
const emptyTree: PageTreeRoot = { children: [], name: '' }

/**
 * Mobile (below `lg`): fumadocs' own `TOCPopover` from the default docs
 * layout (`fumadocs-ui/layouts/docs/page/slots/toc`), reused unmodified --
 * sticky bar, reading-progress ring, the label that swaps to the active
 * heading, and a `ChevronDown` that rotates open into the full list. Only
 * the `top` offset (to clear the site header) and the breakpoint it hides
 * at (`lg` instead of fumadocs' default `xl`) are overridden.
 */
export function BlogTocMobile({ className }: { className?: string }) {
  return (
    <DocsLayout
      containerProps={{ style: { display: 'contents' } }}
      nav={{ enabled: false }}
      sidebar={{ enabled: false }}
      tree={emptyTree}
    >
      <TOCPopover
        container={{ className: cn('top-14 lg:hidden', className) }}
      />
    </DocsLayout>
  )
}
