'use client'

import type { TOCItemType } from 'fumadocs-core/toc'
import { AnchorProvider, useActiveAnchor, useItems } from 'fumadocs-core/toc'
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

  return (
    <AnchorProvider toc={items}>
      <TOCPopoverContent className={className} />
    </AnchorProvider>
  )
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
          className={cn('shrink-0', open && 'text-foreground')}
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
        <TOCList items={items} />
      </CollapsibleContent>
    </Collapsible>
  )
}

function TOCList({ items }: { items: ReturnType<typeof useItems> }) {
  return (
    <ul className='flex max-h-[50vh] flex-col overflow-y-auto px-4 pb-2 md:px-6'>
      {items.map((item, index) => {
        const isFirst = index === 0
        const isLast = index === items.length - 1
        const currentLineOffset = getLineOffset(item.original.depth)
        const previousLineOffset = isFirst
          ? currentLineOffset
          : getLineOffset(
              items[index - 1]?.original.depth ?? item.original.depth
            )
        const nextLineOffset = isLast
          ? currentLineOffset
          : getLineOffset(
              items[index + 1]?.original.depth ?? item.original.depth
            )

        return (
          <li
            className={cn(
              'prose relative py-1.5 text-sm',
              isFirst && 'pt-0',
              isLast && 'pb-0'
            )}
            key={item.id}
          >
            <TOCTrack
              currentLineOffset={currentLineOffset}
              nextLineOffset={nextLineOffset}
              previousLineOffset={previousLineOffset}
            />
            <a
              className={cn(
                'relative block scroll-m-4 text-muted-foreground transition-colors hover:text-foreground',
                item.active && 'text-foreground'
              )}
              data-active={item.active}
              data-depth={item.original.depth}
              href={item.original.url}
              style={{
                paddingInlineStart: getItemOffset(item.original.depth),
              }}
            >
              {item.original.title}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

function TOCTrack({
  currentLineOffset,
  nextLineOffset,
  previousLineOffset,
}: {
  currentLineOffset: number
  nextLineOffset: number
  previousLineOffset: number
}) {
  return (
    <svg
      aria-hidden
      className={cn(
        'absolute inset-s-0 -top-1.5 bottom-0 -z-1 h-[calc(100%+--spacing(1.5))] rtl:-scale-x-100',
        currentLineOffset !== nextLineOffset && 'bottom-1.5 h-full'
      )}
      style={{ width: Math.max(previousLineOffset, currentLineOffset) + 9 }}
    >
      {previousLineOffset !== currentLineOffset && (
        <path
          className='stroke-foreground/10'
          d={`M ${previousLineOffset + 0.5} 0 C ${previousLineOffset + 0.5} 8 ${currentLineOffset + 0.5} 4 ${currentLineOffset + 0.5} 12`}
          fill='none'
          strokeWidth='1'
        />
      )}
      <line
        className='stroke-foreground/10'
        strokeWidth='1'
        x1={currentLineOffset + 0.5}
        x2={currentLineOffset + 0.5}
        y1={previousLineOffset === currentLineOffset ? '6' : '12'}
        y2='100%'
      />
    </svg>
  )
}

const BASE_LINE_OFFSET = 8

function getItemOffset(depth: number) {
  if (depth <= 2) {
    return 12 + BASE_LINE_OFFSET
  }
  if (depth === 3) {
    return 24 + BASE_LINE_OFFSET
  }
  return 36 + BASE_LINE_OFFSET
}

function getLineOffset(depth: number) {
  if (depth <= 2) {
    return BASE_LINE_OFFSET
  }
  if (depth === 3) {
    return 8 + BASE_LINE_OFFSET
  }
  return 16 + BASE_LINE_OFFSET
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
