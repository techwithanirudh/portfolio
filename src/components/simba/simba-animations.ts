export const simbaAnimations = {
  open: 'Attack',  // excited paw when the panel opens
  bye: 'Death',    // plays dead when the panel closes
  submit: 'Attack', // pawing excitedly after sending a message
  tool: 'Walk',    // sniffing around while tools run
} as const

export type SimbaAnimationKey = keyof typeof simbaAnimations
