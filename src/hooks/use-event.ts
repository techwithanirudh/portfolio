'use client'

import { useCallback, useEffect, useRef } from 'react'

export const useEvent = <T extends (...args: never[]) => unknown>(
  handler: T
) => {
  const handlerRef = useRef<T>(handler)

  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  return useCallback(
    ((...args: never[]) => handlerRef.current(...args)) as T,
    []
  )
}
