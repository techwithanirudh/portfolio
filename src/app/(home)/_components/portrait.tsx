'use client'

import { useSound } from '@web-kits/audio/react'
import { AnimatePresence, motion, useAnimate } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { pop } from '@/lib/audio/minimal'
import { PORTRAIT_EYE_FILL, PORTRAIT_EYE_PATHS } from '@/lib/portrait-eyes'
import { prefersReducedMotion } from '@/lib/reduced-motion'
import { cn } from '@/lib/utils'
import { PortraitFace } from './portrait-face'

const MAX_OFFSET_SVG = 24
const REACH_PX = 320

export function Portrait({
  className,
  viewBox = '0 0 947 1160',
}: {
  className?: string
  /** Crop into the 947x1160 artwork, e.g. just the head */
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
        aria-label='Portrait of Anirudh Sriram'
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
          <g className='[&>path]:origin-center [&>path]:animate-blink [&>path]:[transform-box:fill-box] motion-reduce:[&>path]:animate-none'>
            {PORTRAIT_EYE_PATHS.map((d) => (
              <path d={d} key={d} />
            ))}
          </g>
        </g>
      </svg>
    </span>
  )
}

const CHIP_VIEW_BOX = '110 60 730 730'

const chipClassName =
  'mx-[0.04em] inline-block size-[0.8em] shrink-0 translate-y-[0.08em] overflow-hidden rounded-full bg-muted ring-1 ring-border ring-inset'

// The face as an inline chip, sized in em so it sits in a line of heading text
export function PortraitChip({
  className,
  still = false,
}: {
  className?: string
  /**
   * A decorative copy beside the name, for bylines and small print: the face
   * comes from the cached image and only the eyes blink
   */
  still?: boolean
}) {
  if (!still) {
    return <BonkChip className={className} />
  }

  return (
    <span aria-hidden className={cn(chipClassName, className)}>
      <svg className='block size-full' viewBox={CHIP_VIEW_BOX}>
        <image height='1160' href='/images/portrait.svg' width='947' />
        <g
          className='[&>path]:origin-center [&>path]:animate-blink [&>path]:[transform-box:fill-box] motion-reduce:[&>path]:animate-none'
          fill={PORTRAIT_EYE_FILL}
        >
          {PORTRAIT_EYE_PATHS.map((d) => (
            <path d={d} key={d} />
          ))}
        </g>
      </svg>
    </span>
  )
}

const BONK_MS = 260

// Tap the face and it squashes, squeezes its eyes shut and says bonk
function BonkChip({ className }: { className?: string }) {
  const [scope, animate] = useAnimate<HTMLButtonElement>()
  const [bonks, setBonks] = useState(0)
  const [bonked, setBonked] = useState(false)
  const playPop = useSound(pop)

  useEffect(() => {
    if (!bonked) {
      return
    }
    const timer = setTimeout(() => setBonked(false), BONK_MS)
    return () => clearTimeout(timer)
  }, [bonked])

  const bonk = () => {
    playPop()
    setBonks((count) => count + 1)
    setBonked(true)
    if (!prefersReducedMotion()) {
      animate(
        scope.current,
        { scaleX: [1, 1.16, 0.94, 1.03, 1], scaleY: [1, 0.8, 1.08, 0.98, 1] },
        { duration: 0.45, ease: 'easeOut' }
      )
    }
  }

  return (
    <span className='relative inline-block'>
      <button
        className={cn(
          chipClassName,
          'origin-bottom cursor-pointer align-baseline outline-none focus-visible:ring-2 focus-visible:ring-ring',
          className
        )}
        data-bonked={bonked || undefined}
        onClick={bonk}
        ref={scope}
        type='button'
      >
        <Portrait viewBox={CHIP_VIEW_BOX} />
      </button>
      <AnimatePresence>
        {bonks > 0 && (
          <motion.span
            animate={{ opacity: [0, 1, 0], y: '-0.35em' }}
            aria-hidden
            className='pointer-events-none absolute -top-[0.1em] left-1/2 -translate-x-1/2 font-medium font-mono text-[0.18em] text-primary tracking-normal'
            initial={{ opacity: 0, y: 0 }}
            key={bonks}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            bonk
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
