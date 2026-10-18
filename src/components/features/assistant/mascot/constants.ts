import type { SpriteName } from './rig-art'

/** A sprite from the sheet, mirrored with flip */
export type Pose = { flip?: boolean; sprite: SpriteName } | { hidden: true }

const poses = {
  attention: { sprite: 'getAttention' },
  bashful: { sprite: 'embarrassed' },
  // The sheet's tilt leans to the right, so the left one is its mirror
  curious: { flip: true, sprite: 'curiousTilt' },
  curiousRight: { sprite: 'curiousTilt' },
  focus: { sprite: 'show' },
  greet: { sprite: 'waving' },
  hidden: { hidden: true },
  lookUp: { sprite: 'lookAround' },
  playful: { sprite: 'excited' },
  pleased: { sprite: 'happy' },
  rest: { sprite: 'rest' },
  searching: { sprite: 'searching' },
  surprised: { sprite: 'surprised' },
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
  ClickedOn: seq(['surprised', 450], ['pleased', 800]),
  Embarrassed: seq(['bashful', 1800]),
  Flower: seq(['curious', 700], ['pleased', 1000]),
  GetAttention: seq(['attention', 400], ['greet', 1100], ['attention', 300]),
  Greet: seq(['greet', 1500], ['pleased', 500]),
  Hide: seq(['hidden', 450]),
  Idle: seq(['rest', 2600]),
  Listening: seq(['attention', 300], ['focus', 1200], ['pleased', 500]),
  LookUp: seq(['lookUp', 1400]),
  Play: seq(['playful', 1600]),
  Pleased: seq(['pleased', 1400]),
  Searching: seq(['searching', 2400]),
  Show: seq(['hidden', 120], ['rest', 450]),
  Sniffing: seq(
    ['searching', 2600],
    ['curious', 900],
    ['curiousRight', 900],
    ['thinking', 1100]
  ),
  Thinking: seq(['thinking', 2000], ['curiousRight', 700]),
  Writing: seq(['focus', 1400], ['thinking', 700], ['focus', 900]),
} satisfies Record<string, Frame[]>

export type AnimationName = keyof typeof ANIMATIONS

export const SIMBA_ANIMATIONS: Record<AnimationName, Frame[]> = ANIMATIONS

export const animations = {
  bye: 'Hide',
  idle: [
    'Butterfly',
    'Embarrassed',
    'Flower',
    'GetAttention',
    'Greet',
    'LookUp',
    'Play',
    'Pleased',
    'Thinking',
  ],
  open: ['ClickedOn', 'Pleased'],
  rest: 'Idle',
  show: 'Show',
  submit: 'Listening',
  thinking: 'Thinking',
  tool: 'Searching',
  writing: 'Writing',
} as const satisfies Record<string, AnimationName | readonly AnimationName[]>
