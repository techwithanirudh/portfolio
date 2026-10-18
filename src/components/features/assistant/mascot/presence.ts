import { useEffect, useSyncExternalStore } from 'react'

let pageSimbaCount = 0
const listeners = new Set<() => void>()

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const emit = () => {
  for (const listener of listeners) {
    listener()
  }
}

export const useClaimPageSimba = () => {
  useEffect(() => {
    pageSimbaCount += 1
    emit()
    return () => {
      pageSimbaCount -= 1
      emit()
    }
  }, [])
}

export const usePageSimba = () =>
  useSyncExternalStore(
    subscribe,
    () => pageSimbaCount > 0,
    () => false
  )
