import { useEffect, useState } from 'react'
import { pick } from './controller'
import type { SpriteName } from './rig-art'

export interface Shown {
  flip: boolean
  sprite: SpriteName
}

interface Step extends Shown {
  /** ms */
  duration: number
}

/** The sheet's in-between frames from rest, played backwards on the way back */
const IN_BETWEENS: Partial<Record<SpriteName, readonly SpriteName[]>> = {
  curiousTilt: ['curiousTilt1', 'curiousTilt2'],
  happy: ['happy1', 'happy2'],
  waving: ['waving1', 'waving2'],
}

const IN_BETWEEN_FRAME_MS = 80

const hold = (sprite: SpriteName, duration: number): Step => ({
  duration,
  flip: false,
  sprite,
})

/** Small loops while he rests, each ending back on rest */
const IDLES: readonly [readonly Step[], ...(readonly Step[])[]] = [
  [hold('breathIn', 700), hold('breathOut', 700)],
  [hold('earTwitch', 150), hold('rest', 120), hold('earTwitch', 150)],
  [hold('weightShift', 1200)],
  [hold('slowBlink', 450)],
]

const IDLE_MIN_MS = 4000
const IDLE_JITTER_MS = 5000

const inBetween = (sprite: SpriteName) => hold(sprite, IN_BETWEEN_FRAME_MS)

// The frames turn him from rest's side sit, so a mirrored target would start
// on the wrong side: that one swaps straight over
const tween = (from: Shown, to: Shown): Step[] => {
  if (from.flip || to.flip) {
    return []
  }
  if (from.sprite === 'rest') {
    return (IN_BETWEENS[to.sprite] ?? []).map(inBetween)
  }
  if (to.sprite === 'rest') {
    return (IN_BETWEENS[from.sprite] ?? []).toReversed().map(inBetween)
  }
  return []
}

interface Run {
  index: number
  /** Bumps on every change that has no in-between frames */
  pop: number
  steps: readonly Step[]
  target: Shown
}

/**
 * Steps through the in-between frames on the way to a sprite, and through an
 * idle loop now and then while he rests. Without animate it shows the target
 * straight away
 */
export function useSpriteFrames(target: Shown, animate: boolean) {
  const [run, setRun] = useState<Run>({ index: 0, pop: 0, steps: [], target })

  if (run.target.sprite !== target.sprite || run.target.flip !== target.flip) {
    const steps = animate ? tween(run.target, target) : []
    setRun({
      index: 0,
      pop: steps.length > 0 ? run.pop : run.pop + 1,
      steps,
      target,
    })
  }

  const step = animate ? run.steps[run.index] : undefined
  const resting = run.target.sprite === 'rest'

  useEffect(() => {
    if (!animate) {
      return
    }
    if (step) {
      const timer = setTimeout(
        () => setRun((current) => ({ ...current, index: current.index + 1 })),
        step.duration
      )
      return () => clearTimeout(timer)
    }
    if (!resting) {
      return
    }
    const timer = setTimeout(
      () => setRun((current) => ({ ...current, index: 0, steps: pick(IDLES) })),
      IDLE_MIN_MS + Math.random() * IDLE_JITTER_MS
    )
    return () => clearTimeout(timer)
  }, [animate, resting, step])

  return { pop: run.pop, shown: step ?? run.target }
}
