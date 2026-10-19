import { useSyncExternalStore } from 'react'
import { prefersReducedMotion, reducedMotionQuery } from '@/lib/reduced-motion'

const subscribe = (onChange: () => void) => {
  const query = reducedMotionQuery()
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

// Not motion/react's useReducedMotion: this server snapshot is `true`, so SSR
// and hydration render the still state before the media query is known
export const useReducedMotion = () =>
  useSyncExternalStore(subscribe, prefersReducedMotion, () => true)
