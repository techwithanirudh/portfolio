'use client'

import type { TOCItemType } from 'fumadocs-core/toc'
import { useItems } from 'fumadocs-ui/components/toc'
import { TOCItem, TOCItems } from 'fumadocs-ui/components/toc/default'
import { useState } from 'react'
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

  return <TOCPopoverContent className={className} />
}

function TOCPopoverContent({ className }: { className?: string }) {
  const items = useItems()
  const [open, setOpen] = useState(false)
  const selectedIndex = items.findIndex((item) => item.active)
  const showSelectedItem = selectedIndex !== -1 && !open

  return (
    <Collapsible
      className={cn(
        'not-prose sticky top-14 z-10 border-border border-b bg-background/80 backdrop-blur-sm xl:block 2xl:hidden',
        className
      )}
      onOpenChange={setOpen}
      open={open}
    >
      <CollapsibleTrigger className='flex h-10 w-full items-center gap-2.5 px-4 py-2.5 text-left text-muted-foreground text-sm outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 md:px-6 [&_svg]:size-4'>
        <ProgressCircle
          className={cn('shrink-0', open && 'text-fd-primary')}
          value={
            (items.findLastIndex((item) => item.active) + 1) /
            Math.max(1, items.length)
          }
        />
        <span className='grid min-w-0 flex-1 *:col-start-1 *:row-start-1'>
          <span
            className={cn(
              'truncate transition-[opacity,translate,color]',
              open && 'text-foreground',
              showSelectedItem &&
                'pointer-events-none -translate-y-full opacity-0'
            )}
          >
            On this page
          </span>
          <span
            className={cn(
              'truncate transition-[opacity,translate]',
              !showSelectedItem &&
                'pointer-events-none translate-y-full opacity-0'
            )}
          >
            {items[selectedIndex]?.original.title}
          </span>
        </span>
        <Icons.chevronDown
          className={cn(
            'mx-0.5 shrink-0 transition-transform',
            open && 'rotate-180'
          )}
        />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className='flex max-h-[50vh] flex-col overflow-y-auto px-4 pb-2 md:px-6'>
          <TOCItems>
            {items.map((item) => (
              <TOCItem
                className={cn(
                  'text-muted-foreground hover:text-foreground',
                  item.active && 'text-fd-primary'
                )}
                item={item.original}
                key={item.id}
                onClick={() => setOpen(false)}
              />
            ))}
          </TOCItems>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function ProgressCircle({
  className,
  value,
}: {
  className?: string
  value: number
}) {
  const size = 18
  const strokeWidth = 1.5
  const radius = size / 2 - strokeWidth
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(1, Math.max(0, value)) * circumference

  return (
    <svg
      aria-label='Table of contents progress'
      aria-valuemax={1}
      aria-valuemin={0}
      aria-valuenow={Math.min(1, Math.max(0, value))}
      className={className}
      height={size}
      role='progressbar'
      viewBox={`0 0 ${size} ${size}`}
      width={size}
    >
      <circle
        className='stroke-current/25'
        cx={size / 2}
        cy={size / 2}
        fill='none'
        r={radius}
        strokeWidth={strokeWidth}
      />
      <circle
        className='transition-all'
        cx={size / 2}
        cy={size / 2}
        fill='none'
        r={radius}
        stroke='currentColor'
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap='round'
        strokeWidth={strokeWidth}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  )
}
