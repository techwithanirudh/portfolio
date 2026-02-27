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

type OiiaMode = 'default' | 'oiia'

type OiiaContextValue = {
  mode: OiiaMode
  clicksRemaining: number
  playRequest: number
  spawnRequest: number
  registerOiiaClick: () => { remaining: number; mode: OiiaMode }
  disableOiia: () => void
}

const OiiaContext = createContext<OiiaContextValue | null>(null)

const StorageKey = 'oiia-mode'
const ClicksToEnable = 5

export function OiiaProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<OiiaMode>('default')
  const [clicksRemaining, setClicksRemaining] = useState(ClicksToEnable)
  const [playRequest, setPlayRequest] = useState(0)
  const [spawnRequest, setSpawnRequest] = useState(0)
  const clicksRemainingRef = useRef(ClicksToEnable)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const stored = localStorage.getItem(StorageKey)
    setMode(stored === 'oiia' ? 'oiia' : 'default')
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

  useEffect(() => {
    if (mode !== 'oiia') {
      return
    }

    const handleClick = () => {
      setPlayRequest((count) => count + 1)
    }

    window.addEventListener('pointerdown', handleClick)
    return () => {
      window.removeEventListener('pointerdown', handleClick)
    }
  }, [mode])

  useEffect(() => {
    if (mode !== 'oiia') {
      return
    }
    setSpawnRequest((count) => count + 1)
  }, [mode])

  const registerOiiaClick = () => {
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

    return { remaining: 0, mode: nextMode }
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
      playRequest,
      spawnRequest,
      registerOiiaClick,
      disableOiia,
    }),
    [clicksRemaining, mode, playRequest, spawnRequest]
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
