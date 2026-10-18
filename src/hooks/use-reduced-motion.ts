import { useSyncExternalStore } from 'react'
import { prefersReducedMotion, reducedMotionQuery } from '@/lib/reduced-motion'

const subscribe = (onChange: () => void) => {
  const query = reducedMotionQuery()
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

// TODO(slopradar): library exists: motion/react exports useReducedMotion (motion is a dependency); adopt it, or if the `true` server snapshot is the reason to keep this, name that in the hook
export const useReducedMotion = () =>
  useSyncExternalStore(subscribe, prefersReducedMotion, () => true)
