'use client'

// Adapted from braydoncoyer.dev by Braydon Coyer (no license, used with
// attribution): https://github.com/braydoncoyer/braydoncoyer.dev/blob/master/app/components/AboutTrackPattern.tsx
import { m, useScroll, useSpring } from 'motion/react'
import {
  type ReactNode,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

interface Point {
  x: number
  y: number
}

interface Track {
  d: string
  height: number
  markers: Point[]
  width: number
}

const CORNER_RADIUS = 16

const LANE_SELECTOR = '[data-track-lane]'
const MARKER_SELECTOR = '[data-track-marker]'

const layoutOffsetWithin = (element: HTMLElement, container: HTMLElement) => {
  let x = 0
  let y = 0
  let node: HTMLElement | null = element
  while (node && node !== container) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return { x, y }
}

const roundedPath = (points: Point[]) => {
  const [first, ...rest] = points
  if (!first) {
    return ''
  }
  let d = `M${first.x} ${first.y}`
  for (let index = 0; index < rest.length; index++) {
    const current = rest[index] as Point
    const previous = points[index] as Point
    const next = rest[index + 1]
    if (!next) {
      d += ` L${current.x} ${current.y}`
      break
    }
    const radius = Math.min(
      CORNER_RADIUS,
      Math.hypot(current.x - previous.x, current.y - previous.y) / 2,
      Math.hypot(next.x - current.x, next.y - current.y) / 2
    )
    const towards = (target: Point) => {
      const length = Math.hypot(target.x - current.x, target.y - current.y)
      return {
        x: current.x + ((target.x - current.x) / length) * radius,
        y: current.y + ((target.y - current.y) / length) * radius,
      }
    }
    const enter = towards(previous)
    const exit = towards(next)
    d += ` L${enter.x} ${enter.y} Q${current.x} ${current.y} ${exit.x} ${exit.y}`
  }
  return d
}

// Starts above the box so the groove's lit end cap falls outside the mask,
// leaving the track flush with the rule above
const TRACK_START_Y = -4

const traceTrack = (container: HTMLElement): Track | null => {
  const lanes = [...container.querySelectorAll<HTMLElement>(LANE_SELECTOR)]
  if (lanes.length === 0) {
    return null
  }

  const height = container.offsetHeight
  const segments = lanes.map((lane) => {
    const { x, y } = layoutOffsetWithin(lane, container)
    const label =
      lane.parentElement?.querySelector<HTMLElement>(MARKER_SELECTOR)
    const marker = label
      ? layoutOffsetWithin(label, container).y + label.offsetHeight / 2
      : y + lane.offsetHeight / 2
    return { bottom: y + lane.offsetHeight, marker, top: y, x }
  })

  const points: Point[] = []
  segments.forEach((segment, index) => {
    const previous = segments[index - 1]
    if (!previous) {
      points.push({ x: segment.x, y: TRACK_START_Y })
      return
    }
    if (previous.x !== segment.x) {
      const turn = (previous.bottom + segment.top) / 2
      points.push({ x: previous.x, y: turn }, { x: segment.x, y: turn })
    }
  })
  const last = segments.at(-1)
  if (last) {
    points.push({ x: last.x, y: height })
  }

  return {
    d: roundedPath(points),
    height,
    markers: segments.map((segment) => ({ x: segment.x, y: segment.marker })),
    width: container.offsetWidth,
  }
}

const markerProgress = (path: SVGPathElement, markers: Point[]) => {
  const length = path.getTotalLength()
  const end = path.getPointAtLength(length).y
  return markers.map(({ y }) => {
    if (end < y) {
      return Number.POSITIVE_INFINITY
    }
    let low = 0
    let high = length
    while (high - low > 0.5) {
      const mid = (low + high) / 2
      if (path.getPointAtLength(mid).y < y) {
        low = mid
      } else {
        high = mid
      }
    }
    return high / length
  })
}

const spring = { damping: 20, mass: 0.5, stiffness: 100 }

const svgClassName =
  'pointer-events-none absolute inset-0 select-none overflow-visible [mask-image:linear-gradient(black,black)]'

export function StoryTrack({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const id = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [track, setTrack] = useState<Track | null>(null)
  const [reached, setReached] = useState(0)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    offset: ['start center', 'end center'],
    target: containerRef,
  })
  const smoothProgress = useSpring(scrollYProgress, spring)
  const progress = reduceMotion ? scrollYProgress : smoothProgress

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }
    const measure = () => setTrack(traceTrack(container))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const path = pathRef.current
    if (!(path && track)) {
      return
    }
    const thresholds = markerProgress(path, track.markers)
    const follow = (value: number) =>
      setReached(thresholds.filter((threshold) => threshold <= value).length)
    follow(progress.get())
    const unsubscribe = progress.on('change', follow)
    return () => unsubscribe()
  }, [progress, track])

  const grooveId = `${id}-groove`

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      {track ? (
        <svg
          aria-hidden
          className={svgClassName}
          fill='none'
          height={track.height}
          viewBox={`0 0 ${track.width} ${track.height}`}
          width={track.width}
        >
          <defs>
            {/* In user space, a straight track has no width to filter by */}
            <filter
              colorInterpolationFilters='sRGB'
              filterUnits='userSpaceOnUse'
              height={track.height + 40}
              id={grooveId}
              width={track.width + 40}
              x='-20'
              y='-20'
            >
              <feFlood floodOpacity='0' result='BackgroundImageFix' />
              <feBlend
                in='SourceGraphic'
                in2='BackgroundImageFix'
                mode='normal'
                result='shape'
              />
              <feColorMatrix
                in='SourceAlpha'
                result='hardAlpha'
                type='matrix'
                values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
              />
              <feOffset dy='2' />
              <feGaussianBlur stdDeviation='0.75' />
              <feComposite
                in2='hardAlpha'
                k2='-1'
                k3='1'
                operator='arithmetic'
              />
              <feColorMatrix
                type='matrix'
                values='0 0 0 0 0.647059 0 0 0 0 0.682353 0 0 0 0 0.721569 0 0 0 0.32 0'
              />
              <feBlend in2='shape' mode='normal' result='innerShadow' />
            </filter>
          </defs>

          <g filter={`url(#${grooveId})`}>
            <path
              className='stroke-foreground/8'
              d={track.d}
              ref={pathRef}
              strokeLinejoin='round'
              strokeWidth='8'
            />
          </g>
        </svg>
      ) : null}
      {track ? (
        // Its own layer, so redrawing the line each frame does not re-raster
        // the groove filter and the content beneath it
        <svg
          aria-hidden
          className={cn(svgClassName, 'will-change-transform')}
          fill='none'
          height={track.height}
          viewBox={`0 0 ${track.width} ${track.height}`}
          width={track.width}
        >
          <m.path
            className='stroke-primary'
            d={track.d}
            strokeLinejoin='round'
            strokeWidth='4'
            style={{ pathLength: progress }}
          />

          {track.markers.map((marker, index) => (
            <circle
              className={cn(
                'stroke-2 transition-colors duration-300',
                index < reached
                  ? 'fill-primary stroke-background'
                  : 'fill-background stroke-border'
              )}
              cx={marker.x}
              cy={marker.y}
              key={`${marker.x}-${marker.y}`}
              r='5'
            />
          ))}
        </svg>
      ) : null}
      {children}
    </div>
  )
}
