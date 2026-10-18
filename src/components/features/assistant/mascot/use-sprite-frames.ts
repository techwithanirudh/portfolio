import { useEffect, useRef, useState } from 'react'
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

/**
 * The in-between frames from rest, the sheet's and the extractor's. The
 * sheet's frames into Happy and the curious tilt (and booksUp1) turn him from
 * the side sit, so from the front rest those poses swap straight over
 */
const IN_BETWEENS: Partial<Record<SpriteName, InBetweens>> = {
  // He lifts the book from his paws into his lap
  books: quick('booksUp2'),
  // He settles into a nap slowly and wakes up quicker
  sleeping: {
    frames: ['sleeping1', 'sleeping2', 'sleeping3'],
    into: 250,
    out: 120,
  },
}

/**
 * Rest's front sit and the idle frames drawn on it: changing between them
 * moves only the eyes, the mouth or the head, so nothing pops
 */
const REST_BODY: ReadonlySet<SpriteName> = new Set([
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

/** Small beats while he rests, each ending back on rest */
const BEATS: readonly [Beat, ...Beat[]] = [
  look('restLookLeft1', 'restLookLeft'),
  look('restLookRight1', 'restLookRight'),
  // A slow blink: the lids drop, close for a moment and lift again
  [
    hold('restBlink1', 110),
    hold('restBlink2', 90),
    hold('restBlink3', 340),
    hold('restBlink2', 100),
    hold('restBlink1', 150),
  ],
  [hold('restTilt1', 140), hold('restTilt2', 1600), hold('restTilt1', 160)],
]

/** The mouth eases open and shut over 1.6 s, his chest rising as it opens */
const PANT: Beat = [
  hold('restPant1', 220, true),
  hold('restPant2', 200, true),
  hold('restPant3', 760, true),
  hold('restPant2', 200),
  hold('restPant1', 240),
]

const between = (min: number, max: number) => min + Math.random() * (max - min)

/**
 * A syllable: the mouth eases half open, sometimes on to open, and shuts, about
 * 2.5 a second. Only the muzzle changes, the head and chest stay put
 */
const syllable = (): Step[] =>
  Math.random() < 0.4
    ? [
        hold('restPant1', between(50, 80)),
        hold('restPant2', between(90, 150)),
        hold('restPant1', between(50, 70)),
        hold('rest', between(90, 170)),
      ]
    : [hold('restPant1', between(110, 190)), hold('rest', between(100, 190))]

/** A few syllables run together; the pause before the next is the effect's */
const phrase = (): Beat =>
  Array.from({ length: 3 + Math.floor(Math.random() * 4) }, syllable).flat()

const PHRASE_GAP_MIN_MS = 120
const PHRASE_GAP_MAX_MS = 420

const BEAT_MIN_MS = 3000
const BEAT_JITTER_MS = 3000
const PANT_MIN_MS = 10_000
const PANT_JITTER_MS = 10_000

const nextPant = () => Date.now() + PANT_MIN_MS + Math.random() * PANT_JITTER_MS

const into = ({ flip, sprite }: Shown): Step[] => {
  const run = flip ? undefined : IN_BETWEENS[sprite]
  return run?.frames.map((frame) => hold(frame, run.into)) ?? []
}

const outOf = ({ flip, sprite }: Shown): Step[] => {
  const run = flip ? undefined : IN_BETWEENS[sprite]
  return run?.frames.toReversed().map((frame) => hold(frame, run.out)) ?? []
}

// The in-between frames are drawn facing one way, so a mirrored target swaps
// straight over
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
  /** He talks on rest's sit instead of his idle beats */
  talking: boolean
  target: Shown
}

/**
 * Steps through the in-between frames on the way to a sprite, and through a
 * small beat every few seconds while he rests (a pant every 10 to 20 s), or
 * phrase after phrase of mouth movement while he talks. Without animate it
 * shows the target straight away
 */
export function useSpriteFrames(
  target: Shown,
  animate: boolean,
  talking = false
) {
  const [run, setRun] = useState<Run>({
    index: 0,
    pop: 0,
    steps: [],
    talking,
    target,
  })

  if (run.target.sprite !== target.sprite || run.target.flip !== target.flip) {
    const steps = animate ? tween(run.target, target) : []
    setRun({
      index: 0,
      pop:
        steps.length > 0 || sameBody(run.target, target)
          ? run.pop
          : run.pop + 1,
      steps,
      talking,
      target,
    })
  } else if (run.talking !== talking) {
    // Starting or stopping drops the beat or phrase under way, so he shuts
    // his mouth as soon as the answer ends
    setRun({ ...run, index: 0, steps: [], talking })
  }

  const step = animate ? run.steps[run.index] : undefined
  const resting = run.target.sprite === 'rest'
  // Due time of the next pant, kept across the poses in between
  const pantAt = useRef(0)

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
    if (talking) {
      // A full wait before the next pant, so his mouth doesn't open wide
      // straight after he stops talking
      pantAt.current = 0
      const timer = setTimeout(
        () => setRun((current) => ({ ...current, index: 0, steps: phrase() })),
        between(PHRASE_GAP_MIN_MS, PHRASE_GAP_MAX_MS)
      )
      return () => clearTimeout(timer)
    }
    pantAt.current ||= nextPant()
    const timer = setTimeout(
      () => {
        const pant = Date.now() >= pantAt.current
        if (pant) {
          pantAt.current = nextPant()
        }
        setRun((current) => ({
          ...current,
          index: 0,
          steps: pant ? PANT : pick(BEATS),
        }))
      },
      BEAT_MIN_MS + Math.random() * BEAT_JITTER_MS
    )
    return () => clearTimeout(timer)
  }, [animate, resting, step, talking])

  return {
    chest: step?.chest ?? false,
    pop: run.pop,
    shown: step ?? run.target,
  }
}
