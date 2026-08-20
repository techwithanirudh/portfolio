'use client'

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

export type OiiaMode = 'default' | 'oiia'

export const OIIA_TITLE = 'OIIA'

interface OiiaContextValue {
  catCount: number
  clearAll: () => void
  clearAllRequest: number
  clicksRemaining: number
  disable: () => void
  mode: OiiaMode
  registerClick: () => { remaining: number; mode: OiiaMode }
  setCatCount: (n: number) => void
}

const OiiaContext = createContext<OiiaContextValue | null>(null)

const CLICKS_TO_ENABLE = 3

export function OiiaProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<OiiaMode>('default')
  const [clicksRemaining, setClicksRemaining] = useState(CLICKS_TO_ENABLE)
  const [catCount, setCatCount] = useState(0)
  const [clearAllRequest, setClearAllRequest] = useState(0)
  const clicksRef = useRef(CLICKS_TO_ENABLE)

  useEffect(() => {
    document.documentElement.classList.toggle('oiia', mode === 'oiia')
    return () => {
      document.documentElement.classList.remove('oiia')
    }
  }, [mode])

  const registerClick = useCallback((): {
    remaining: number
    mode: OiiaMode
  } => {
    const next = Math.max(0, clicksRef.current - 1)
    clicksRef.current = next
    setClicksRemaining(next)

    if (next !== 0) {
      return { mode, remaining: next }
    }

    const nextMode: OiiaMode = mode === 'oiia' ? 'default' : 'oiia'
    setMode(nextMode)
    clicksRef.current = CLICKS_TO_ENABLE
    setClicksRemaining(CLICKS_TO_ENABLE)
    if (nextMode === 'default') {
      setCatCount(0)
    }

    return { mode: nextMode, remaining: 0 }
  }, [mode])

  const disable = useCallback(() => {
    setMode('default')
    clicksRef.current = CLICKS_TO_ENABLE
    setClicksRemaining(CLICKS_TO_ENABLE)
    setCatCount(0)
  }, [])

  const clearAll = useCallback(() => setClearAllRequest((n) => n + 1), [])

  const value = useMemo(
    () => ({
      catCount,
      clearAll,
      clearAllRequest,
      clicksRemaining,
      disable,
      mode,
      registerClick,
      setCatCount,
    }),
    [
      mode,
      clicksRemaining,
      catCount,
      clearAllRequest,
      clearAll,
      registerClick,
      disable,
    ]
  )

  return <OiiaContext value={value}>{children}</OiiaContext>
}

export function useOiiaMode() {
  const ctx = useContext(OiiaContext)
  if (!ctx) {
    throw new Error('useOiiaMode must be used within OiiaProvider')
  }
  return ctx
}
