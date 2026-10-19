import { type RefObject, useEffect, useRef, useState } from 'react'
import { pick } from './controller'
import type { SpriteName } from './rig-art'

export interface Shown {
  flip: boolean
  sprite: SpriteName
}

interface Step extends Shown {
  /** His chest rises while this frame shows (the pant) */
  chest?: boolean
  /** ms */
  duration: number
}

type Hold = readonly [sprite: SpriteName, ms: number]

interface InBetweens {
  /** On the way from rest */
  into: readonly Hold[]
  /** On the way back to rest */
  out: readonly Hold[]
}

const IN_BETWEEN_FRAME_MS = 80

const NAP_DOWN: readonly Hold[] = [
  ['restBlink1', 600],
  ['nap1', 280],
  ['nap2', 280],
  ['napLoaf', 300],
  ['sleeping2', 340],
  ['sleeping3', 400],
]

/**
 * The sheet's frames into Happy, the curious tilt and booksUp1 turn him from the side
 * sit, so from the front rest those poses swap straight over
 */
const IN_BETWEENS: Partial<Record<SpriteName, InBetweens>> = {
  books: {
    into: [['booksUp2', IN_BETWEEN_FRAME_MS]],
    out: [['booksUp2', IN_BETWEEN_FRAME_MS]],
  },
  sleeping: {
    into: [
      ['restBlink1', 260],
      ['restBlink2', 160],
      ['restBlink3', 520],
      ['restBlink2', 200],
      ...NAP_DOWN,
    ],
    out: NAP_DOWN.toReversed().map(([frame]) => [frame, 110]),
  },
}

/** Frames drawn on rest's front sit: switching between them moves only the eyes, mouth or head */
const REST_BODY: ReadonlySet<SpriteName> = new Set([
  'embarrassed',
  'rest',
  'restBlink1',
  'restBlink2',
  'restBlink3',
  'restLookLeft',
  'restLookLeft1',
  'restLookRight',
  'restLookRight1',
  'restPant1',
  'restPant2',
  'restPant3',
  'restTilt1',
  'restTilt2',
])

const sameBody = (from: Shown, to: Shown) =>
  from.flip === to.flip &&
  REST_BODY.has(from.sprite) &&
  REST_BODY.has(to.sprite)

const hold = (sprite: SpriteName, duration: number, chest = false): Step => ({
  chest,
  duration,
  flip: false,
  sprite,
})

type Beat = readonly Step[]

const look = (eyes: SpriteName, head: SpriteName): Beat => [
  hold(eyes, 120),
  hold(head, 1500),
  hold(eyes, 140),
]

const BEATS: readonly [Beat, ...Beat[]] = [
  look('restLookLeft1', 'restLookLeft'),
  look('restLookRight1', 'restLookRight'),
  [
    hold('restBlink1', 110),
    hold('restBlink2', 90),
    hold('restBlink3', 340),
    hold('restBlink2', 100),
    hold('restBlink1', 150),
  ],
  [hold('restTilt1', 140), hold('restTilt2', 1600), hold('restTilt1', 160)],
]

const PANT: Beat = [
  hold('restPant1', 220, true),
  hold('restPant2', 200, true),
  hold('restPant3', 760, true),
  hold('restPant2', 200),
  hold('restPant1', 240),
]

export const between = (min: number, max: number) =>
  min + Math.random() * (max - min)

const syllable = (): Step[] =>
  Math.random() < 0.4
    ? [
        hold('restPant1', between(50, 80)),
        hold('restPant2', between(90, 150)),
        hold('restPant1', between(50, 70)),
        hold('rest', between(90, 170)),
      ]
    : [hold('restPant1', between(110, 190)), hold('rest', between(100, 190))]

const phrase = (): Beat =>
  Array.from({ length: 3 + Math.floor(Math.random() * 4) }, syllable).flat()

const nextPant = () => Date.now() + 10_000 + Math.random() * 10_000

// The in-between frames are drawn facing one way, so a mirrored target swaps straight over
const inBetween = ({ flip, sprite }: Shown, way: keyof InBetweens): Step[] =>
  (flip ? undefined : IN_BETWEENS[sprite])?.[way].map(([frame, ms]) =>
    hold(frame, ms)
  ) ?? []

const tween = (from: Shown, to: Shown): Step[] => {
  if (from.sprite === 'rest') {
    return inBetween(to, 'into')
  }
  if (to.sprite === 'rest') {
    return inBetween(from, 'out')
  }
  if (from.sprite === 'sleeping') {
    return [
      ...inBetween(from, 'out'),
      hold('rest', IN_BETWEEN_FRAME_MS),
      ...inBetween(to, 'into'),
    ]
  }
  if (from.sprite === 'books' || to.sprite === 'books') {
    return [...inBetween(from, 'out'), ...inBetween(to, 'into')]
  }
  return []
}

interface Run {
  index: number
  /** Bumps on every change that has no in-between frames */
  pop: number
  /** The last pop eases in softly instead of springing, see settle */
  soft: boolean
  steps: readonly Step[]
  talking: boolean
  target: Shown
}

interface RunOptions {
  animate: boolean
  settle: boolean
  talking: boolean
}

const rerun = (
  run: Run,
  target: Shown | null,
  { animate, settle, talking }: RunOptions
): Run | null => {
  if (!target) {
    return run.steps.length > 0 ? { ...run, index: 0, steps: [] } : null
  }
  if (run.target.sprite !== target.sprite || run.target.flip !== target.flip) {
    const steps = animate ? tween(run.target, target) : []
    const pops = steps.length === 0 && !sameBody(run.target, target)
    return {
      index: 0,
      pop: pops ? run.pop + 1 : run.pop,
      soft: pops ? settle : run.soft,
      steps,
      talking,
      target,
    }
  }
  if (run.talking !== talking) {
    return { ...run, index: 0, steps: [], talking }
  }
  return null
}

const play =
  (steps: Beat) =>
  (current: Run): Run => ({ ...current, index: 0, steps })

interface Cue {
  ms: number
  next: () => (current: Run) => Run
}

const cueFor = (
  step: Step | undefined,
  {
    pantAt,
    resting,
    talking,
  }: { pantAt: RefObject<number>; resting: boolean; talking: boolean }
): Cue | null => {
  if (step) {
    return {
      ms: step.duration,
      next: () => (current) => ({ ...current, index: current.index + 1 }),
    }
  }
  if (!resting) {
    return null
  }
  if (talking) {
    // Reset so the next pant waits a full interval after he stops talking
    pantAt.current = 0
    return {
      ms: between(120, 420),
      next: () => play(phrase()),
    }
  }
  pantAt.current ||= nextPant()
  return {
    ms: 3000 + Math.random() * 3000,
    next: () => {
      const pant = Date.now() >= pantAt.current
      if (pant) {
        pantAt.current = nextPant()
      }
      return play(pant ? PANT : pick(BEATS))
    },
  }
}

/**
 * Steps through in-between frames toward a sprite, plus idle beats on rest or mouth phrases
 * while talking. A null target holds the last sprite so he fades out as he was
 */
export function useSpriteFrames(
  target: Shown | null,
  {
    animate,
    settle = false,
    talking = false,
  }: {
    animate: boolean
    settle?: boolean
    talking?: boolean
  }
) {
  const [run, setRun] = useState<Run>({
    index: 0,
    pop: 0,
    soft: false,
    steps: [],
    talking,
    target: target ?? { flip: false, sprite: 'rest' },
  })

  const next = rerun(run, target, { animate, settle, talking })
  if (next) {
    setRun(next)
  }

  const step = animate ? run.steps[run.index] : undefined
  const resting = run.target.sprite === 'rest'
  const pantAt = useRef(0)

  const hidden = !target
  useEffect(() => {
    if (!animate || hidden) {
      return
    }
    const cue = cueFor(step, { pantAt, resting, talking })
    if (!cue) {
      return
    }
    const timer = setTimeout(() => setRun(cue.next()), cue.ms)
    return () => clearTimeout(timer)
  }, [animate, hidden, resting, step, talking])

  return {
    chest: step?.chest ?? false,
    pop: run.pop,
    shown: step ?? run.target,
    soft: run.soft,
  }
}
