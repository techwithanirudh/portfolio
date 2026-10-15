'use client'

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  use,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
} from 'react'

const AssistantContext = createContext<{
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  context: string | null
  setContext: Dispatch<SetStateAction<string | null>>
} | null>(null)

export function useAssistantContext() {
  const ctx = use(AssistantContext)
  if (!ctx) {
    throw new Error('useAssistantContext must be used within AssistantProvider')
  }
  return ctx
}

// Holds only the open state and selected context so anything can open the
// panel without pulling the chat, mascot and markdown into the main bundle
export function AssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [context, setContext] = useState<string | null>(null)

  // Lives here rather than in the panel so the shortcut works before its
  // chunk has loaded
  const onKeyPress = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === 'Escape' && open) {
      setOpen(false)
      event.preventDefault()
    }
    if (event.key === '/' && (event.metaKey || event.ctrlKey) && !open) {
      setOpen(true)
      event.preventDefault()
    }
  })

  useEffect(() => {
    window.addEventListener('keydown', onKeyPress)
    return () => window.removeEventListener('keydown', onKeyPress)
  }, [])

  const value = useMemo(
    () => ({
      context,
      open,
      setContext,
      setOpen,
    }),
    [context, open]
  )

  return <AssistantContext value={value}>{children}</AssistantContext>
}
