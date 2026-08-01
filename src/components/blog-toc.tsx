'use client'

import type { Root as PageTreeRoot } from 'fumadocs-core/page-tree'
import {
  TOCProvider,
  useActiveAnchor,
  useTOCItems,
} from 'fumadocs-ui/components/toc'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { TOCPopover } from 'fumadocs-ui/layouts/docs/page/slots/toc'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { cn } from '@/lib/utils'

/**
 * Two treatments for the blog's table of contents, split by breakpoint. Both
 * read from a single `TOCProvider` (`BlogTOCProvider`), so there is one shared
 * scroll-spy for the page rather than one per breakpoint.
 */

export const BlogTOCProvider = TOCProvider

// This `DocsLayout` renders no sidebar, nav, or header, and its container is
// forced to `display: contents`, so it takes up no space and paints nothing.
// It exists for two reasons: `TOCPopover` calls `useDocsLayout()`, which
// throws without it, and fumadocs' `layout:` variant rules are keyed off a
// `#nd-docs-layout` ancestor -- that id lives on the container this renders.
// Without it `--fd-toc-popover-height` never resolves and the bar collapses.
const emptyTree: PageTreeRoot = { children: [], name: '' }

/**
 * Below `2xl`: fumadocs' own `TOCPopover` from the default docs layout,
 * rendered unmodified -- sticky bar, reading-progress ring, the label that
 * swaps between "On this page" and the active heading, and a chevron that
 * rotates open into the full list. Only the container class is overridden,
 * to sit under this site's own sticky header (`top-14`) rather than the docs
 * layout's grid row, and to hand over to the rail at `2xl` instead of `xl`.
 *
 * That handover needs both halves: fumadocs' own class is `xl:hidden`, and
 * `2xl:hidden` does not displace it because tailwind-merge only reconciles
 * classes sharing a variant. Without `xl:block` the bar disappears at 1280px
 * while the rail does not appear until 1536px, leaving a band with no table
 * of contents at all.
 *
 * `h-10` replaces fumadocs' `h-(--fd-toc-popover-height)` for the same reason.
 * That variable is only set below `xl` (`max-xl:layout:[...]`), so once the bar
 * is shown up to `2xl` the height collapses to zero above 1280px and the bar
 * paints on top of the first paragraph. 40px is the value fumadocs uses.
 */
export function BlogTOCPopover({ className }: { className?: string }) {
  return (
    <DocsLayout
      containerProps={{ style: { display: 'contents' } }}
      nav={{ enabled: false }}
      sidebar={{ enabled: false }}
      tree={emptyTree}
    >
      <TOCPopover
        container={{
          className: cn('top-14 h-10 xl:block 2xl:hidden', className),
        }}
      />
    </DocsLayout>
  )
}

/**
 * `2xl` and up: a minimap in the margin beside the article, after
 * https://github.com/braydoncoyer/braydoncoyer.dev -- one tick per heading,
 * indented and shortened by depth, with the active section filled in. Hovering
 * expands it into the full list.
 *
 * This is gated at `2xl` because that is the first breakpoint where the site
 * container stops being full-bleed (it caps at 1400px), and so the only point
 * where there is any margin to sit in. Anything narrower gets the popover
 * above instead.
 *
 * `right-full` resolves against `Section`'s `.container.relative`, not the
 * bordered frame inside it, which is what puts the rail outside the border
 * rather than in the article's padding. `z-20` keeps it and its hover panel
 * above the article: embedded video players ship z-indexes in the millions
 * and do not create a stacking context of their own.
 */
export function BlogTOCMinimap({ className }: { className?: string }) {
  const items = useTOCItems()
  const activeAnchor = useActiveAnchor()

  if (items.length === 0) {
    return null
  }

  return (
    <aside
      className={cn(
        'hidden w-[72px] shrink-0 2xl:absolute 2xl:inset-y-0 2xl:right-full 2xl:z-20 2xl:block',
        className
      )}
      data-blog-toc-minimap=''
    >
      <div className='sticky top-14'>
        <HoverCard closeDelay={100} openDelay={100}>
          <HoverCardTrigger asChild>
            <div className='flex max-h-[calc(100dvh-6rem)] flex-col gap-3 overflow-hidden pt-4 pb-3 pl-6'>
              {items.map((item) => (
                <div
                  aria-hidden
                  className='pointer-events-none h-0.5 w-6 shrink-0 rounded-xs bg-muted-foreground/50 transition-colors data-[depth=3]:ml-2 data-[depth=4]:ml-4 data-[depth=3]:w-4 data-[depth=4]:w-2 data-[active=true]:bg-foreground'
                  data-active={item.url === `#${activeAnchor}`}
                  data-depth={item.depth}
                  key={item.url}
                />
              ))}
            </div>
          </HoverCardTrigger>

          <HoverCardContent
            align='start'
            alignOffset={-8}
            className='w-56 overflow-hidden p-0'
            side='right'
            sideOffset={8}
          >
            <ul className='flex max-h-[calc(100dvh-8rem)] w-full flex-col overflow-y-auto px-4 py-3 text-sm'>
              {items.map((item) => (
                <li className='flex py-1' key={item.url}>
                  <a
                    className='line-clamp-2 w-full text-muted-foreground transition-colors hover:text-foreground data-[depth=3]:pl-4 data-[depth=4]:pl-8 data-[active=true]:text-foreground'
                    data-active={item.url === `#${activeAnchor}`}
                    data-depth={item.depth}
                    href={item.url}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </HoverCardContent>
        </HoverCard>
      </div>
    </aside>
  )
}
