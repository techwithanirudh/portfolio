'use client'

import {
  TOCProvider,
  useActiveAnchor,
  useTOCItems,
} from 'fumadocs-ui/components/toc'
import { ChevronDown, Text } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { cn } from '@/lib/utils'

export const BlogTocProvider = TOCProvider

export function BlogTocInline({ className }: { className?: string }) {
  const items = useTOCItems()

  if (items.length === 0) {
    return null
  }

  return (
    <Collapsible
      className={cn(
        'group rounded-xl bg-card font-sans ring-1 ring-border/60 2xl:hidden',
        className
      )}
      data-blog-toc-inline=''
    >
      <CollapsibleTrigger className='flex w-full items-center gap-2 rounded-xl py-2.5 pr-2 pl-4 font-medium text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50 [&_svg]:size-4'>
        <Text className='-translate-x-0.5' />
        On this page
        <ChevronDown className='ml-auto shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180' />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <ul className='flex flex-col px-4 pb-2'>
          {items.map((item) => (
            <li className='flex py-1' key={item.url}>
              <a
                className='text-muted-foreground text-sm transition-colors hover:text-accent-foreground data-[depth=3]:pl-4 data-[depth=4]:pl-8'
                data-depth={item.depth}
                href={item.url}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function BlogTocMinimap({ className }: { className?: string }) {
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
      data-blog-toc-minimap=''
    >
      <div className='sticky top-16'>
        <HoverCard closeDelay={100} openDelay={100}>
          <HoverCardTrigger asChild>
            <div className='flex max-h-[calc(100dvh-6rem)] flex-col gap-3 overflow-hidden py-3 pl-6'>
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
            className='w-56 overflow-hidden p-0'
            side='right'
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
