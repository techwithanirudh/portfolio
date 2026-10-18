'use client'

import { useEffect, useState } from 'react'
import {
  type AnimationName,
  SIMBA_ANIMATIONS,
} from '@/components/features/assistant/mascot/constants'
import { useClaimPageSimba } from '@/components/features/assistant/mascot/presence'
import { SimbaRig } from '@/components/features/assistant/mascot/rig'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export function SimbaLoop({
  animation,
  className,
  // TODO(slopradar): dead-prop: the only caller (not-found-content.tsx) never passes pause, so it is a constant behind a prop; make it a named module constant (LOOP_PAUSE_MS)
  pause = 1200,
  size,
}: {
  animation: AnimationName
  className?: string
  /** ms */
  pause?: number
  /** Height as px, or any CSS length so he can scale with text via em */
  size?: number | string
}) {
  const frames = SIMBA_ANIMATIONS[animation]
  const reducedMotion = useReducedMotion()
  useClaimPageSimba()
  const [index, setIndex] = useState(0)

  // TODO(slopradar): duplication: re-implements SimbaController's frame stepping with a setState timer, drive a local SimbaController (or extract its stepper) so looping and reduced motion live in one place
  useEffect(() => {
    if (reducedMotion) {
      return
    }
    const last = index === frames.length - 1
    const timer = setTimeout(
      () => setIndex(last ? 0 : index + 1),
      (frames[index]?.duration ?? 100) + (last ? pause : 0)
    )
    return () => clearTimeout(timer)
  }, [frames, index, pause, reducedMotion])

  return (
    <SimbaRig
      className={className}
      pose={frames[index]?.pose ?? 'rest'}
      size={size}
    />
  )
}
