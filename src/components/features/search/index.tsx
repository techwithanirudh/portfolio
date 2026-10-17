'use client'

import type { SharedProps } from 'fumadocs-ui/components/dialog/search'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useState } from 'react'

const Dialog = dynamic(() => import('./dialog'), { ssr: false })

const intents = ['keydown', 'pointerdown', 'touchstart'] as const

// The dialog brings the markdown pipeline its results render with, so it stays
// out of the first load. It loads on the first key press or tap, mounts
// closed, and only then opens, so the enter transition still plays the first
// time even when it was opened before the chunk arrived
export default function SearchDialog({ open, ...props }: SharedProps) {
  const [wanted, setWanted] = useState(open)
  const [mounted, setMounted] = useState(false)
  const onMount = useCallback(() => setMounted(true), [])

  if (open && !wanted) {
    setWanted(true)
  }

  useEffect(() => {
    if (wanted) {
      return
    }
    const want = () => setWanted(true)
    for (const type of intents) {
      window.addEventListener(type, want, {
        capture: true,
        once: true,
        passive: true,
      })
    }
    return () => {
      for (const type of intents) {
        window.removeEventListener(type, want, { capture: true })
      }
    }
  }, [wanted])

  return wanted ? (
    <Dialog {...props} onMount={onMount} open={mounted && open} />
  ) : null
}
