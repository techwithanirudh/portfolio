export const fullPoses = [
  'alert',
  'bashful',
  'playful',
  'searching',
  'show',
] as const
type FullPose = (typeof fullPoses)[number]

type Muzzle = 'neutral' | 'smile' | 'surprise'

// A rig pose moves the seated Simba's parts; a full pose swaps in a whole
// drawing (lying down, standing) and pops into it
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
  show: { full: 'show' },
  surprised: { head: 0, lift: -3, muzzle: 'surprise' },
  thinking: { head: -14, lift: -2 },
} satisfies Record<string, Pose>

export type PoseName = keyof typeof poses

export const POSES: Record<PoseName, Pose> = poses

export interface Frame {
  duration: number
  pose: PoseName
}

const seq = (...frames: [PoseName, number][]) => ({
  frames: frames.map(([pose, duration]) => ({ duration, pose })),
})

const ANIMATIONS = {
  Alert: seq(['alert', 1600]),
  Books: seq(['attention', 300], ['focus', 1200], ['pleased', 500]),
  Butterfly: seq(
    ['lookUp', 600],
    ['curious', 600],
    ['curiousRight', 600],
    ['lookUp', 500],
    ['pleased', 700]
  ),
  ClickedOn: seq(['surprised', 450], ['pleased', 800]),
  Congratulate: seq(['pleased', 500], ['playful', 1100], ['pleased', 500]),
  Embarrassed: seq(['bashful', 1800]),
  Flower: seq(['curious', 700], ['pleased', 1000]),
  GetAttention: seq(['attention', 400], ['greet', 1100], ['attention', 300]),
  Greet: seq(['greet', 1500], ['pleased', 500]),
  Hide: seq(['hidden', 450]),
  Idle: seq(['rest', 2600]),
  LookUp: seq(['lookUp', 1400]),
  Play: seq(['playful', 1600]),
  Pleased: seq(['pleased', 1400]),
  RestPose: seq(['rest', 120]),
  Searching: seq(['searching', 2400]),
  Show: seq(['hidden', 40], ['rest', 450]),
  Surprised: seq(['surprised', 1300]),
  Thinking: seq(['thinking', 2000], ['curiousRight', 700]),
  Writing: seq(['focus', 1400], ['thinking', 700], ['focus', 900]),
} satisfies Record<string, { frames: Frame[] }>

export type AnimationName = keyof typeof ANIMATIONS

export const SIMBA = {
  animations: ANIMATIONS as Record<AnimationName, { frames: Frame[] }>,
  // Rendered box; the drawing's feet sit on its bottom edge
  size: 100,
}

interface Animations {
  bye: AnimationName
  idle: readonly AnimationName[]
  open: readonly AnimationName[]
  rest: AnimationName
  show: AnimationName
  submit: AnimationName
  tool: AnimationName
}

export const animations: Animations = {
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
  submit: 'Books',
  tool: 'Searching',
}

export const moodNames = [
  'greet',
  'celebrate',
  'think',
  'surprised',
  'attention',
  'write',
  'search',
  'rest',
] as const
type MoodName = (typeof moodNames)[number]

export const moodAnimations: Record<MoodName, AnimationName> = {
  attention: 'GetAttention',
  celebrate: 'Congratulate',
  greet: 'Greet',
  rest: 'RestPose',
  search: 'Searching',
  surprised: 'Surprised',
  think: 'Thinking',
  write: 'Writing',
}
