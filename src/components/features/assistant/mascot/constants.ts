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
  hidden: { hidden: true },
  hopping: { motion: 'hop', sprite: 'happy' },
  lookLeft: { sprite: 'restLookLeft' },
  lookLeftEyes: { sprite: 'restLookLeft1' },
  lookRight: { sprite: 'restLookRight' },
  lookRightEyes: { sprite: 'restLookRight1' },
  pleased: { sprite: 'happy' },
  reading: { sprite: 'books' },
  rest: { sprite: 'rest' },
  settling: { settle: true, sprite: 'rest' },
  sleeping: { sprite: 'sleeping' },
  surprised: { sprite: 'surprised' },
  talking: { sprite: 'rest', talking: true },
  thinking: { sprite: 'thinking' },
  tilt: { sprite: 'restTilt2' },
  tiltIn: { sprite: 'restTilt1' },
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
    ['lookLeftEyes', 160],
    ['lookLeft', 520],
    ['lookRightEyes', 160],
    ['lookRight', 520],
    ['lookLeftEyes', 150],
    ['lookLeft', 460],
    ['lookLeftEyes', 140],
    ['rest', 500]
  ),
  Celebrate: seq(['hopping', 1600], ['pleased', 800]),
  ClickedOn: seq(['surprised', 225], ['pleased', 400]),
  Flower: seq(['tiltIn', 150], ['tilt', 1400], ['tiltIn', 170], ['rest', 600]),
  Idle: seq(['rest', 2600]),
  Reading: seq(['reading', 2400]),
  Settle: seq(['settling', 300]),
  Show: seq(['hidden', 120], ['rest', 450]),
  Writing: seq(['talking', 2400]),
} satisfies Record<string, Frame[]>

export type AnimationName = keyof typeof SIMBA_ANIMATIONS

export const animations = {
  idle: ['Butterfly', 'Flower'],
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
