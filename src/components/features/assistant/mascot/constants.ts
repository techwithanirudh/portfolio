import type { ChatTools } from '@/lib/ai/chat/types'
import type { SpriteName } from './rig-art'

/** A CSS loop on top of a sprite, for the moves the sheet has no frames for */
export type Motion = 'hop'

/**
 * A sprite from the sheet, mirrored with flip. Every pose keeps his front paws
 * on the ground except reading, where they hold the book
 */
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

const poses = {
  bashful: { sprite: 'embarrassed' },
  // The sheet's tilt leans to the right, so the left one is its mirror
  curious: { flip: true, sprite: 'curiousTilt' },
  curiousRight: { sprite: 'curiousTilt' },
  hidden: { hidden: true },
  // The wide open-mouth grin (happy) ends a click on him (animations.open)
  // and the celebrate tool, never his idle
  hopping: { motion: 'hop', sprite: 'happy' },
  lookUp: { sprite: 'lookAround' },
  pleased: { sprite: 'happy' },
  reading: { sprite: 'books' },
  rest: { sprite: 'rest' },
  // Rest, reached from whatever he was doing when the panel closed
  settling: { settle: true, sprite: 'rest' },
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
    ['rest', 700]
  ),
  Celebrate: seq(['hopping', 1600], ['pleased', 800]),
  ClickedOn: seq(['surprised', 450], ['pleased', 800]),
  // The 404 page's loop: a curious tilt each way, then a think
  CuriousLoop: seq(['curious', 900], ['curiousRight', 900], ['thinking', 1100]),
  Embarrassed: seq(['bashful', 1800]),
  Flower: seq(['curious', 1000], ['rest', 700]),
  Idle: seq(['rest', 2600]),
  LookUp: seq(['lookUp', 1400]),
  Reading: seq(['reading', 2400]),
  Settle: seq(['settling', 300]),
  Show: seq(['hidden', 120], ['rest', 450]),
  Writing: seq(['talking', 2400]),
} satisfies Record<string, Frame[]>

export type AnimationName = keyof typeof ANIMATIONS

export const SIMBA_ANIMATIONS: Record<AnimationName, Frame[]> = ANIMATIONS

export const animations = {
  // No thinking beat while he idles, which reads as loading, and no grin,
  // which is for clicks
  idle: ['Butterfly', 'Embarrassed', 'Flower', 'LookUp'],
  /** Opening the panel: surprised, then the grin */
  open: 'ClickedOn',
  rest: 'Idle',
  /** When the panel closes and he stays on screen */
  settle: 'Settle',
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
