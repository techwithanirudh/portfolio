'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { DrawnPath } from './drawn-path'

const OUTSET = 5
const BUMP = 18

/** One scalloped edge from (x, y), `count` arcs of `step` along (dx, dy). */
function edge(count: number, step: number, dx: number, dy: number) {
  const r = step / 2
  let d = ''
  for (let i = 0; i < count; i++) {
    d += `a${r} ${r * 0.85} 0 0 1 ${dx * step} ${dy * step}`
  }
  return d
}

/**
 * Builds a closed revision cloud around a `w` by `h` box. Traversed clockwise
 * with every arc on sweep-flag 1, so all the bumps face outward.
 */
function cloudPath(w: number, h: number) {
  const nx = Math.max(2, Math.round(w / BUMP))
  const ny = Math.max(2, Math.round(h / BUMP))
  const sx = w / nx
  const sy = h / ny
  return `M0 0${edge(nx, sx, 1, 0)}${edge(ny, sy, 0, 1)}${edge(nx, sx, -1, 0)}${edge(ny, sy, 0, -1)}Z`
}

/**
 * Wraps the current revision in a redline revision cloud, the way a drawing
 * flags what changed. Measures its child, so it follows the row as it opens.
 */
export function RevisionCloud({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ h: number; w: number } | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) {
      return
    }
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) {
        return
      }
      const { height, width } = entry.contentRect
      setSize({ h: Math.round(height), w: Math.round(width) })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={cn('relative', className)} ref={ref}>
      {children}
      {size && size.w > 0 && (
        <svg
          aria-hidden
          className='pointer-events-none absolute overflow-visible text-(--redline)'
          height={size.h + OUTSET * 2}
          style={{ left: -OUTSET, top: -OUTSET }}
          width={size.w + OUTSET * 2}
        >
          <DrawnPath
            d={cloudPath(size.w + OUTSET * 2, size.h + OUTSET * 2)}
            duration={0.9}
            fill='none'
            stroke='currentColor'
            strokeLinejoin='round'
            strokeWidth={1.25}
          />
        </svg>
      )}
    </div>
  )
}
