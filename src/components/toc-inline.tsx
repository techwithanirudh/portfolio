'use client'

import type { TOCItemType } from 'fumadocs-core/toc'
import { ChevronDown, Text } from 'lucide-react'
import type { ReactNode } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

interface TOCInlineProps {
  children?: ReactNode
  className?: string
  items: TOCItemType[]
}

export function TOCInline({ children, className, items }: TOCInlineProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <Collapsible
      className={cn(
        'not-prose rounded-none border-0 border-border border-b border-dashed bg-fd-card text-fd-card-foreground',
        className
      )}
    >
      <CollapsibleTrigger className='group inline-flex w-full items-center justify-between px-4 py-2.5 font-medium outline-none focus-visible:inset-ring-2 focus-visible:inset-ring-ring/50'>
        <span className='flex items-center gap-2'>
          <Text className='size-4' />
          {children ?? 'On this page'}
        </span>
        <ChevronDown className='size-4 transition-transform duration-200 group-data-[state=open]:rotate-180' />
      </CollapsibleTrigger>

      <CollapsibleContent className='overflow-hidden data-[state=closed]:animate-fd-collapsible-up data-[state=open]:animate-fd-collapsible-down'>
        <ul className='flex flex-col p-4 pt-0 text-fd-muted-foreground text-sm'>
          {items.map((item) => (
            <li className='flex' key={item.url}>
              <a
                className='w-full border-s py-1.5 hover:text-fd-accent-foreground data-[depth=2]:ps-3 data-[depth=3]:ps-6 data-[depth=4]:ps-9'
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
