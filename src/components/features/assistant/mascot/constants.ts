import type { ChatTools } from '@/lib/ai/chat/types'
import type { SpriteName } from './rig-art'

/** A CSS loop on top of a sprite, for the moves the sheet has no frames for */
export type Motion = 'hop'

export type Pose =
  | {
      flip?: boolean
      motion?: Motion
      /** He eases onto this sprite with a soft squash instead of the pop */
      settle?: boolean
      sprite: SpriteName
      /** His mouth opens and shuts as he talks (rest's front sit only) */
      talking?: boolean
    }
  | { hidden: true }

export const POSES = {
  bashful: { sprite: 'embarrassed' },
  // The sheet's tilt leans to the right, so the left one is its mirror
  curious: { flip: true, sprite: 'curiousTilt' },
  curiousRight: { sprite: 'curiousTilt' },
  hidden: { hidden: true },
  hopping: { motion: 'hop', sprite: 'happy' },
  lookUp: { sprite: 'lookAround' },
  pleased: { sprite: 'happy' },
  reading: { sprite: 'books' },
  rest: { sprite: 'rest' },
  settling: { settle: true, sprite: 'rest' },
  sleeping: { sprite: 'sleeping' },
  surprised: { sprite: 'surprised' },
  talking: { sprite: 'rest', talking: true },
  thinking: { sprite: 'thinking' },
} satisfies Record<string, Pose>

export type PoseName = keyof typeof POSES

export interface Frame {
  /** ms */
  duration: number
  pose: PoseName
}

const seq = (...frames: [PoseName, number][]) =>
  frames.map(([pose, duration]): Frame => ({ duration, pose }))

export const SIMBA_ANIMATIONS = {
  Butterfly: seq(
    ['lookUp', 600],
    ['curious', 600],
    ['curiousRight', 600],
    ['lookUp', 500],
    ['rest', 700]
  ),
  Celebrate: seq(['hopping', 1600], ['pleased', 800]),
  ClickedOn: seq(['surprised', 225], ['pleased', 400]),
  Embarrassed: seq(['bashful', 1800]),
  Flower: seq(['curious', 1000], ['rest', 700]),
  Idle: seq(['rest', 2600]),
  LookUp: seq(['lookUp', 1400]),
  Reading: seq(['reading', 2400]),
  Settle: seq(['settling', 300]),
  Show: seq(['hidden', 120], ['rest', 450]),
  Writing: seq(['talking', 2400]),
} satisfies Record<string, Frame[]>

export type AnimationName = keyof typeof SIMBA_ANIMATIONS

export const animations = {
  idle: ['Butterfly', 'Embarrassed', 'Flower', 'LookUp'],
  open: 'ClickedOn',
  rest: 'Idle',
  settle: 'Settle',
  show: 'Show',
  submit: 'Reading',
  thinking: 'Reading',
  tool: 'Reading',
  writing: 'Writing',
} as const satisfies Record<string, AnimationName | readonly AnimationName[]>

/** What he does while a tool runs, by tool name; the rest play animations.tool */
export const toolAnimations: Partial<Record<string, AnimationName>> = {
  celebrate: 'Celebrate',
} satisfies Partial<Record<keyof ChatTools, AnimationName>>
