export const simbaAnimations = {
  open: 'Jump',  // excited when the panel opens
  bye: 'Fall',   // drops off when the panel closes
  submit: 'Run', // dashes off to fetch the answer
  tool: 'Walk',  // sniffing around while tools run
} as const

export type SimbaAnimationKey = keyof typeof simbaAnimations
