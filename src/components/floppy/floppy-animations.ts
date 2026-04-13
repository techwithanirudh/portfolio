export const floppyAnimations = {
  open: 'LookUp',
  bye: 'Hide',
  submit: 'Books',
  tool: 'Searching',
} as const

export type FloppyAnimationKey = keyof typeof floppyAnimations
