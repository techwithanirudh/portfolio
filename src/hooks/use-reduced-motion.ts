import { useSyncExternalStore } from 'react'
import { prefersReducedMotion, reducedMotionQuery } from '@/lib/reduced-motion'

const subscribe = (onChange: () => void) => {
  const query = reducedMotionQuery()
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

export const useReducedMotion = () =>
  useSyncExternalStore(subscribe, prefersReducedMotion, () => true)
