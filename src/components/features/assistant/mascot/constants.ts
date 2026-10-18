import type { ChatTools } from '@/lib/ai/chat/types'
import type { SpriteName } from './rig-art'

/** A CSS loop on top of a sprite, for the moves the sheet has no frames for */
export type Motion = 'hop' | 'nod'

/**
 * A sprite from the sheet, mirrored with flip. Every pose keeps his front paws
 * on the ground except reading, where they hold the book
 */
export type Pose =
  | {
      flip?: boolean
      motion?: Motion
      sprite: SpriteName
      /** His mouth opens and shuts as he talks (rest's front sit only) */
      talking?: boolean
    }
  | { hidden: true }

const poses = {
  bashful: { sprite: 'embarrassed' },
  // The sheet's tilt leans to the right, so the left one is its mirror
  curious: { flip: true, sprite: 'curiousTilt' },
  curiousRight: { sprite: 'curiousTilt' },
  hidden: { hidden: true },
  hopping: { motion: 'hop', sprite: 'happy' },
  lookUp: { sprite: 'lookAround' },
  nodding: { motion: 'nod', sprite: 'happy' },
  pleased: { sprite: 'happy' },
  reading: { sprite: 'books' },
  rest: { sprite: 'rest' },
  // Curled up with the z marks, when the page sits idle (controller nap)
  sleeping: { sprite: 'sleeping' },
  surprised: { sprite: 'surprised' },
  // Rest's front sit with the mouth moving, while the answer streams in
  talking: { sprite: 'rest', talking: true },
  thinking: { sprite: 'thinking' },
} satisfies Record<string, Pose>

export type PoseName = keyof typeof poses

// TODO(slopradar): double-name: poses/POSES and ANIMATIONS/SIMBA_ANIMATIONS are one object under two names each, export the satisfies-checked object once (x2 in this file)
export const POSES: Record<PoseName, Pose> = poses

export interface Frame {
  /** ms */
  duration: number
  pose: PoseName
}

const seq = (...frames: [PoseName, number][]) =>
  frames.map(([pose, duration]): Frame => ({ duration, pose }))

const ANIMATIONS = {
  Butterfly: seq(
    ['lookUp', 600],
    ['curious', 600],
    ['curiousRight', 600],
    ['lookUp', 500],
    ['pleased', 700]
  ),
  Celebrate: seq(['hopping', 1600], ['pleased', 800]),
  ClickedOn: seq(['surprised', 450], ['pleased', 800]),
  Embarrassed: seq(['bashful', 1800]),
  Flower: seq(['curious', 700], ['pleased', 1000]),
  Greet: seq(['nodding', 1500], ['pleased', 500]),
  Hide: seq(['hidden', 450]),
  Idle: seq(['rest', 2600]),
  LookUp: seq(['lookUp', 1400]),
  Play: seq(['hopping', 1600]),
  Pleased: seq(['pleased', 1400]),
  Reading: seq(['reading', 2400]),
  Show: seq(['hidden', 120], ['rest', 450]),
  Sniffing: seq(['curious', 900], ['curiousRight', 900], ['thinking', 1100]),
  Writing: seq(['talking', 2400]),
} satisfies Record<string, Frame[]>

export type AnimationName = keyof typeof ANIMATIONS

export const SIMBA_ANIMATIONS: Record<AnimationName, Frame[]> = ANIMATIONS

export const animations = {
  bye: 'Hide',
  // No thinking beat while he idles, which reads as loading
  idle: [
    'Butterfly',
    'Embarrassed',
    'Flower',
    'Greet',
    'LookUp',
    'Play',
    'Pleased',
  ],
  open: ['ClickedOn', 'Pleased'],
  rest: 'Idle',
  show: 'Show',
  submit: 'Reading',
  thinking: 'Reading',
  tool: 'Reading',
  writing: 'Writing',
} as const satisfies Record<string, AnimationName | readonly AnimationName[]>

const TOOL_ANIMATIONS = {
  celebrate: 'Celebrate',
} satisfies Partial<Record<keyof ChatTools, AnimationName>>

/** What he does while a tool runs, by tool name; the rest play animations.tool */
export const toolAnimations: Partial<Record<string, AnimationName>> =
  TOOL_ANIMATIONS
