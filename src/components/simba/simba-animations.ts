export const simbaAnimations = {
  open: 'LookUp',
  bye: 'Hide',
  submit: 'Books',
  tool: 'Searching',
} as const

export type SimbaAnimationKey = keyof typeof simbaAnimations
