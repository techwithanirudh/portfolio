import type {
  MascotAvatarName,
  MascotMood,
} from '@/app/api/chat/utils/tools/animate-mascot'

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

export const moodAnimations: Record<
  MascotAvatarName,
  Record<MascotMood, string>
> = {
  rocky: {
    celebrate: 'Congratulate',
    'get-attention': 'GetAttention',
    greet: 'Greeting',
    'look-up': 'LookUp',
    search: 'Searching',
    surprised: 'Alert',
    think: 'Thinking',
    write: 'Writing',
  },
  rover: {
    celebrate: 'Congratulate',
    'get-attention': 'GetAttention',
    greet: 'Greet',
    'look-up': 'LookUp',
    search: 'Searching',
    surprised: 'Surprised',
    think: 'Thinking',
    write: 'Writing',
  },
}
