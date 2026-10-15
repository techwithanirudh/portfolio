'use client'

import { PenTool } from 'lucide-react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface Point {
  x: number
  y: number
}

interface Anchor extends Point {
  in: Point
  out: Point
}

/**
 * Smooth anchors through the points (Catmull-Rom tangents), the way a pen
 * tool places mirrored Bézier handles on a smooth point.
 */
function toAnchors(points: Point[]): Anchor[] {
  return points.map((p, i) => {
    const prev = points[i - 1] ?? p
    const next = points[i + 1] ?? p
    const tx = (next.x - prev.x) / 2
    const ty = (next.y - prev.y) / 2
    const dIn = i > 0 ? (p.y - prev.y) / 3 : 0
    const dOut = i < points.length - 1 ? (next.y - p.y) / 3 : 0
    const len = Math.hypot(tx, ty) || 1
    return {
      in: { x: p.x - (tx / len) * dIn, y: p.y - (ty / len) * dIn },
      out: { x: p.x + (tx / len) * dOut, y: p.y + (ty / len) * dOut },
      x: p.x,
      y: p.y,
    }
  })
}

function toPath(anchors: Anchor[]) {
  const [first, ...rest] = anchors
  if (!first) {
    return ''
  }
  let d = `M${first.x} ${first.y}`
  let prev = first
  for (const a of rest) {
    d += ` C${prev.out.x} ${prev.out.y} ${a.in.x} ${a.in.y} ${a.x} ${a.y}`
    prev = a
  }
  return d
}

/**
 * The journey as one pen-tool path. Anchor positions are measured from the
 * chapter rows (elements with `data-anchor`), so CSS decides the layout and
 * the path follows it on every breakpoint. On scroll the path draws in up to
 * the reading line, and the anchors it has reached fill in.
 */
export function PenPath({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const stroke = useRef<SVGPathElement>(null)
  const [anchors, setAnchors] = useState<Anchor[]>([])
  const [tail, setTail] = useState<Point | null>(null)
  const [size, setSize] = useState({ h: 0, w: 0 })
  const [active, setActive] = useState(-1)

  useEffect(() => {
    const el = root.current
    if (!el) {
      return
    }
    const measure = () => {
      const box = el.getBoundingClientRect()
      const pts = [...el.querySelectorAll<HTMLElement>('[data-anchor]')].map(
        (a) => {
          const r = a.getBoundingClientRect()
          return {
            x: r.left + r.width / 2 - box.left,
            y: r.top + r.height / 2 - box.top,
          }
        }
      )
      const end = el.querySelector<HTMLElement>('[data-anchor-end]')
      const er = end?.getBoundingClientRect()
      setTail(
        er
          ? { x: er.left + er.width / 2 - box.left, y: er.top - box.top + 4 }
          : null
      )
      setAnchors(toAnchors(pts))
      setSize({ h: box.height, w: box.width })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Draw to the reading line: binary-search the path length whose point
  // sits at 55% of the viewport. Motion values would work too; a direct
  // style write per frame is all this needs.
  useEffect(() => {
    const path = stroke.current
    const el = root.current
    if (!(path && el) || anchors.length === 0) {
      return
    }
    const total = path.getTotalLength()
    path.style.strokeDasharray = `${total}`
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.55 - el.getBoundingClientRect().top
      let lo = 0
      let hi = total
      for (let i = 0; i < 18; i++) {
        const mid = (lo + hi) / 2
        if (path.getPointAtLength(mid).y < line) {
          lo = mid
        } else {
          hi = mid
        }
      }
      path.style.strokeDashoffset = reduce ? '0' : `${total - lo}`
      let reached = -1
      anchors.forEach((a, i) => {
        if (a.y <= line + 1) {
          reached = i
        }
      })
      setActive(reached)
    }
    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [anchors])

  const d = toPath(anchors)
  const last = anchors.at(-1)

  return (
    <div className='relative' ref={root}>
      <svg
        aria-hidden
        className='pointer-events-none absolute inset-0 overflow-visible'
        height={size.h}
        width={size.w}
      >
        <path className='ab-pen-ghost' d={d} />
        {last && tail ? (
          <path
            className='ab-pen-ghost'
            d={`M${last.x} ${last.y} C${last.out.x} ${last.y + 60} ${tail.x} ${tail.y - 60} ${tail.x} ${tail.y}`}
          />
        ) : null}
        <path className='ab-pen-stroke' d={d} ref={stroke} />
        {anchors.map((a, i) => (
          <g
            className='ab-pen-handles'
            data-show={i === active || undefined}
            key={`h${a.x}-${a.y}`}
          >
            {i > 0 ? (
              <>
                <line
                  className='ab-pen-handle-line'
                  x1={a.x}
                  x2={a.in.x}
                  y1={a.y}
                  y2={a.in.y}
                />
                <circle
                  className='ab-pen-handle'
                  cx={a.in.x}
                  cy={a.in.y}
                  r='3.5'
                />
              </>
            ) : null}
            {i < anchors.length - 1 ? (
              <>
                <line
                  className='ab-pen-handle-line'
                  x1={a.x}
                  x2={a.out.x}
                  y1={a.y}
                  y2={a.out.y}
                />
                <circle
                  className='ab-pen-handle'
                  cx={a.out.x}
                  cy={a.out.y}
                  r='3.5'
                />
              </>
            ) : null}
          </g>
        ))}
        {anchors.map((a, i) => (
          <rect
            className='ab-pen-anchor'
            data-active={i <= active || undefined}
            height='9'
            key={`a${a.x}-${a.y}`}
            width='9'
            x={a.x - 4.5}
            y={a.y - 4.5}
          />
        ))}
      </svg>
      {children}
    </div>
  )
}

/** Where the path stops: the pen, still in hand. */
export function PenEnd({ className }: { className?: string }) {
  return (
    <div
      className={cn('flex flex-col items-center gap-2 text-center', className)}
    >
      <span
        className='grid size-8 place-items-center rounded-full bg-(--path-soft) text-(--path)'
        data-anchor-end
      >
        <PenTool aria-hidden className='size-4' strokeWidth={1.75} />
      </span>
      <p className='ab-t-label text-(--muted)'>Next anchor not placed yet</p>
    </div>
  )
}
