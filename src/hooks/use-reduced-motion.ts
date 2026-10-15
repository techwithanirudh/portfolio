import { useSyncExternalStore } from 'react'
import { prefersReducedMotion, reducedMotionQuery } from '@/lib/reduced-motion'

const subscribe = (onChange: () => void) => {
  const query = reducedMotionQuery()
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

// Server renders assume reduced motion, so nothing animates before hydration
export const useReducedMotion = () =>
  useSyncExternalStore(subscribe, prefersReducedMotion, () => true)
