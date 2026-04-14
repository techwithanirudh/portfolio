export const simbaAnimations = {
  open: 'Bark',       // barks excitedly when the panel opens
  bye: 'LyingDown',   // lies down when the panel closes
  submit: 'Run',      // runs off to fetch the answer
  tool: 'Walk',       // sniffing around while tools run
} as const

export type SimbaAnimationKey = keyof typeof simbaAnimations
