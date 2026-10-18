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

interface InBetweens {
  frames: readonly SpriteName[]
  /** ms per frame on the way from rest */
  into: number
  /** ms per frame on the way back, played backwards */
  out: number
}

const IN_BETWEEN_FRAME_MS = 80
const quick = (...frames: SpriteName[]): InBetweens => ({
  frames,
  into: IN_BETWEEN_FRAME_MS,
  out: IN_BETWEEN_FRAME_MS,
})

/** The in-between frames from rest, the sheet's and the extractor's */
const IN_BETWEENS: Partial<Record<SpriteName, InBetweens>> = {
  // He turns to the front with the book at his paws, then lifts it
  books: quick('booksUp1', 'booksUp2'),
  curiousTilt: quick('curiousTilt1', 'curiousTilt2'),
  happy: quick('happy1', 'happy2'),
  // He settles into a nap slowly and wakes up quicker
  sleeping: {
    frames: ['sleeping1', 'sleeping2', 'sleeping3'],
    into: 250,
    out: 120,
  },
}

/**
 * Rest's side sit and the idle frames drawn on it: changing between them
 * moves only a part, so nothing pops
 */
const REST_BODY: ReadonlySet<SpriteName> = new Set([
  'breathIn',
  'breathOut',
  'earTwitch',
  'rest',
  'slowBlink',
  'weightShift',
])

const sameBody = (from: Shown, to: Shown) =>
  from.flip === to.flip &&
  REST_BODY.has(from.sprite) &&
  REST_BODY.has(to.sprite)

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

const into = ({ flip, sprite }: Shown): Step[] => {
  const run = flip ? undefined : IN_BETWEENS[sprite]
  return run?.frames.map((frame) => hold(frame, run.into)) ?? []
}

const outOf = ({ flip, sprite }: Shown): Step[] => {
  const run = flip ? undefined : IN_BETWEENS[sprite]
  return run?.frames.toReversed().map((frame) => hold(frame, run.out)) ?? []
}

// The frames turn him from rest's side sit, so a mirrored target would start
// on the wrong side: that one swaps straight over
const tween = (from: Shown, to: Shown): Step[] => {
  if (from.sprite === 'rest') {
    return into(to)
  }
  if (to.sprite === 'rest') {
    return outOf(from)
  }
  // Whatever wakes him, he gets up to rest before the next pose
  if (from.sprite === 'sleeping') {
    return [...outOf(from), hold('rest', IN_BETWEEN_FRAME_MS), ...into(to)]
  }
  // He puts the book down before another pose, and picks it up after one
  if (from.sprite === 'books' || to.sprite === 'books') {
    return [...outOf(from), ...into(to)]
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
      pop:
        steps.length > 0 || sameBody(run.target, target)
          ? run.pop
          : run.pop + 1,
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
