'use client'

import { useEffect, useRef } from 'react'
import { PORTRAIT_EYE_FILL, PORTRAIT_EYE_PATHS } from '@/lib/portrait-eyes'
import { prefersReducedMotion } from '@/lib/reduced-motion'
import { PortraitFace } from './portrait-face'

const VIEW_BOX = '0 0 947 1160'
const MAX_OFFSET_SVG = 24
const REACH_PX = 320

export function Portrait() {
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
    <div className='relative size-full select-none bg-[linear-gradient(160deg,#c3b6fa,#9fccfa_55%,#7fd0f5)] dark:bg-[linear-gradient(160deg,#7f5ce0,#5a7fe0_55%,#38a8e6)]'>
      <svg
        aria-label='Portrait of Anirudh Sriram'
        className='pointer-events-none relative size-full'
        preserveAspectRatio='xMidYMid slice'
        role='img'
        viewBox={VIEW_BOX}
      >
        <PortraitFace />
        <g
          className='transition-[translate] duration-300 ease-out'
          fill={PORTRAIT_EYE_FILL}
          ref={eyesRef}
        >
          <g className='[&>path]:origin-center [&>path]:animate-blink [&>path]:[transform-box:fill-box] motion-reduce:[&>path]:animate-none'>
            {PORTRAIT_EYE_PATHS.map((d) => (
              <path d={d} key={d} />
            ))}
          </g>
        </g>
      </svg>
    </div>
  )
}
