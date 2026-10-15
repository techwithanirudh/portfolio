import { useSyncExternalStore } from 'react'

const subscribe = () => () => undefined

// True after hydration, without a mount effect and the extra render it causes
export const useIsClient = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
