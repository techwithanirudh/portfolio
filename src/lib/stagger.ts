const STAGGER_STEP = 0.05

export const staggerDelay = (index: number, offset = 0) =>
  offset + STAGGER_STEP * index
