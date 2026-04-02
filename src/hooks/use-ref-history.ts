'use client'

import { useRef } from 'react'

interface UseRefHistoryReturn<T> {
  canRedo: () => boolean
  canUndo: () => boolean
  clear: () => void
  push: (value: T) => void
  redo: () => T | undefined
  undo: () => T | undefined
}

export function useRefHistory<T>(): UseRefHistoryReturn<T> {
  const entries = useRef<T[]>([])
  const index = useRef(-1)

  const push = (value: T) => {
    entries.current = entries.current.slice(0, index.current + 1)
    entries.current.push(value)
    index.current = entries.current.length - 1
  }

  const undo = (): T | undefined => {
    if (index.current < 0) {
      return undefined
    }
    index.current -= 1
    return entries.current[index.current]
  }

  const redo = (): T | undefined => {
    if (index.current >= entries.current.length - 1) {
      return undefined
    }
    index.current += 1
    return entries.current[index.current]
  }

  const clear = () => {
    entries.current = []
    index.current = -1
  }

  const canUndo = () => index.current >= 0
  const canRedo = () => index.current < entries.current.length - 1

  return { push, undo, redo, clear, canUndo, canRedo }
}
