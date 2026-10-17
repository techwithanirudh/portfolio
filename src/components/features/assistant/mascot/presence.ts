import { useEffect, useSyncExternalStore } from 'react'

// Where else Simba is on screen, so there is only ever one of him. A page's
// own Simba (the 404, a sent message) sends both the corner and the footer
// peek away; the peek sends the corner Simba away
let pageSimbaCount = 0
let peeking = false
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

export const setPeeking = (next: boolean) => {
  if (next === peeking) {
    return
  }
  peeking = next
  emit()
}

export const usePeeking = () =>
  useSyncExternalStore(
    subscribe,
    () => peeking,
    () => false
  )

/** Marks a page's own Simba as on screen for as long as the caller is mounted */
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
