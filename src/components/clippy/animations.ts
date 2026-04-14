export const animations = {
  bye: 'Hide',
  submit: 'Books',
  tool: 'Searching',
  show: 'Show',
} as const

export const idleExclude = new Set([
  'Show', // entrance
  'Hide', // exit
  'HideQuick', // exit
  'RestPose', // static hold
  'Money', // 1-frame, freezes the loop
  'Sports', // golf — too long / weird out of context
  'Celebrity', // movie — same
])

export const openAnimations = ['ClickedOn', 'Pleased'] as const
