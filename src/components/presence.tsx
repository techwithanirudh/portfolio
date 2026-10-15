'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'

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
      // Only top-level exits count, nested loops (spinners) never finish
      const animations = [...(ref.current?.children ?? [])]
        .flatMap((child) => child.getAnimations())
        .filter(
          (animation) =>
            animation.effect?.getTiming().iterations !==
            Number.POSITIVE_INFINITY
        )
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
