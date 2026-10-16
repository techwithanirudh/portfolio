'use client'

// Adapted from braydoncoyer.dev by Braydon Coyer (no license, used with
// attribution): https://github.com/braydoncoyer/braydoncoyer.dev/blob/master/app/components/AboutTrackPattern.tsx
// The original path is drawn by hand around four fixed sections. This one is
// traced from a lane marker in every chapter, so it follows the copy at any
// width: snaking past the photos on wide screens and running straight down
// the left edge on phones.
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'motion/react'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
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

// Offset of an element inside the container, ignoring transforms so the
// scroll reveal does not move the track while it plays
const offsetWithin = (element: HTMLElement, container: HTMLElement) => {
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

// Right angled polyline with rounded corners, like the hand drawn original
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

// Down each lane, across in the gap between chapters, from the top rule of
// the section to the bottom one
const traceTrack = (container: HTMLElement): Track | null => {
  const lanes = [...container.querySelectorAll<HTMLElement>(LANE_SELECTOR)]
  if (lanes.length === 0) {
    return null
  }

  const height = container.offsetHeight
  const segments = lanes.map((lane) => {
    const { x, y } = offsetWithin(lane, container)
    // Each chapter marks the track beside its label, or halfway down
    const label =
      lane.parentElement?.querySelector<HTMLElement>(MARKER_SELECTOR)
    const marker = label
      ? offsetWithin(label, container).y + label.offsetHeight / 2
      : y + lane.offsetHeight / 2
    return { bottom: y + lane.offsetHeight, marker, top: y, x }
  })

  const points: Point[] = []
  segments.forEach((segment, index) => {
    const previous = segments[index - 1]
    if (!previous) {
      points.push({ x: segment.x, y: 0 })
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

const spring = { damping: 20, mass: 0.5, stiffness: 100 }

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
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const dotX = useSpring(x, spring)
  const dotY = useSpring(y, spring)
  const reduceMotion = useReducedMotion()
  const placed = useRef(false)

  const { scrollYProgress } = useScroll({
    offset: ['start center', 'end center'],
    target: containerRef,
  })

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

  const follow = useCallback(
    (progress: number) => {
      const path = pathRef.current
      if (!(path && track)) {
        return
      }
      const length = path.getTotalLength()
      const point = path.getPointAtLength(
        length * Math.max(0, Math.min(progress, 1))
      )
      x.set(point.x)
      y.set(point.y)
      // Land on the track at once on load, then glide like the original
      if (!placed.current || reduceMotion) {
        dotX.jump(point.x)
        dotY.jump(point.y)
        placed.current = true
      }
      setReached(track.markers.filter((marker) => marker.y <= point.y).length)
    },
    [dotX, dotY, reduceMotion, track, x, y]
  )

  useEffect(() => {
    follow(scrollYProgress.get())
    return scrollYProgress.on('change', follow)
  }, [follow, scrollYProgress])

  const maskId = `${id}-mask`
  const glowId = `${id}-glow`
  const grooveId = `${id}-groove`

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      {track ? (
        <svg
          aria-hidden
          className='pointer-events-none absolute inset-0 select-none overflow-visible'
          fill='none'
          height={track.height}
          viewBox={`0 0 ${track.width} ${track.height}`}
          width={track.width}
        >
          <defs>
            <filter height='300%' id={glowId} width='300%' x='-100%' y='-100%'>
              <feGaussianBlur stdDeviation='15' />
            </filter>

            <mask id={maskId}>
              <path
                d={track.d}
                stroke='white'
                strokeLinejoin='round'
                strokeWidth='8'
              />
            </mask>

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

          {/* The glow only shows inside the track */}
          <g mask={`url(#${maskId})`}>
            <motion.circle
              className='fill-primary'
              cx={dotX}
              cy={dotY}
              filter={`url(#${glowId})`}
              opacity='0.5'
              r='120'
            />
          </g>

          <g filter={`url(#${grooveId})`}>
            <path
              className='stroke-foreground/8'
              d={track.d}
              ref={pathRef}
              strokeLinejoin='round'
              strokeWidth='8'
            />
          </g>

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

          <motion.circle
            className='fill-primary stroke-2 stroke-background'
            cx={dotX}
            cy={dotY}
            r='10'
          />
        </svg>
      ) : null}
      {children}
    </div>
  )
}
