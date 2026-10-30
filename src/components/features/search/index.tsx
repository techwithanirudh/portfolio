'use client'

import type { SharedProps } from 'fumadocs-ui/components/dialog/search'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const Dialog = dynamic(() => import('./dialog'), { ssr: false })

const intents = ['keydown', 'pointerdown', 'touchstart'] as const

// Kept out of the first load and mounted closed before it opens, so the enter
// transition plays even when it was opened before the chunk arrived
export default function SearchDialog({ open, ...props }: SharedProps) {
  const [wanted, setWanted] = useState(open)
  const [mounted, setMounted] = useState(false)

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
    <Dialog
      {...props}
      onMount={() => setMounted(true)}
      open={mounted && open}
    />
  ) : null
}
