interface Animations {
  bye: string
  idle: readonly string[]
  open: readonly string[]
  show: string
  submit: string
  tool: string
}

export const animations: Animations = {
  bye: 'Hide',
  idle: [
    'Acknowledge',
    'CharacterSucceeds',
    'ClickedOn',
    'Congratulate',
    'Cooking',
    'Embarrassed',
    'GetAttention',
    'GetAttentionMinor',
    'GestureLeft',
    'Greet',
    'ImageSearching',
    'LookUp',
    'LookUpLeft',
    'Pleased',
    'Surprised',
    'Thinking',
    'Travel',
    'Writing',
  ],
  open: ['ClickedOn', 'Pleased'],
  show: 'Show',
  submit: 'Books',
  tool: 'Searching',
}

export const avatarNames = ['rover', 'rocky'] as const
export type AvatarName = (typeof avatarNames)[number]

export const defaultAvatar: AvatarName = 'rover'

// Sprite sheet details let the UI show an avatar's first frame as an icon
export const avatarMeta: Record<
  AvatarName,
  {
    description: string
    frame: readonly [number, number]
    label: string
    sheet: readonly [number, number]
    sprite: string
  }
> = {
  rocky: {
    description: 'Laid-back tech dog with a taste for wizardry.',
    frame: [124, 93],
    label: 'Rocky',
    sheet: [3472, 3348],
    sprite: '/assets/clippy/rocky/rocky.png',
  },
  rover: {
    description: 'The classic search pup. Loyal, a little goofy.',
    frame: [80, 80],
    label: 'Rover',
    sheet: [2160, 2160],
    sprite: '/assets/clippy/rover.png',
  },
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

// Each avatar names its animations differently, so moods map onto both
export const moodAnimations: Record<AvatarName, Record<MoodName, string>> = {
  rocky: {
    attention: 'GetAttention',
    celebrate: 'Congratulate',
    greet: 'Greeting',
    rest: 'RestPose',
    search: 'Searching',
    surprised: 'Alert',
    think: 'Thinking',
    write: 'Writing',
  },
  rover: {
    attention: 'GetAttention',
    celebrate: 'Congratulate',
    greet: 'Greet',
    rest: 'RestPose',
    search: 'Searching',
    surprised: 'Surprised',
    think: 'Thinking',
    write: 'Writing',
  },
}
