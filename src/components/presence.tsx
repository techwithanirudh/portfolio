'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'

// Keeps children mounted until their exit animation finishes, so CSS exit
// keyframes get to play. With no running animation they unmount at once.
export function Presence({
  children,
  present,
}: {
  children: ReactNode
  present: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(present)

  useEffect(() => {
    if (present) {
      setMounted(true)
      return
    }
    let cancelled = false
    const frame = requestAnimationFrame(() => {
      const animations = ref.current?.getAnimations({ subtree: true }) ?? []
      Promise.allSettled(animations.map((animation) => animation.finished))
        .then(() => {
          if (!cancelled) {
            setMounted(false)
          }
        })
        .catch(() => undefined)
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [present])

  if (!(present || mounted)) {
    return null
  }

  return (
    <div className='contents' ref={ref}>
      {children}
    </div>
  )
}
