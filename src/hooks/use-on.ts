'use client'

import { useEffect, useEffectEvent } from 'react'

export function useOn<T>(value: T, handler: () => void) {
  const fn = useEffectEvent(handler)
  // biome-ignore lint/correctness/useExhaustiveDependencies: dep is a trigger, not a capture
  useEffect(() => {
    fn()
  }, [value])
}
