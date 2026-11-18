'use client'

import { type ReactNode, useEffect, useId, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * A paragraph clamped by `clampClassName` that opens to its full text when
 * pressed. The toggle is a button laid over the text rather than wrapping it,
 * since the text can hold links; the links sit above it and stay clickable.
 */
export function ClampedDescription({
  children,
  className,
  clampClassName,
}: {
  children: ReactNode
  className?: string
  clampClassName: string
}) {
  const id = useId()
  const ref = useRef<HTMLParagraphElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [clamped, setClamped] = useState(false)

  // Whether the clamp cuts anything depends on the width (and the breakpoint
  // the clamp applies at), so measure while collapsed and on every resize
  useEffect(() => {
    const element = ref.current
    if (!element || expanded) {
      return
    }

    const measure = () =>
      setClamped(element.scrollHeight > element.clientHeight + 1)
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [expanded])

  const canToggle = clamped || expanded

  return (
    <div className='relative'>
      <p
        className={cn(
          className,
          !expanded && clampClassName,
          canToggle && '[&_a]:relative [&_a]:z-1'
        )}
        id={id}
        ref={ref}
      >
        {children}
      </p>
      {canToggle && (
        <button
          aria-controls={id}
          aria-expanded={expanded}
          aria-label='Full description'
          className='absolute inset-0 cursor-pointer rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
          onClick={() => setExpanded((open) => !open)}
          type='button'
        />
      )}
    </div>
  )
}
