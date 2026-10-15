'use client'

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import {
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { cn } from '@/lib/utils'

/*
 * The journey, told in chapters that alternate left and right with a dashed
 * ballpoint line running between their photos. The idea comes from
 * braydoncoyer.dev's About page; nothing is copied from it. Here the path is
 * computed from the measured position of each photo, so it follows the
 * content at any width, and the dot reads motion values instead of state.
 */

export interface JourneyChapter {
  body: string
  id: string
  photo: ReactNode
  title: string
  years: string
}

interface Point {
  x: number
  y: number
}

const RADIUS = 36

const f = (n: number) => n.toFixed(1)

/** One rounded corner at `cur`, or a straight join when nothing turns. */
function corner(prev: Point, cur: Point, next: Point) {
  const l1 = Math.hypot(cur.x - prev.x, cur.y - prev.y)
  const l2 = Math.hypot(next.x - cur.x, next.y - cur.y)
  const u1 = { x: (cur.x - prev.x) / l1, y: (cur.y - prev.y) / l1 }
  const u2 = { x: (next.x - cur.x) / l2, y: (next.y - cur.y) / l2 }
  if (Math.abs(u1.x * u2.y - u1.y * u2.x) < 0.01) {
    return ` L ${f(cur.x)} ${f(cur.y)}`
  }
  const r = Math.min(RADIUS, l1 / 2, l2 / 2)
  return (
    ` L ${f(cur.x - u1.x * r)} ${f(cur.y - u1.y * r)}` +
    ` Q ${f(cur.x)} ${f(cur.y)} ${f(cur.x + u2.x * r)} ${f(cur.y + u2.y * r)}`
  )
}

/** An orthogonal polyline with rounded corners, as an SVG path. */
function roundedPath(input: Point[]) {
  const pts: Point[] = []
  for (const p of input) {
    const last = pts.at(-1)
    if (!last || Math.hypot(p.x - last.x, p.y - last.y) > 0.5) {
      pts.push(p)
    }
  }
  const [first] = pts
  const last = pts.at(-1)
  if (!(first && last) || pts.length < 2) {
    return ''
  }
  let d = `M ${f(first.x)} ${f(first.y)}`
  pts.forEach((cur, i) => {
    const prev = pts[i - 1]
    const next = pts[i + 1]
    if (prev && next) {
      d += corner(prev, cur, next)
    }
  })
  return `${d} L ${f(last.x)} ${f(last.y)}`
}

/** Down from each photo, across, and down into the next one. */
function zigzag(anchors: Point[]): Point[] {
  const pts: Point[] = []
  anchors.forEach((cur, i) => {
    const prev = anchors[i - 1]
    if (prev) {
      const mid = (prev.y + cur.y) / 2
      pts.push({ x: prev.x, y: mid }, { x: cur.x, y: mid }, cur)
    } else {
      pts.push({ x: cur.x, y: 0 }, cur)
    }
  })
  return pts
}

function useAnchors() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const anchorRefs = useRef<(HTMLElement | null)[]>([])
  const [layout, setLayout] = useState<{
    anchors: Point[]
    height: number
    width: number
  } | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) {
      return
    }
    const measure = () => {
      const box = wrap.getBoundingClientRect()
      const anchors = anchorRefs.current.flatMap((el) => {
        if (!el) {
          return []
        }
        const r = el.getBoundingClientRect()
        return [
          {
            x: r.left - box.left + r.width / 2,
            y: r.top - box.top + r.height / 2,
          },
        ]
      })
      setLayout({ anchors, height: box.height, width: box.width })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(wrap)
    return () => observer.disconnect()
  }, [])

  return { anchorRefs, layout, wrapRef }
}

export function JourneyPath({ chapters }: { chapters: JourneyChapter[] }) {
  const { anchorRefs, layout, wrapRef } = useAnchors()
  const pathRef = useRef<SVGPathElement>(null)
  const maskId = useId().replace(/:/g, '')
  const reduced = useReducedMotion()

  const d = useMemo(
    () => (layout ? roundedPath(zigzag(layout.anchors)) : ''),
    [layout]
  )

  const { scrollYProgress } = useScroll({
    offset: ['start 55%', 'end 55%'],
    target: wrapRef,
  })
  const progress = useSpring(scrollYProgress, {
    damping: 26,
    mass: 0.4,
    stiffness: 140,
  })
  const point = (p: number) => {
    const path = pathRef.current
    if (!(path && d)) {
      return { x: 0, y: 0 }
    }
    return path.getPointAtLength(path.getTotalLength() * p)
  }
  const cx = useTransform(progress, (p) => point(p).x)
  const cy = useTransform(progress, (p) => point(p).y)

  return (
    <div className='relative' ref={wrapRef}>
      {layout && d ? (
        <svg
          aria-hidden
          className='pointer-events-none absolute inset-0 hidden overflow-visible lg:block'
          height={layout.height}
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          width={layout.width}
        >
          <defs>
            <mask id={maskId} maskUnits='userSpaceOnUse'>
              <motion.path
                d={d}
                fill='none'
                stroke='white'
                strokeWidth={12}
                style={{ pathLength: reduced ? 1 : progress }}
              />
            </mask>
          </defs>
          <path
            className='fn-ink-stroke text-[var(--fn-muted)] opacity-40'
            d={d}
            ref={pathRef}
            strokeDasharray='7 9'
            strokeWidth={2}
          />
          <path
            className='fn-ink-stroke text-[var(--fn-pen)]'
            d={d}
            mask={`url(#${maskId})`}
            strokeDasharray='7 9'
            strokeWidth={2}
          />
          {reduced ? null : (
            <>
              <motion.circle
                className='fill-[var(--fn-pen)] opacity-15'
                cx={cx}
                cy={cy}
                r={14}
              />
              <motion.circle
                className='fill-[var(--fn-pen)]'
                cx={cx}
                cy={cy}
                r={6}
              />
            </>
          )}
        </svg>
      ) : null}

      {/* small screens: a straight dashed rail with a dot per chapter */}
      <div
        aria-hidden
        className='absolute top-2 bottom-10 left-[7px] border-[var(--fn-pen-soft)] border-l-2 border-dashed lg:hidden'
      />

      <ol className='relative'>
        {chapters.map((chapter, i) => {
          const flip = i % 2 === 1
          return (
            <li
              className='relative grid items-center gap-8 pt-2 pb-14 pl-9 lg:grid-cols-2 lg:gap-24 lg:py-12 lg:pl-0'
              key={chapter.id}
            >
              <span
                aria-hidden
                className='absolute top-3 left-0 size-4 rounded-full border-2 border-[var(--fn-pen)] bg-[var(--fn-page)] lg:hidden'
              />
              <div
                className={cn(
                  'relative z-10 w-[min(78%,250px)] lg:mx-auto lg:w-[240px]',
                  flip && 'lg:order-2'
                )}
                ref={(el) => {
                  anchorRefs.current[i] = el
                }}
              >
                {chapter.photo}
              </div>
              <div
                className={cn(
                  'lg:max-w-[22rem]',
                  flip && 'lg:order-1 lg:justify-self-end'
                )}
              >
                <p className='fn-label'>
                  Chapter {String(i + 1).padStart(2, '0')} ·{' '}
                  <span className='tabular-nums'>{chapter.years}</span>
                </p>
                <h3 className='fn-serif mt-2 text-[1.9rem] leading-[1.05] sm:text-[2.4rem]'>
                  {chapter.title}
                </h3>
                <p className='mt-3 text-[var(--fn-muted)]'>{chapter.body}</p>
              </div>
            </li>
          )
        })}
      </ol>
      <div className='relative flex flex-col items-start pb-6 pl-9 lg:items-center lg:pl-0'>
        <span
          aria-hidden
          className='absolute top-1.5 left-0 size-4 rounded-full bg-[var(--fn-pen)] lg:static lg:size-3.5'
          ref={(el) => {
            anchorRefs.current[chapters.length] = el
          }}
        />
        <span className='fn-hand -rotate-2 text-[1.6rem] lg:mt-2'>
          you are here
        </span>
      </div>
    </div>
  )
}
