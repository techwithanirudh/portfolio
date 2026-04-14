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
    'Shopping',
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
