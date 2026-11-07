'use client'

import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useRef,
  useState,
} from 'react'
import { BlurImage } from '@/components/blur-image'
import { Icons } from '@/components/icons/icons'
import { cn } from '@/lib/utils'
import { DemoCard, DemoCardButton } from './demo-card'

const START = 50
const STEP = 5
const BIG_STEP = 20

const clamp = (value: number) => Math.min(100, Math.max(0, value))

interface CompareProps {
  afterAlt: string
  afterLabel?: string
  afterSrc: string
  beforeAlt: string
  beforeLabel?: string
  beforeSrc: string
  caption?: ReactNode
  height: number
  /** What's being compared, read out by screen readers and llms.txt */
  label: string
  width: number
}

// Drag the divider (or tap anywhere, or use the arrow keys) to wipe between two
// screenshots of the same thing. `position` is how much of the frame, from the
// left, still shows the before image.
export function Compare({
  afterAlt,
  afterLabel = 'After',
  afterSrc,
  beforeAlt,
  beforeLabel = 'Before',
  beforeSrc,
  caption,
  height,
  label,
  width,
}: CompareProps) {
  const [position, setPosition] = useState(START)
  const [dragging, setDragging] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  // Touch waits for the first sideways move, so a vertical swipe that starts
  // on the image scrolls the page instead of yanking the divider
  const pending = useRef<{ id: number; x: number } | null>(null)

  const moveTo = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect?.width) {
      return
    }
    setPosition(clamp(((clientX - rect.left) / rect.width) * 100))
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    if (event.pointerType === 'touch') {
      pending.current = { id: event.pointerId, x: event.clientX }
      return
    }
    setDragging(true)
    moveTo(event.clientX)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (pending.current?.id === event.pointerId) {
      if (Math.abs(event.clientX - pending.current.x) < 4) {
        return
      }
      pending.current = null
      setDragging(true)
    }
    if (dragging) {
      moveTo(event.clientX)
    }
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    // A touch that never moved is a tap, so jump the divider there
    if (pending.current?.id === event.pointerId) {
      moveTo(event.clientX)
    }
    pending.current = null
    setDragging(false)
  }

  // The browser took over to scroll, so let go without moving anything
  const onPointerCancel = () => {
    pending.current = null
    setDragging(false)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = {
      ArrowDown: position - STEP,
      ArrowLeft: position - STEP,
      ArrowRight: position + STEP,
      ArrowUp: position + STEP,
      End: 100,
      Home: 0,
      PageDown: position - BIG_STEP,
      PageUp: position + BIG_STEP,
    }[event.key]
    if (next === undefined) {
      return
    }
    event.preventDefault()
    setPosition(clamp(next))
  }

  const rounded = Math.round(position)
  const showsBefore = rounded === 100
  const showsAfter = rounded === 0

  return (
    <DemoCard
      caption={caption}
      controls={
        <>
          <DemoCardButton active={showsBefore} onClick={() => setPosition(100)}>
            {beforeLabel}
          </DemoCardButton>
          <DemoCardButton active={showsAfter} onClick={() => setPosition(0)}>
            {afterLabel}
          </DemoCardButton>
          <DemoCardButton
            aria-label='Reset the divider'
            className='ml-auto'
            disabled={rounded === START}
            onClick={() => setPosition(START)}
          >
            <Icons.undo />
          </DemoCardButton>
        </>
      }
    >
      <div
        className='group/compare relative aspect-(--ratio) w-full cursor-ew-resize touch-pan-y select-none'
        data-dragging={dragging || undefined}
        data-slot='compare-track'
        onLostPointerCapture={onPointerCancel}
        onPointerCancel={onPointerCancel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        ref={trackRef}
        style={
          {
            '--position': `${position}%`,
            '--ratio': (width / height).toFixed(3),
          } as CSSProperties
        }
      >
        <BlurImage
          alt={afterAlt}
          className='absolute inset-0'
          draggable={false}
          fill
          imageClassName='object-cover'
          sizes='(min-width: 768px) 768px, 100vw'
          src={afterSrc}
        />
        {/* The before shot sits on top, cut off at the divider */}
        <div
          className='absolute inset-0 transition-[clip-path] duration-500 ease-out-strong [clip-path:inset(0_calc(100%-var(--position))_0_0)] group-data-dragging/compare:transition-none motion-reduce:transition-none'
          data-slot='compare-before'
        >
          <BlurImage
            alt={beforeAlt}
            className='absolute inset-0'
            draggable={false}
            fill
            imageClassName='object-cover'
            sizes='(min-width: 768px) 768px, 100vw'
            src={beforeSrc}
          />
        </div>

        <CornerLabel className='left-3' hidden={position < 18}>
          {beforeLabel}
        </CornerLabel>
        <CornerLabel className='right-3' hidden={position > 82}>
          {afterLabel}
        </CornerLabel>

        {/* The hairline follows the cut exactly */}
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-y-0 left-(--position) w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_0.5px_rgb(0_0_0/0.25),0_0_12px_rgb(0_0_0/0.35)] transition-[left,opacity] duration-500 ease-out-strong group-data-dragging/compare:transition-none motion-reduce:transition-none',
            (showsBefore || showsAfter) && 'opacity-0'
          )}
        />
        {/* The grip stays a little inside the edges so it never gets cut in
            half, with a 44px wide hit area around it */}
        <div
          aria-label={`Drag to compare: ${label}`}
          aria-orientation='horizontal'
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={rounded}
          aria-valuetext={`${rounded}% ${beforeLabel.toLowerCase()}, ${100 - rounded}% ${afterLabel.toLowerCase()}`}
          className='group/handle absolute inset-y-0 left-[clamp(1rem,var(--position),calc(100%-1rem))] flex w-11 -translate-x-1/2 items-center justify-center outline-none transition-[left] duration-500 ease-out-strong group-data-dragging/compare:transition-none motion-reduce:transition-none'
          onKeyDown={onKeyDown}
          role='slider'
          tabIndex={0}
        >
          <div className='flex h-10 w-6 items-center justify-center gap-0.75 rounded-full bg-white shadow-[0_0_0_0.5px_rgb(0_0_0/0.15),0_2px_8px_rgb(0_0_0/0.3)] transition-[scale,box-shadow] duration-150 ease-out-strong group-focus-visible/handle:ring-[3px] group-focus-visible/handle:ring-ring/60 group-data-dragging/compare:scale-110'>
            <span className='h-3.5 w-0.5 rounded-full bg-black/35' />
            <span className='h-3.5 w-0.5 rounded-full bg-black/35' />
          </div>
        </div>
      </div>
    </DemoCard>
  )
}

function CornerLabel({
  children,
  className,
  hidden,
}: {
  children: ReactNode
  className: string
  hidden: boolean
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'pointer-events-none absolute bottom-3 rounded-full bg-black/50 px-2 py-0.5 font-medium text-white/90 text-xs backdrop-blur-sm transition-opacity duration-200 ease-out-strong',
        hidden && 'opacity-0',
        className
      )}
    >
      {children}
    </span>
  )
}
