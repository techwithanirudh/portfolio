'use client'

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
  startTransition,
  use,
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useMediaQuery } from 'usehooks-ts'
import { MEDIA } from '@/lib/media'

type PanelMode = 'docked' | 'expanded' | 'sheet'

function panelMode(expanded: boolean, isDocked: boolean): PanelMode {
  if (expanded) {
    return 'expanded'
  }
  return isDocked ? 'docked' : 'sheet'
}

const AssistantContext = createContext<{
  context: string | null
  expanded: boolean
  isDocked: boolean
  mode: PanelMode
  morphFrom: RefObject<DOMRect | null>
  open: boolean
  popupRef: RefObject<HTMLDivElement | null>
  setContext: Dispatch<SetStateAction<string | null>>
  setExpanded: (next: boolean, options?: { navigating?: boolean }) => void
  setOpen: (next: boolean) => void
} | null>(null)

export function useAssistantContext() {
  const ctx = use(AssistantContext)
  if (!ctx) {
    throw new Error('useAssistantContext must be used within AssistantProvider')
  }
  return ctx
}

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpenState] = useState(false)
  const [expanded, setExpandedState] = useState(false)
  const [context, setContext] = useState<string | null>(null)
  const isDocked = useMediaQuery(MEDIA.docked)
  const popupRef = useRef<HTMLDivElement>(null)
  const morphFrom = useRef<DOMRect | null>(null)

  const mode = panelMode(expanded, isDocked)

  const setExpanded = useCallback(
    (next: boolean, { navigating = false }: { navigating?: boolean } = {}) => {
      if (navigating) {
        // A link is leaving the page: resize inside the navigation's own view
        // transition instead of running a second morph on top of it
        morphFrom.current = null
        startTransition(() => setExpandedState(next))
        return
      }
      morphFrom.current = popupRef.current?.getBoundingClientRect() ?? null
      setExpandedState(next)
    },
    []
  )

  const setOpen = useCallback((next: boolean) => {
    if (next) {
      setExpandedState(false)
    }
    setOpenState(next)
  }, [])

  const onKeyPress = useEffectEvent((event: KeyboardEvent) => {
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
      expanded,
      isDocked,
      mode,
      morphFrom,
      open,
      popupRef,
      setContext,
      setExpanded,
      setOpen,
    }),
    [context, expanded, isDocked, mode, open, setExpanded, setOpen]
  )

  return <AssistantContext value={value}>{children}</AssistantContext>
}
