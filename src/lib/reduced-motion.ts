export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export const reducedMotionQuery = () => window.matchMedia(REDUCED_MOTION_QUERY)

export const prefersReducedMotion = () => reducedMotionQuery().matches
