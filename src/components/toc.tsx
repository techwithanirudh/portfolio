'use client'

import type { TOCItemType } from 'fumadocs-core/toc'
import { AnchorProvider, useActiveAnchor, useItems } from 'fumadocs-core/toc'
import { TextIcon } from 'lucide-react'
import { Icons } from '@/components/icons/icons'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

export function TOCPopover({
  className,
  items,
}: {
  className?: string
  items: TOCItemType[]
}) {
  if (!items.length) {
    return null
  }

  return (
    <Collapsible className={cn('not-prose group/toc 2xl:hidden', className)}>
      <CollapsibleTrigger className='inline-flex w-full items-center gap-2 border-border border-b py-2.5 pr-2 pl-4 text-muted-foreground text-sm outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 [&_svg]:size-4'>
        <TextIcon className='-translate-x-0.5' />
        On this page
        <Icons.chevronDown className='ml-auto shrink-0 transition-transform duration-200 group-data-[state=open]/toc:rotate-180' />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <ul className='flex max-h-[50vh] flex-col overflow-y-auto px-4 pb-2'>
          {items.map((item) => (
            <li className='flex py-1' key={item.url}>
              <a
                className='text-muted-foreground text-sm transition-colors hover:text-foreground data-[depth=3]:pl-4 data-[depth=4]:pl-8'
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

  return (
    <AnchorProvider toc={items}>
      <TOCMinimapContent className={className} />
    </AnchorProvider>
  )
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
        <div className='flex max-h-[calc(100dvh-6rem)] flex-col gap-3 overflow-hidden pt-7 pb-3 pl-6'>
          {items.map((item) => (
            <div
              aria-hidden
              className='pointer-events-none h-0.5 w-6 shrink-0 rounded-xs bg-muted-foreground/50 transition-colors data-[depth=3]:ml-2 data-[depth=4]:ml-4 data-[depth=3]:w-4 data-[depth=4]:w-2 data-[active=true]:bg-foreground'
              data-active={item.active}
              data-depth={item.original.depth}
              key={item.id}
            />
          ))}
        </div>
      </div>
    </aside>
  )
}
