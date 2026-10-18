'use client'

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
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
  setExpanded: (next: boolean) => void
  setOpen: Dispatch<SetStateAction<boolean>>
} | null>(null)

export function useAssistantContext() {
  const ctx = use(AssistantContext)
  if (!ctx) {
    throw new Error('useAssistantContext must be used within AssistantProvider')
  }
  return ctx
}

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpandedState] = useState(false)
  const [context, setContext] = useState<string | null>(null)
  const isDocked = useMediaQuery(MEDIA.docked)
  const popupRef = useRef<HTMLDivElement>(null)
  const morphFrom = useRef<DOMRect | null>(null)

  if (expanded && !open) {
    setExpandedState(false)
  }

  const mode = panelMode(expanded, isDocked)

  // The panel's morph starts from the box it had before the toggle
  const setExpanded = useCallback((next: boolean) => {
    morphFrom.current = popupRef.current?.getBoundingClientRect() ?? null
    setExpandedState(next)
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
    [context, expanded, isDocked, mode, open, setExpanded]
  )

  return <AssistantContext value={value}>{children}</AssistantContext>
}
