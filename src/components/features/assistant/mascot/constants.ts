export const animations = {
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
  // Played in a loop between idle actions
  rest: 'RestPose',
  show: 'Show',
  submit: 'Books',
  tool: 'Searching',
} as const

// Sprite sheet details let the UI show Rover's first frame as an icon
export const sprite = {
  frame: [80, 80],
  // Transparent padding around the dog in its idle frame
  padding: { bottom: 6, right: 11, top: 6 },
  sheet: [2160, 2160],
  src: '/assets/clippy/rover.png',
} as const
