'use client'

import type { Root as PageTreeRoot } from 'fumadocs-core/page-tree'
import { useActiveAnchor, useTOCItems } from 'fumadocs-ui/components/toc'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { TOCPopover as FumaTOCPopover } from 'fumadocs-ui/layouts/docs/page/slots/toc'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { cn } from '@/lib/utils'

const emptyTree: PageTreeRoot = { children: [], name: '' }

export function TOCPopover({ className }: { className?: string }) {
  return (
    <DocsLayout
      containerProps={{ style: { display: 'contents' } }}
      nav={{ enabled: false }}
      sidebar={{ enabled: false }}
      tree={emptyTree}
    >
      <FumaTOCPopover
        container={{
          className: cn('top-14 h-10 xl:block 2xl:hidden', className),
        }}
      />
    </DocsLayout>
  )
}

export function TOCMinimap({ className }: { className?: string }) {
  const items = useTOCItems()
  const activeAnchor = useActiveAnchor()

  if (items.length === 0) {
    return null
  }

  return (
    <aside
      className={cn(
        'hidden w-[72px] shrink-0 2xl:absolute 2xl:inset-y-0 2xl:right-full 2xl:block',
        className
      )}
      data-toc-minimap=''
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
            alignOffset={16}
            className='w-56 overflow-hidden p-0'
            side='left'
            sideOffset={-60}
          >
            <ul className='flex max-h-[calc(100dvh-6rem)] w-full flex-col overflow-y-auto px-6 py-4 text-sm'>
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
