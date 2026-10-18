'use client'

import { useSound } from '@web-kits/audio/react'
import { AnimatePresence, m, useAnimate } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
// TODO(slopradar): inconsistent: the only src/app file that imports toast from sonner directly instead of @/lib/toast, route the bonk toasts through @/lib/toast or record why they stay silent (owner call: the wrapper adds a sound)
import { toast } from 'sonner'
import { owner } from '@/constants/site'
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

const BlinkingEyes = ({ fill }: { fill?: string }) => (
  <g
    className='[&>path]:origin-center [&>path]:animate-blink [&>path]:[transform-box:fill-box] motion-reduce:[&>path]:animate-none'
    fill={fill}
  >
    {PORTRAIT_EYE_PATHS.map((d) => (
      <path d={d} key={d} />
    ))}
  </g>
)

// TODO(slopradar): misplaced-module: PortraitChip is imported by src/components/features/blog/author-byline.tsx and the about hero, move this file to src/components and drop the export on Portrait
export function Portrait({
  className,
  // TODO(slopradar): magic-number: the 947x1160 artwork size is typed here, in the JSDoc and on the still chip's <image>, export it beside PORTRAIT_CHIP_VIEW_BOX in @/lib/portrait-eyes
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

const chipClassName =
  'mx-[0.04em] inline-block size-[0.8em] shrink-0 translate-y-[0.08em] overflow-hidden rounded-full bg-muted ring-1 ring-border ring-inset'

export function PortraitChip({
  className,
  // TODO(slopradar): boolean-parameter: still switches between the interactive BonkChip and a static chip (one caller each), export a separate StaticPortraitChip and drop the flag
  still = false,
}: {
  className?: string
  still?: boolean
}) {
  if (!still) {
    return <BonkChip className={className} />
  }

  return (
    <span aria-hidden className={cn(chipClassName, className)}>
      <svg className='block size-full' viewBox={PORTRAIT_CHIP_VIEW_BOX}>
        <image height='1160' href='/images/portrait.svg' width='947' />
        <BlinkingEyes fill={PORTRAIT_EYE_FILL} />
      </svg>
    </span>
  )
}

const BONK_MS = 260
const STREAK_RESET_MS = 1500
const COMPLAINTS: Record<number, string> = {
  3: 'ouch',
  5: "hey, that's my face",
  7: 'stop it',
  9: 'okay seriously, stop',
  12: 'AAAARGH',
}
const SULK_AT = 16
const SULK_MS = 5000

function BonkChip({ className }: { className?: string }) {
  const [scope, animate] = useAnimate<HTMLButtonElement>()
  const [bonks, setBonks] = useState(0)
  const [bonked, setBonked] = useState(false)
  const [sulking, setSulking] = useState(false)
  const playPop = useSound(pop)
  const playError = useSound(errorSound)
  const streak = useRef(0)
  const streakTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const bonkedTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const sulkTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(
    () => () => {
      clearTimeout(streakTimer.current)
      clearTimeout(bonkedTimer.current)
      clearTimeout(sulkTimer.current)
    },
    []
  )

  const bonk = () => {
    if (sulking) {
      playError()
      if (!prefersReducedMotion()) {
        animate(
          scope.current,
          { rotate: [null, -10, 9, -6, 3, 0] },
          { duration: 0.45, ease: 'easeOut' }
        )
      }
      return
    }
    playPop()
    setBonks((count) => count + 1)
    setBonked(true)
    // The flag clears BONK_MS after the first bonk of a run, not the last
    bonkedTimer.current ??= setTimeout(() => {
      bonkedTimer.current = undefined
      setBonked(false)
    }, BONK_MS)

    streak.current += 1
    clearTimeout(streakTimer.current)
    streakTimer.current = setTimeout(() => {
      streak.current = 0
    }, STREAK_RESET_MS)
    const complaint = COMPLAINTS[streak.current]
    if (complaint) {
      toast(complaint, { id: 'bonk' })
    }
    if (streak.current >= SULK_AT) {
      streak.current = 0
      setSulking(true)
      sulkTimer.current = setTimeout(() => setSulking(false), SULK_MS)
      toast('you bonked me unconscious. happy?', { id: 'bonk' })
      return
    }
    if (!prefersReducedMotion()) {
      animate(
        scope.current,
        {
          scaleX: [null, 1.16, 0.94, 1.03, 1],
          scaleY: [null, 0.8, 1.08, 0.98, 1],
        },
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
