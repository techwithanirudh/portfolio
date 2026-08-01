'use client'

import { TOCItem } from 'fumadocs-core/toc'
import { useOnChange } from 'fumadocs-core/utils/use-on-change'
import {
  TOCProvider,
  TOCScrollArea,
  useTOCItems,
} from 'fumadocs-ui/components/toc'
import type { ComponentProps } from 'react'
import { createContext, use, useMemo, useRef, useState } from 'react'
import { Icons } from '@/components/icons/icons'
import { cn } from '@/lib/utils'

/**
 * A table of contents that collapses to a column of dashes and opens on
 * hover, modelled on the one in Fumadocs' Glass layout but anchored to the
 * left. Below `lg` it detaches into a floating panel opened by tapping.
 */

const OpenContext = createContext<{
  inAnimation: boolean
  open: boolean
  setPinned: (v: boolean) => void
} | null>(null)

const TRANSITION_MS = 300
// Leaving towards the window edge is usually accidental, so close more slowly.
const EDGE_THRESHOLD_PX = 30
const EDGE_EXIT_DELAY_MS = 700
const EXIT_DELAY_MS = 50

function useOpenContext() {
  const ctx = use(OpenContext)
  if (!ctx) {
    throw new Error('useOpenContext must be used within BlogToc')
  }
  return ctx
}

function TocItems() {
  const items = useTOCItems()
  const { open, inAnimation, setPinned } = useOpenContext()

  return (
    <div
      className={cn(
        'grid grid-cols-1 transition-[grid-template-rows]',
        open
          ? '[--row:calc(6*var(--spacing))]'
          : '[--row:calc(3*var(--spacing))]',
        (!open || inAnimation) && 'pointer-events-none'
      )}
      style={{ gridTemplateRows: `repeat(${items.length}, var(--row))` }}
    >
      {items.map((item) => (
        <TOCItem
          autoScroll={open && !inAnimation}
          className={cn(
            'group flex items-center gap-2 text-muted-foreground text-xs transition-colors',
            'data-[active=true]:text-primary data-[active=false]:hover:text-accent-foreground'
          )}
          href={item.url}
          key={item.url}
          onClick={() => setPinned(false)}
        >
          <div
            className={cn(
              'shrink-0 rounded-full bg-muted-foreground/50 transition-[background-color,width,height]',
              'group-data-[active=true]:bg-primary',
              open ? 'h-px w-(--width)' : 'size-1 duration-300'
            )}
            style={
              {
                // Deeper headings get a longer dash, so the shape of the
                // document is readable while collapsed.
                '--width': `calc(pow(${item.depth}, 1.5) * var(--spacing))`,
              } as object
            }
          />
          <span
            className={cn(
              'truncate transition-opacity',
              open ? 'opacity-100' : 'opacity-0'
            )}
          >
            {item.title}
          </span>
        </TOCItem>
      ))}
    </div>
  )
}

interface BlogTocProps {
  container?: ComponentProps<'div'>
  toc: ComponentProps<typeof TOCProvider>['toc']
}

export function BlogToc({ toc, container }: BlogTocProps) {
  const [hover, setHover] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [inAnimation, setInAnimation] = useState(false)
  const exitTimer = useRef<number>(null)
  const transitionTimer = useRef<number>(null)
  const open = hover || pinned

  useOnChange(open, () => {
    setInAnimation(true)
    if (transitionTimer.current) {
      window.clearTimeout(transitionTimer.current)
    }
    transitionTimer.current = window.setTimeout(
      () => setInAnimation(false),
      TRANSITION_MS
    )
  })

  const ctx = useMemo(
    () => ({ inAnimation, open, setPinned }),
    [open, inAnimation]
  )

  if (toc.length === 0) {
    return null
  }

  return (
    <TOCProvider toc={toc}>
      <OpenContext value={ctx}>
        {/** biome-ignore lint/a11y/noStaticElementInteractions: a click-away scrim, the items themselves stay reachable */}
        <div
          aria-hidden='true'
          className={cn(
            'fixed inset-0 z-10 backdrop-blur-sm transition-opacity duration-300',
            '[mask-image:radial-gradient(circle_at_center_left,white,white_200px,transparent_500px)]',
            !open && 'pointer-events-none opacity-0'
          )}
          onClick={() => setPinned(false)}
        />
        <TOCScrollArea
          {...container}
          className={cn(
            // Anchored to the viewport rather than the article, so it never
            // depends on the content container's positioning or overflow.
            'fixed start-1 top-1/2 z-20 grid max-h-[calc(100dvh-8rem)] -translate-y-1/2',
            'grid-cols-[calc(240px-1.5rem)] transition-[width,padding] duration-300',
            'rounded-xl border bg-popover text-popover-foreground shadow-md',
            inAnimation && 'overflow-y-hidden',
            open ? 'w-[240px] p-3' : 'w-6 overflow-clip',
            container?.className
          )}
          onPointerDown={(e) => {
            if (
              !pinned &&
              (e.pointerType === 'touch' || e.pointerType === 'pen')
            ) {
              setPinned(true)
            }
          }}
          onPointerEnter={(e) => {
            if (e.pointerType !== 'mouse') {
              return
            }
            if (exitTimer.current) {
              window.clearTimeout(exitTimer.current)
            }
            setHover(true)
          }}
          onPointerLeave={(e) => {
            if (e.pointerType !== 'mouse' || !hover) {
              return
            }
            if (exitTimer.current) {
              window.clearTimeout(exitTimer.current)
            }
            exitTimer.current = window.setTimeout(
              () => setHover(false),
              e.clientX < EDGE_THRESHOLD_PX ? EDGE_EXIT_DELAY_MS : EXIT_DELAY_MS
            )
          }}
        >
          <div className='flex flex-col'>
            <h2
              className={cn(
                'inline-flex items-center gap-1.5 overflow-hidden text-muted-foreground text-xs transition-[opacity,height]',
                open ? 'h-6 opacity-100' : 'h-0 opacity-0'
              )}
            >
              <Icons.menu className='size-3.5 shrink-0' />
              On this page
            </h2>
            <TocItems />
          </div>
        </TOCScrollArea>
      </OpenContext>
    </TOCProvider>
  )
}
