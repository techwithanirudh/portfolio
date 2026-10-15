// Adapted from chanhdai.com/src/components/collapsible-list.tsx (MIT, © 2026 Chánh Đại). See ../NOTICES.md
import { ChevronDownIcon } from 'lucide-react'
import type React from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

/**
 * Renders the first `max` items, folds the rest behind a Show more toggle.
 * Rebuilt on Radix (`asChild`) where the original used Base UI's `render`.
 */
export function CollapsibleList<T>({
  className,
  itemClassName,
  items,
  keyExtractor,
  max = 3,
  renderItem,
}: {
  className?: string
  itemClassName?: string
  items: T[]
  keyExtractor: (item: T) => string
  max?: number
  renderItem: (item: T, index: number) => React.ReactNode
}) {
  return (
    <Collapsible className='group/collapsible'>
      <ul className={className}>
        {items.slice(0, max).map((item, index) => (
          <li className={itemClassName} key={keyExtractor(item)}>
            {renderItem(item, index)}
          </li>
        ))}
      </ul>

      <CollapsibleContent asChild className='ds-collapsible'>
        <ul className={className}>
          {items.slice(max).map((item, index) => (
            <li className={itemClassName} key={keyExtractor(item)}>
              {renderItem(item, max + index)}
            </li>
          ))}
        </ul>
      </CollapsibleContent>

      {items.length > max && (
        <div className='screen-line-top flex items-center justify-center py-4'>
          <CollapsibleTrigger
            className={cn(
              'ds-label inline-flex h-8 items-center gap-2 rounded-[3px] border border-(--line) bg-(--paper) pr-2.5 pl-3 text-(--ink) transition-colors hover:border-(--ink)'
            )}
          >
            <span className='group-data-[state=open]/collapsible:hidden'>
              Show {items.length - max} more
            </span>
            <span className='hidden group-data-[state=open]/collapsible:inline'>
              Show less
            </span>
            <ChevronDownIcon
              aria-hidden
              className='size-3.5 transition-transform group-data-[state=open]/collapsible:rotate-180'
            />
          </CollapsibleTrigger>
        </div>
      )}
    </Collapsible>
  )
}
