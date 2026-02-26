'use client'

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { baseTitle, oiiaTitle } from '@/constants/site'

type OiiaContextValue = {
  mode: 'default' | 'oiia'
  clicksRemaining: number
  registerOiiaClick: () => { remaining: number; mode: 'default' | 'oiia' }
  disableOiia: () => void
}

const OiiaContext = createContext<OiiaContextValue | null>(null)

const StorageKey = 'oiia-mode'
const ClicksToEnable = 5

export function OiiaProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<'default' | 'oiia'>('default')
  const [clicksRemaining, setClicksRemaining] = useState(ClicksToEnable)
  const clicksRemainingRef = useRef(ClicksToEnable)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const stored = localStorage.getItem(StorageKey)
    const initialMode = stored === 'oiia' ? 'oiia' : 'default'
    setMode(initialMode)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    localStorage.setItem(StorageKey, mode)
    document.documentElement.classList.toggle('oiia', mode === 'oiia')
    const currentTitle = document.title
    if (currentTitle.includes(baseTitle)) {
      document.title = currentTitle.replace(
        baseTitle,
        mode === 'oiia' ? oiiaTitle : baseTitle
      )
      return
    }
    if (currentTitle.includes(oiiaTitle)) {
      document.title = currentTitle.replace(
        oiiaTitle,
        mode === 'oiia' ? oiiaTitle : baseTitle
      )
    }
  }, [mode])

  const registerOiiaClick = () => {
    if (mode === 'oiia') {
      setMode('default')
      clicksRemainingRef.current = ClicksToEnable
      setClicksRemaining(ClicksToEnable)
      return { remaining: ClicksToEnable, mode: 'default' }
    }

    const nextRemaining = Math.max(0, clicksRemainingRef.current - 1)
    clicksRemainingRef.current = nextRemaining
    setClicksRemaining(nextRemaining)

    if (nextRemaining === 0) {
      setMode('oiia')
      clicksRemainingRef.current = ClicksToEnable
      setClicksRemaining(ClicksToEnable)
      return { remaining: 0, mode: 'oiia' }
    }

    return { remaining: nextRemaining, mode: 'default' }
  }

  const disableOiia = () => {
    setMode('default')
    clicksRemainingRef.current = ClicksToEnable
    setClicksRemaining(ClicksToEnable)
  }

  const value = useMemo(
    () => ({
      mode,
      clicksRemaining,
      registerOiiaClick,
      disableOiia,
    }),
    [clicksRemaining, mode]
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
