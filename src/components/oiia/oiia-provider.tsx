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

type OiiaMode = 'default' | 'oiia'

interface OiiaContextValue {
  catCount: number
  clearAllRequest: number
  clicksRemaining: number
  disableOiia: () => void
  mode: OiiaMode
  registerOiiaClick: () => { remaining: number; mode: OiiaMode }
  requestClearAll: () => void
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
  }, [mode])

  const registerOiiaClick = useCallback((): {
    remaining: number
    mode: OiiaMode
  } => {
    const next = Math.max(0, clicksRef.current - 1)
    clicksRef.current = next
    setClicksRemaining(next)

    if (next !== 0) {
      return { remaining: next, mode }
    }

    const nextMode: OiiaMode = mode === 'oiia' ? 'default' : 'oiia'
    setMode(nextMode)
    clicksRef.current = CLICKS_TO_ENABLE
    setClicksRemaining(CLICKS_TO_ENABLE)
    if (nextMode === 'default') {
      setCatCount(0)
    }

    return { remaining: 0, mode: nextMode }
  }, [mode])

  const disableOiia = useCallback(() => {
    setMode('default')
    clicksRef.current = CLICKS_TO_ENABLE
    setClicksRemaining(CLICKS_TO_ENABLE)
    setCatCount(0)
  }, [])

  const requestClearAll = useCallback(
    () => setClearAllRequest((n) => n + 1),
    []
  )

  const value = useMemo(
    () => ({
      mode,
      clicksRemaining,
      catCount,
      clearAllRequest,
      setCatCount,
      requestClearAll,
      registerOiiaClick,
      disableOiia,
    }),
    [
      mode,
      clicksRemaining,
      catCount,
      clearAllRequest,
      requestClearAll,
      registerOiiaClick,
      disableOiia,
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
