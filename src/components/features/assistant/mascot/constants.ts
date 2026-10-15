import simba from '@/public/assets/mascot/simba/animations.json'

export type AnimationName = keyof typeof simba.animations

export interface Frame {
  duration: number
  x: number
  y: number
}

// Key poses only; the sprite crossfades between them
const POSE_PACE = 0.85

const pace = ({ duration, ...frame }: Frame): Frame => ({
  ...frame,
  duration: Math.round(duration * POSE_PACE),
})

const pacedAnimations = Object.fromEntries(
  Object.entries(simba.animations).map(([name, { frames }]) => [
    name,
    { frames: frames.map(pace) },
  ])
) as Record<AnimationName, { frames: Frame[] }>

export const SIMBA = {
  animations: pacedAnimations,
  frame: simba.frame as [number, number],
  // Transparent space right of and below him in his resting frame
  padding: { bottom: 2, right: 0 },
  sheet: simba.sheet as [number, number],
  sprite: '/assets/mascot/simba/sheet.webp',
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
