'use client'

import {
  createContext,
  type ReactNode,
  type RefObject,
  useCallback,
  useContext,
  useRef,
} from 'react'
import type { ChevronsUpDownIconHandle } from '@/components/icons/animated/chevrons-up-down'
import { ChevronsUpDownIcon } from '@/components/icons/animated/chevrons-up-down'
import { Collapsible } from '@/components/ui/collapsible'

// The only interactive bit of the experience list: it owns the open state
// callback and drives the animated chevron, everything else renders on the server.
const ChevronRefContext =
  createContext<RefObject<ChevronsUpDownIconHandle | null> | null>(null)

interface ExperiencePositionCollapsibleProps {
  children: ReactNode
  defaultOpen?: boolean
  disabled?: boolean
}

export function ExperiencePositionCollapsible({
  children,
  defaultOpen,
  disabled,
}: ExperiencePositionCollapsibleProps) {
  const chevronsIconRef = useRef<ChevronsUpDownIconHandle>(null)

  const handleOpenChange = useCallback((open: boolean) => {
    const controls = chevronsIconRef.current
    if (!controls) {
      return
    }

    if (open) {
      controls.startAnimation()
    } else {
      controls.stopAnimation()
    }
  }, [])

  return (
    <ChevronRefContext.Provider value={chevronsIconRef}>
      <Collapsible
        defaultOpen={defaultOpen}
        disabled={disabled}
        onOpenChange={handleOpenChange}
        render={
          <div className='relative last:before:absolute last:before:h-full last:before:w-4 last:before:bg-background' />
        }
      >
        {children}
      </Collapsible>
    </ChevronRefContext.Provider>
  )
}

export function ExperiencePositionChevron() {
  const ref = useContext(ChevronRefContext)

  return <ChevronsUpDownIcon duration={0.15} ref={ref} />
}
