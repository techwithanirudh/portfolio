export const animations = {
  bye: 'Hide',
  submit: 'Books',
  tool: 'Searching',
  show: 'Show',
} as const

export const idleExclude = new Set([
  'Books',
  'Searching',
  'Show',
  'Hide',
  'HideQuick',
  'RestPose',
  'Money',
  'Sports',
  'Celebrity',
])
export const openAnimations = ['ClickedOn', 'Pleased'] as const
