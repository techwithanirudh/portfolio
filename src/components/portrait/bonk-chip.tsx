'use client'

import { useSound } from '@web-kits/audio/react'
import { AnimatePresence, m, useAnimate } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
// Not @/lib/toast: that plays a sound too, and the bonk plays its own
import { toast } from 'sonner'
import { error as errorSound, pop } from '@/lib/audio/minimal'
import { PORTRAIT_CHIP_VIEW_BOX } from '@/lib/portrait-eyes'
import { prefersReducedMotion } from '@/lib/reduced-motion'
import { cn } from '@/lib/utils'
import { inlineChipClassName } from './chip-class-names'
import { Portrait } from './portrait'

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

function useBonk() {
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

  return { bonk, bonked, bonks, scope, sulking }
}

export function BonkChip() {
  const { bonk, bonked, bonks, scope, sulking } = useBonk()

  return (
    <span className='relative inline-block'>
      <button
        aria-disabled={sulking || undefined}
        className={cn(
          inlineChipClassName,
          'origin-bottom cursor-pointer align-baseline aria-disabled:cursor-not-allowed'
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
