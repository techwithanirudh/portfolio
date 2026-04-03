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
import { baseTitle, oiiaTitle } from '@/constants/site'

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

const ClicksToEnable = 3

export function OiiaProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<OiiaMode>('default')
  const [clicksRemaining, setClicksRemaining] = useState(ClicksToEnable)
  const [catCount, setCatCount] = useState(0)
  const [clearAllRequest, setClearAllRequest] = useState(0)
  const clicksRemainingRef = useRef(ClicksToEnable)

  useEffect(() => {
    document.documentElement.classList.toggle('oiia', mode === 'oiia')

    const currentTitle = document.title
    if (mode === 'oiia' && currentTitle.includes(baseTitle)) {
      document.title = currentTitle.replace(baseTitle, oiiaTitle)
    } else if (mode === 'default' && currentTitle.includes(oiiaTitle)) {
      document.title = currentTitle.replace(oiiaTitle, baseTitle)
    }
  }, [mode])

  const registerOiiaClick = useCallback((): {
    remaining: number
    mode: OiiaMode
  } => {
    const nextRemaining = Math.max(0, clicksRemainingRef.current - 1)
    clicksRemainingRef.current = nextRemaining
    setClicksRemaining(nextRemaining)

    if (nextRemaining !== 0) {
      return { remaining: nextRemaining, mode }
    }

    const nextMode: OiiaMode = mode === 'oiia' ? 'default' : 'oiia'
    setMode(nextMode)
    clicksRemainingRef.current = ClicksToEnable
    setClicksRemaining(ClicksToEnable)
    if (nextMode === 'default') {
      setCatCount(0)
    }

    return { remaining: 0, mode: nextMode }
  }, [mode])

  const disableOiia = useCallback(() => {
    setMode('default')
    clicksRemainingRef.current = ClicksToEnable
    setClicksRemaining(ClicksToEnable)
    setCatCount(0)
  }, [])

  const requestClearAll = useCallback(() => {
    setClearAllRequest((n) => n + 1)
  }, [])

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
