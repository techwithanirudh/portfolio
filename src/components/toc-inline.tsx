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

interface TocInlineProps {
  children?: ReactNode
  className?: string
  items: TOCItemType[]
}

export function TocInline({ children, className, items }: TocInlineProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <Collapsible
      className={cn(
        'not-prose group/inline-toc rounded-xl border border-border bg-card p-0 font-sans',
        className
      )}
    >
      <CollapsibleTrigger className='inline-flex w-full items-center gap-2 rounded-xl py-2.5 pr-2 pl-4 font-medium text-sm outline-none focus-visible:inset-ring-2 focus-visible:inset-ring-ring/50 group-data-[state=open]/inline-toc:rounded-b-none [&_svg]:size-4'>
        <Text className='-translate-x-0.5' />
        {children ?? 'On this page'}
        <ChevronDown className='ml-auto shrink-0 text-muted-foreground transition-transform duration-150 group-data-[state=open]/inline-toc:rotate-180' />
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
