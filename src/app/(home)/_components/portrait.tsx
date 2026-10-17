'use client'

import { useSound } from '@web-kits/audio/react'
import { AnimatePresence, m, useAnimate } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { error as errorSound, pop } from '@/lib/audio/minimal'
import {
  PORTRAIT_CHIP_VIEW_BOX,
  PORTRAIT_EYE_FILL,
  PORTRAIT_EYE_PATHS,
} from '@/lib/portrait-eyes'
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
      <svg className='block size-full' viewBox={PORTRAIT_CHIP_VIEW_BOX}>
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
// A streak ends once you leave the face alone for this long
const STREAK_RESET_MS = 1500
// How many taps in a row it takes before the face starts complaining
const COMPLAINTS: Record<number, string> = {
  3: 'ouch',
  5: "hey, that's my face",
  7: 'stop it',
  9: 'okay seriously, stop',
  12: 'AAAARGH',
}
// Keep going past the last complaint and the face gives up on you for a bit
const SULK_AT = 16
const SULK_MS = 5000

// Tap the face and it squashes, squeezes its eyes shut and says bonk
function BonkChip({ className }: { className?: string }) {
  const [scope, animate] = useAnimate<HTMLButtonElement>()
  const [bonks, setBonks] = useState(0)
  const [bonked, setBonked] = useState(false)
  const [sulking, setSulking] = useState(false)
  const playPop = useSound(pop)
  const playError = useSound(errorSound)
  const streak = useRef(0)
  const streakTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(streakTimer.current), [])

  useEffect(() => {
    if (!sulking) {
      return
    }
    const timer = setTimeout(() => setSulking(false), SULK_MS)
    return () => clearTimeout(timer)
  }, [sulking])

  useEffect(() => {
    if (!bonked) {
      return
    }
    const timer = setTimeout(() => setBonked(false), BONK_MS)
    return () => clearTimeout(timer)
  }, [bonked])

  const bonk = () => {
    if (sulking) {
      // Eyes stay shut, it buzzes and just shakes its head at you
      playError()
      if (!prefersReducedMotion()) {
        animate(
          scope.current,
          { rotate: [0, -10, 9, -6, 3, 0] },
          { duration: 0.45, ease: 'easeOut' }
        )
      }
      return
    }
    playPop()
    setBonks((count) => count + 1)
    setBonked(true)

    streak.current += 1
    clearTimeout(streakTimer.current)
    streakTimer.current = setTimeout(() => {
      streak.current = 0
    }, STREAK_RESET_MS)
    const complaint = COMPLAINTS[streak.current]
    if (complaint) {
      // Straight from sonner, since the pop above is already the sound; one id
      // so each complaint replaces the last instead of stacking up
      toast(complaint, { id: 'bonk' })
    }
    if (streak.current >= SULK_AT) {
      streak.current = 0
      setSulking(true)
      toast('you bonked me unconscious. happy?', { id: 'bonk' })
      return
    }
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
        aria-disabled={sulking || undefined}
        className={cn(
          chipClassName,
          'origin-bottom cursor-pointer align-baseline aria-disabled:cursor-not-allowed',
          className
        )}
        data-bonked={bonked || sulking || undefined}
        // The smooth cursor would sit on the face and hide it, as on Simba
        data-native-cursor
        onClick={bonk}
        ref={scope}
        type='button'
      >
        <Portrait viewBox={PORTRAIT_CHIP_VIEW_BOX} />
      </button>
      <AnimatePresence>
        {bonks > 0 && (
          <m.span
            animate={{ opacity: [0, 1, 0], y: '-0.35em' }}
            aria-hidden
            className='pointer-events-none absolute -top-[0.1em] left-1/2 -translate-x-1/2 font-medium font-mono text-[0.18em] text-primary tracking-normal'
            initial={{ opacity: 0, y: 0 }}
            key={bonks}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            bonk
          </m.span>
        )}
        {sulking && (
          <m.span
            animate={{ opacity: [0, 1, 1, 0], x: '0.25em', y: '-0.45em' }}
            aria-hidden
            className='pointer-events-none absolute -top-[0.1em] left-1/2 font-medium font-mono text-[0.18em] text-muted-foreground tracking-normal'
            // Its own transition, or the infinite repeat below would loop the exit
            // too and the zzz would never leave
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            initial={{ opacity: 0, x: 0, y: 0 }}
            key='zzz'
            transition={{
              duration: 1.6,
              ease: 'easeOut',
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            zzz
          </m.span>
        )}
      </AnimatePresence>
    </span>
  )
}
