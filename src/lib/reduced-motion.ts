export const reducedMotionQuery = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)')

export const prefersReducedMotion = () => reducedMotionQuery().matches
