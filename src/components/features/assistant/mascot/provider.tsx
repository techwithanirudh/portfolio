'use client'

import type { initAgent } from 'clippyjs'
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
import { avatars } from './agents'
import { type AvatarName, avatarNames, defaultAvatar } from './constants'

const avatarStorageKey = '__mascot_avatar'

function readStoredAvatar(): AvatarName {
  try {
    const stored = localStorage.getItem(avatarStorageKey)
    return avatarNames.find((name) => name === stored) ?? defaultAvatar
  } catch {
    return defaultAvatar
  }
}

export type MascotAgent = Awaited<ReturnType<typeof initAgent>>

const MascotContext = createContext<
  | {
      agent: MascotAgent | undefined
      avatar: AvatarName
      setAvatar: (avatar: AvatarName) => void
    }
  | undefined
>(undefined)

export function useMascot() {
  const ctx = useContext(MascotContext)
  if (!ctx) {
    throw new Error('useMascot must be used within MascotProvider')
  }
  return ctx
}

interface MascotProviderProps {
  children?: ReactNode
  disabled?: boolean
}

export function MascotProvider({ children, disabled }: MascotProviderProps) {
  const [avatar, setAvatarState] = useState<AvatarName>(readStoredAvatar)
  const [currentAgent, setCurrentAgent] = useState<MascotAgent | undefined>()
  const instance = useRef<MascotAgent | null>(null)

  const setAvatar = useCallback((next: AvatarName) => {
    setAvatarState(next)
    try {
      localStorage.setItem(avatarStorageKey, next)
    } catch {
      // storage can be blocked, the avatar just won't persist
    }
  }, [])

  useEffect(() => {
    if (disabled) {
      return
    }

    const loaders = avatars[avatar]
    let cancelled = false

    import('clippyjs')
      .then(({ initAgent }) =>
        initAgent({ ...loaders, sound: () => Promise.resolve({ default: {} }) })
      )
      .then((loaded: MascotAgent) => {
        if (cancelled) {
          loaded.dispose()
          return
        }
        instance.current = loaded
        setCurrentAgent(loaded)
      })
      .catch((error: unknown) => {
        console.error('Failed to load mascot:', error)
      })

    return () => {
      cancelled = true
      instance.current?.dispose()
      instance.current = null
      setCurrentAgent(undefined)
    }
  }, [avatar, disabled])

  useEffect(() => {
    if (!currentAgent) {
      return
    }

    const blockDrag = (event: MouseEvent | TouchEvent) => {
      event.stopImmediatePropagation()
    }

    currentAgent._el.addEventListener('mousedown', blockDrag, true)
    currentAgent._el.addEventListener('touchstart', blockDrag, {
      capture: true,
      passive: false,
    })

    return () => {
      currentAgent._el.removeEventListener('mousedown', blockDrag, true)
      currentAgent._el.removeEventListener('touchstart', blockDrag, {
        capture: true,
      })
    }
  }, [currentAgent])

  const value = useMemo(
    () => ({ agent: currentAgent, avatar, setAvatar }),
    [currentAgent, avatar, setAvatar]
  )

  return (
    <MascotContext.Provider value={value}>{children}</MascotContext.Provider>
  )
}
