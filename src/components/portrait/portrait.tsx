'use client'

import { useEffect, useRef } from 'react'
import { owner } from '@/constants/site'
import {
  PORTRAIT_EYE_FILL,
  PORTRAIT_HEIGHT,
  PORTRAIT_WIDTH,
} from '@/lib/portrait-eyes'
import { prefersReducedMotion } from '@/lib/reduced-motion'
import { cn } from '@/lib/utils'
import { BlinkingEyes } from './blinking-eyes'
import { PortraitFace } from './portrait-face'

const MAX_OFFSET_SVG = 24
const REACH_PX = 320

export function Portrait({
  className,
  viewBox = `0 0 ${PORTRAIT_WIDTH} ${PORTRAIT_HEIGHT}`,
}: {
  className?: string
  /** Crop into the artwork, e.g. just the head */
  viewBox?: string
}) {
  const eyesRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const eyes = eyesRef.current
    if (!eyes || prefersReducedMotion()) {
      return
    }

    let frame = 0
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = eyes.getBoundingClientRect()
        const dx = event.clientX - (rect.left + rect.width / 2)
        const dy = event.clientY - (rect.top + rect.height / 2)
        const distance = Math.hypot(dx, dy) || 1
        const reach = Math.min(distance / REACH_PX, 1) * MAX_OFFSET_SVG
        eyes.style.translate = `${(dx / distance) * reach}px ${(dy / distance) * reach}px`
      })
    }
    const onLeave = () => {
      eyes.style.translate = ''
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <span className={cn('relative block size-full select-none', className)}>
      <svg
        aria-label={`Portrait of ${owner}`}
        className='pointer-events-none relative size-full'
        preserveAspectRatio='xMidYMid slice'
        role='img'
        viewBox={viewBox}
      >
        <PortraitFace />
        <g
          className='transition-[translate] duration-300 ease-out [[data-bonked]_&>g>path]:scale-y-[0.12] [[data-bonked]_&>g>path]:animate-none'
          fill={PORTRAIT_EYE_FILL}
          ref={eyesRef}
        >
          <BlinkingEyes />
        </g>
      </svg>
    </span>
  )
}
