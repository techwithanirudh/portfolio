'use client'

import { motion, useReducedMotion } from 'motion/react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

const R = 12
const SHOULDER = 14
const RAIL_INSET = 44
const MIN_GAP = 2 * R + 8

interface Callout {
  /** Target anchor, just past the end of the labelled text. */
  ax: number
  ay: number
  /** Balloon centre. */
  bx: number
  by: number
  n: number
}

interface Geometry {
  callouts: Callout[]
  height: number
  width: number
}

/**
 * Assembly-drawing balloons: numbered circles in a rail on the right, each
 * with a leader to a part of the hero. Targets are any descendants marked
 * `data-balloon="<n>"`; positions are measured, so the leaders follow the
 * layout. Desktop only: below `lg` the overlay is hidden and the hero shows
 * its numbers inline instead.
 */
export function BalloonCallouts({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [geometry, setGeometry] = useState<Geometry | null>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const container = ref.current
    if (!container) {
      return
    }

    const measure = () => {
      const box = container.getBoundingClientRect()
      if (box.width === 0) {
        return
      }
      const targets = container.querySelectorAll<HTMLElement>('[data-balloon]')
      let lastBy = Number.NEGATIVE_INFINITY
      const callouts: Callout[] = []
      for (const el of targets) {
        const rect = el.getBoundingClientRect()
        if (rect.width === 0) {
          continue
        }
        const ay = rect.top - box.top + rect.height / 2
        const by = Math.max(ay - 20, lastBy + MIN_GAP, R + 4)
        lastBy = by
        callouts.push({
          ax: rect.right - box.left + 10,
          ay,
          bx: box.width - RAIL_INSET,
          by,
          n: Number(el.dataset.balloon),
        })
      }
      setGeometry({ callouts, height: box.height, width: box.width })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    document.fonts?.ready.then(measure).catch(() => undefined)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={cn('relative', className)} ref={ref}>
      {children}
      {geometry && (
        <svg
          aria-hidden
          className='pointer-events-none absolute inset-0 hidden overflow-visible lg:block'
          height={geometry.height}
          width={geometry.width}
        >
          {geometry.callouts.map((c, i) => {
            const shoulderX = c.bx - R - SHOULDER
            const d =
              shoulderX > c.ax
                ? `M${c.bx - R} ${c.by}H${shoulderX}L${c.ax} ${c.ay}`
                : `M${c.bx - R} ${c.by}L${c.ax} ${c.ay}`
            const delay = 0.35 + i * 0.12
            return (
              <g key={c.n}>
                <motion.path
                  animate={{ pathLength: 1 }}
                  d={d}
                  fill='none'
                  initial={reduce ? false : { pathLength: 0 }}
                  stroke='var(--ink-muted)'
                  strokeWidth={0.75}
                  transition={{ delay, duration: 0.4, ease: 'easeOut' }}
                />
                <motion.circle
                  animate={{ opacity: 1 }}
                  cx={c.ax}
                  cy={c.ay}
                  fill='var(--ink)'
                  initial={reduce ? false : { opacity: 0 }}
                  r={1.75}
                  transition={{ delay: delay + 0.35, duration: 0.15 }}
                />
                <motion.g
                  animate={{ opacity: 1 }}
                  initial={reduce ? false : { opacity: 0 }}
                  transition={{ delay: delay - 0.1, duration: 0.2 }}
                >
                  <circle
                    cx={c.bx}
                    cy={c.by}
                    fill='var(--sheet)'
                    r={R}
                    stroke='var(--ink)'
                    strokeWidth={1}
                  />
                  <text
                    dominantBaseline='central'
                    fill='var(--ink)'
                    fontFamily='var(--font-geist-mono), monospace'
                    fontSize={11}
                    fontWeight={500}
                    textAnchor='middle'
                    x={c.bx}
                    y={c.by + 0.5}
                  >
                    {c.n}
                  </text>
                </motion.g>
              </g>
            )
          })}
        </svg>
      )}
    </div>
  )
}
