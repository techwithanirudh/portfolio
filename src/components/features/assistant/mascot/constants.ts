import simba from './simba.json'

export type AnimationName = keyof typeof simba.animations

export interface Frame {
  duration: number
  x: number
  y: number
}

// Simba, a Shih Tzu. The sheet is cut into equal cells with his feet on
// each cell's floor; simba.json maps every animation to its cells.
export const SIMBA = {
  animations: simba.animations as Record<AnimationName, { frames: Frame[] }>,
  frame: simba.frame as [number, number],
  // Transparent space right of and below him in his resting frame
  padding: { bottom: 2, right: 0 },
  sheet: simba.sheet as [number, number],
  sprite: '/assets/mascot/simba.webp',
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
export type MoodName = (typeof moodNames)[number]

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
