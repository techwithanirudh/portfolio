'use client'

// The popover trigger and ProgressCircle are adapted from fumadocs-ui
// layouts/docs/page/slots/toc.js (MIT, (c) Fuma Nama)
import type { TOCItemType } from 'fumadocs-core/toc'
import { TOCScrollArea, useItems } from 'fumadocs-ui/components/toc'
import { TOCItem, TOCItems } from 'fumadocs-ui/components/toc/default'
import { clamp } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
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
  const ref = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const selectedIndex = items.findIndex((item) => item.active)
  const showSelectedItem = selectedIndex !== -1 && !open

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!(open && event.target instanceof HTMLElement)) {
        return
      }

      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }

    window.addEventListener('click', onClickOutside)
    return () => window.removeEventListener('click', onClickOutside)
  }, [open])

  // The open list covers the article like a popover, so Escape closes it, and
  // focus goes back to the trigger rather than staying on a link being hidden
  useEffect(() => {
    const header = ref.current
    if (!(open && header)) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return
      }
      setOpen(false)
      header.querySelector('button')?.focus()
    }

    header.addEventListener('keydown', onKeyDown)
    return () => header.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <Collapsible
      className={cn(
        'not-prose sticky top-14 z-10 xl:block 2xl:hidden',
        className
      )}
      data-toc-popover=''
      onOpenChange={setOpen}
      open={open}
    >
      <header
        className={cn(
          'border-b bg-background/90 backdrop-blur-md transition-shadow',
          open && 'shadow-lg'
        )}
        ref={ref}
      >
        <CollapsibleTrigger className='flex h-10 w-full items-center gap-2.5 px-4 py-2.5 text-start text-muted-foreground text-sm focus-visible:bg-muted md:px-6 [&_svg]:size-4'>
          <ProgressCircle
            className={cn('shrink-0', open && 'text-primary')}
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

        <CollapsibleContent className='h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out-strong data-ending-style:h-0 data-starting-style:h-0'>
          <div className='flex max-h-[50vh] flex-col px-4 md:px-6'>
            <TOCScrollArea>
              <TOCItems>
                {items.map((item) => (
                  <TOCItem
                    item={item.original}
                    key={item.id}
                    onClick={() => setOpen(false)}
                  />
                ))}
              </TOCItems>
            </TOCScrollArea>
          </div>
        </CollapsibleContent>
      </header>
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
  const clamped = clamp(0, 1, value)
  const progress = clamped * circumference

  // Hidden: a progressbar's value ("0.1666…") would join the trigger's name
  return (
    <svg
      aria-hidden
      className={className}
      height={size}
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
        className='transition-[stroke-dashoffset]'
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
