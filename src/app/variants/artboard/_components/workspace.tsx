'use client'

import { MotionConfig } from 'motion/react'
import { usePathname } from 'next/navigation'
import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { cn } from '@/lib/utils'
import type { SelectionInfo } from './selection'

export interface Selection {
  el: HTMLElement
  info: SelectionInfo
}

interface WorkspaceState {
  clear: () => void
  outline: boolean
  pen: boolean
  /** Selectables register their info here so the Layers panel can select them. */
  registry: Map<string, SelectionInfo>
  select: (info: SelectionInfo, el: HTMLElement, byUser?: boolean) => void
  selection: Selection | null
  setOutline: (next: boolean | ((prev: boolean) => boolean)) => void
  setPen: (next: boolean | ((prev: boolean) => boolean)) => void
  setSimba: (next: boolean) => void
  setStack: (next: string | null) => void
  setStackTags: (tags: { count: number; tag: string }[]) => void
  simba: boolean
  stack: string | null
  stackTags: { count: number; tag: string }[]
  /** Set when the user, not a page default, picked the current selection. */
  userSelected: boolean
}

const WorkspaceContext = createContext<WorkspaceState | null>(null)

export function useWorkspace() {
  const ctx = use(WorkspaceContext)
  if (!ctx) {
    throw new Error('useWorkspace must be used inside <Workspace>')
  }
  return ctx
}

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName))

/**
 * The variant's root element and its editor state: selection, outline mode,
 * pen handles, the hidden Simba layer and the Work stack filter.
 */
export function Workspace({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const [selection, setSelection] = useState<Selection | null>(null)
  const [userSelected, setUserSelected] = useState(false)
  const [outline, setOutline] = useState(false)
  const [pen, setPen] = useState(false)
  const [simba, setSimba] = useState(false)
  const [stack, setStack] = useState<string | null>(null)
  const [stackTags, setStackTags] = useState<{ count: number; tag: string }[]>(
    []
  )
  const registry = useRef(new Map<string, SelectionInfo>()).current

  const select = useCallback(
    (info: SelectionInfo, el: HTMLElement, byUser = true) => {
      setSelection({ el, info })
      setUserSelected(byUser)
    },
    []
  )

  // A new page starts with nothing selected. Reset during render, so the new
  // page's default selection (set in an effect) is not wiped afterwards.
  const pathname = usePathname()
  const [prevPath, setPrevPath] = useState(pathname)
  if (pathname !== prevPath) {
    setPrevPath(pathname)
    setSelection(null)
    setUserSelected(false)
    setStack(null)
  }

  const clear = useCallback(() => {
    setSelection(null)
    setUserSelected(false)
  }, [])

  // Mirror the selection onto the DOM so CSS can draw it on any layer.
  useEffect(() => {
    const el = selection?.el
    if (!el) {
      return
    }
    el.setAttribute('data-ab-selected', '')
    return () => el.removeAttribute('data-ab-selected')
  }, [selection])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTyping(event.target)) {
        return
      }
      const mod = event.metaKey || event.ctrlKey
      if (mod && event.key.toLowerCase() === 'y') {
        event.preventDefault()
        setOutline((prev) => !prev)
        return
      }
      if (mod || event.altKey) {
        return
      }
      if (event.key === 'Escape') {
        clear()
      } else if (event.key.toLowerCase() === 'p') {
        setPen((prev) => !prev)
      } else if (event.key.toLowerCase() === 'v') {
        setPen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [clear])

  const value = useMemo<WorkspaceState>(
    () => ({
      clear,
      outline,
      pen,
      registry,
      select,
      selection,
      setOutline,
      setPen,
      setSimba,
      setStack,
      setStackTags,
      simba,
      stack,
      stackTags,
      userSelected,
    }),
    [
      clear,
      outline,
      pen,
      registry,
      select,
      selection,
      simba,
      stack,
      stackTags,
      userSelected,
    ]
  )

  return (
    <WorkspaceContext value={value}>
      <MotionConfig reducedMotion='user'>
        <div
          className={cn('v-artboard', className)}
          data-outline={outline || undefined}
          data-pen={pen || undefined}
        >
          {children}
        </div>
      </MotionConfig>
    </WorkspaceContext>
  )
}

/**
 * Sets a page's default selection (the hero on Home) without marking it as a
 * user choice, and clears it when the page unmounts.
 */
export function useDefaultSelection(
  info: SelectionInfo | undefined,
  ref: React.RefObject<HTMLElement | null>
) {
  const ctx = useWorkspace()
  const { clear } = ctx
  const setRef = useRef(ctx)
  setRef.current = ctx

  useEffect(() => {
    const el = ref.current
    if (!(info && el)) {
      return
    }
    // Only on wide screens, where the Properties panel can show it.
    if (!window.matchMedia('(min-width: 1280px)').matches) {
      return
    }
    setRef.current.select(info, el, false)
    return () => clear()
  }, [clear, info, ref])
}
