import { useEffect, useSyncExternalStore } from 'react'
import { useMediaQuery } from 'usehooks-ts'

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

/**
 * The trigger steps aside for a page's own Simba while the panel is closed,
 * and for the expanded panel unless he keeps his corner (useGutterSpot)
 */
export const useTriggerAway = ({
  expanded,
  open,
}: {
  expanded: boolean
  open: boolean
}) => {
  const pageSimba = usePageSimba()
  return (pageSimba && !open) || (open && expanded)
}

/**
 * Wide enough for his 88px box beside the expanded panel's 720px column, he keeps his
 * corner over it. The trigger's min-[1000px] stacking class matches this query
 */
export const useGutterSpot = ({
  expanded,
  open,
}: {
  expanded: boolean
  open: boolean
}) => {
  const wide = useMediaQuery('(min-width: 1000px)')
  return open && expanded && wide
}
