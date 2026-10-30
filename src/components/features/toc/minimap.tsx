'use client'

import type { TOCItemType } from 'fumadocs-core/toc'
import { useActiveAnchor, useItems } from 'fumadocs-ui/components/toc'
import { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
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
  const [open, setOpen] = useState(false)

  return (
    <div
      className={cn(
        'hidden w-[72px] shrink-0 2xl:absolute 2xl:inset-y-0 2xl:right-full 2xl:block',
        className
      )}
      data-active-anchor={activeAnchor}
      data-toc-minimap=''
    >
      <div className='sticky top-14'>
        {/* A popover rather than a hover card: hover still opens it, and
            click, Enter or Space open it too with focus moved into the list */}
        <Popover onOpenChange={setOpen} open={open}>
          <PopoverTrigger
            closeDelay={100}
            delay={100}
            openOnHover
            render={
              <button
                aria-label='Open table of contents'
                className='flex max-h-[calc(100dvh-6rem)] flex-col gap-3 overflow-hidden pt-7 pb-3 pl-6 outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
                type='button'
              />
            }
          >
            {items.map((item) => (
              <div
                aria-hidden
                className='pointer-events-none h-0.5 w-6 shrink-0 rounded-xs bg-muted-foreground/50 transition-colors data-[depth=3]:ml-2 data-[depth=4]:ml-4 data-[depth=3]:w-4 data-[depth=4]:w-2 data-[active=true]:bg-primary'
                data-active={item.active}
                data-depth={item.original.depth}
                key={item.id}
              />
            ))}
          </PopoverTrigger>

          <PopoverContent
            align='start'
            alignOffset={16}
            aria-label='On this page'
            className='w-56 gap-0 overflow-hidden border p-0 ring-0'
            side='left'
            sideOffset={-60}
          >
            <ul className='flex max-h-[calc(100dvh-6rem)] w-full flex-col overflow-y-auto px-6 py-4 text-sm'>
              {items.map((item) => (
                <li className='flex py-1' key={item.id}>
                  <a
                    className='line-clamp-2 w-full text-muted-foreground transition-colors hover:text-foreground data-active:text-primary'
                    data-active={item.active}
                    data-depth={item.original.depth}
                    href={item.original.url}
                    onClick={() => setOpen(false)}
                  >
                    {item.original.title}
                  </a>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
