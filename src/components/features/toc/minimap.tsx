'use client'

import type { TOCItemType } from 'fumadocs-core/toc'
import { useActiveAnchor, useItems } from 'fumadocs-ui/components/toc'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { cn } from '@/lib/utils'

export function TOCMinimap({
  className,
  items,
}: {
  className?: string
  items: TOCItemType[]
}) {
  if (!items.length) {
    return null
  }

  return <TOCMinimapContent className={className} />
}

function TOCMinimapContent({ className }: { className?: string }) {
  const items = useItems()
  const activeAnchor = useActiveAnchor()

  return (
    <aside
      className={cn(
        'hidden w-[72px] shrink-0 2xl:absolute 2xl:inset-y-0 2xl:right-full 2xl:block',
        className
      )}
      data-active-anchor={activeAnchor}
      data-toc-minimap=''
    >
      <div className='sticky top-14'>
        <HoverCard closeDelay={100} openDelay={100}>
          <HoverCardTrigger asChild>
            <button
              aria-label='Open table of contents'
              className='flex max-h-[calc(100dvh-6rem)] flex-col gap-3 overflow-hidden pt-7 pb-3 pl-6 outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
              type='button'
            >
              {items.map((item) => (
                <div
                  aria-hidden
                  className='pointer-events-none h-0.5 w-6 shrink-0 rounded-xs bg-muted-foreground/50 transition-colors data-[depth=3]:ml-2 data-[depth=4]:ml-4 data-[depth=3]:w-4 data-[depth=4]:w-2 data-[active=true]:bg-fd-primary'
                  data-active={item.active}
                  data-depth={item.original.depth}
                  key={item.id}
                />
              ))}
            </button>
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
                <li className='flex py-1' key={item.id}>
                  <a
                    className='line-clamp-2 w-full text-muted-foreground transition-colors hover:text-foreground data-active:text-fd-primary'
                    data-active={item.active}
                    data-depth={item.original.depth}
                    href={item.original.url}
                  >
                    {item.original.title}
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
