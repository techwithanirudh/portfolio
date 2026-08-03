'use client'

import type { TOCItemType } from 'fumadocs-core/toc'
import { useActiveAnchor, useItems } from 'fumadocs-ui/components/toc'
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
