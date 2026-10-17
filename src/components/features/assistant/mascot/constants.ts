// Whole drawings (lying down, standing) that replace the seated rig; each is
// a pose-* group in rig-art.ts
type FullPose = 'alert' | 'bashful' | 'playful' | 'searching'

type Muzzle = 'neutral' | 'smile' | 'surprise'

// A rig pose moves the seated Simba's parts; a full pose swaps in a whole
// drawing and pops into it
export type Pose =
  | {
      head: number
      lift?: number
      muzzle?: Muzzle
      paw?: boolean
      shift?: number
    }
  | { full: FullPose }
  | { hidden: true }

const poses = {
  alert: { full: 'alert' },
  attention: { head: 0, lift: -4 },
  bashful: { full: 'bashful' },
  curious: { head: -20, shift: -2 },
  curiousRight: { head: 14, shift: 2 },
  focus: { head: 6, lift: 3 },
  greet: { head: -5, paw: true },
  hidden: { hidden: true },
  lookUp: { head: -9, lift: -5 },
  playful: { full: 'playful' },
  pleased: { head: 4, muzzle: 'smile' },
  rest: { head: 0 },
  searching: { full: 'searching' },
  surprised: { head: 0, lift: -3, muzzle: 'surprise' },
  thinking: { head: -14, lift: -2 },
} satisfies Record<string, Pose>

export type PoseName = keyof typeof poses

export const POSES: Record<PoseName, Pose> = poses

export interface Frame {
  /** ms */
  duration: number
  pose: PoseName
}

const seq = (...frames: [PoseName, number][]) =>
  frames.map(([pose, duration]): Frame => ({ duration, pose }))

// Each frame is a key pose; CSS transitions ease from one to the next
const ANIMATIONS = {
  Alert: seq(['alert', 1600]),
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

// What Simba acts out for each moment of the assistant
export const animations = {
  bye: 'Hide',
  idle: [
    'Alert',
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
