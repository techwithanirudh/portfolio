'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useWorkspace } from './workspace'

const STEP = 100

interface Span {
  end: number
  start: number
}

function useOrigin() {
  const pathname = usePathname()
  const [origin, setOrigin] = useState<{
    height: number
    left: number
    top: number
  } | null>(null)

  // Re-measure on every page, since each page has its own first frame.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger
  useEffect(() => {
    const canvas = document.querySelector<HTMLElement>('.ab-canvas')
    if (!canvas) {
      return
    }
    const measure = () => {
      const frame = canvas.querySelector<HTMLElement>('[data-frame]')
      if (!frame) {
        return
      }
      const rect = frame.getBoundingClientRect()
      setOrigin({
        height: canvas.offsetHeight,
        left: rect.left,
        top: rect.top + window.scrollY,
      })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(canvas)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [pathname])

  return origin
}

/** The selected layer's extent in page coordinates, kept fresh on resize. */
function useSelectionRect() {
  const { selection } = useWorkspace()
  const [rect, setRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    const el = selection?.el
    if (!el) {
      setRect(null)
      return
    }
    const measure = () => {
      const r = el.getBoundingClientRect()
      setRect(new DOMRect(r.left, r.top + window.scrollY, r.width, r.height))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    const canvas = document.querySelector('.ab-canvas')
    if (canvas) {
      observer.observe(canvas)
    }
    return () => observer.disconnect()
  }, [selection])

  return rect
}

const usePointerGuide = (
  onMove: (x: number, y: number) => void,
  onLeave: () => void
) => {
  const move = useRef(onMove)
  const leave = useRef(onLeave)
  move.current = onMove
  leave.current = onLeave

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) {
      return
    }
    let last: { x: number; y: number } | null = null
    let frame = 0
    const flush = () => {
      frame = 0
      if (last) {
        move.current(last.x, last.y + window.scrollY)
      }
    }
    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(flush)
      }
    }
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') {
        return
      }
      last = { x: event.clientX, y: event.clientY }
      schedule()
    }
    const onOut = (event: PointerEvent) => {
      if (!event.relatedTarget) {
        last = null
        leave.current()
      }
    }
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('scroll', schedule, { passive: true })
    document.addEventListener('pointerout', onOut)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('scroll', schedule)
      document.removeEventListener('pointerout', onOut)
    }
  }, [])
}

function labels(from: number, to: number) {
  const out: number[] = []
  for (let v = Math.floor(from / STEP) * STEP; v <= to; v += STEP) {
    out.push(v)
  }
  return out
}

/**
 * Horizontal ruler, sticky under the title bar. Zero sits on the left edge
 * of the artboards; the selection's extent shows as a blue band and a guide
 * follows the pointer with its coordinate.
 */
export function TopRuler() {
  const origin = useOrigin()
  const sel = useSelectionRect()
  const track = useRef<HTMLDivElement>(null)
  const guide = useRef<HTMLDivElement>(null)
  const guideLabel = useRef<HTMLSpanElement>(null)
  const [trackBox, setTrackBox] = useState<Span>({ end: 0, start: 0 })

  useEffect(() => {
    const el = track.current
    if (!el) {
      return
    }
    const measure = () => {
      const r = el.getBoundingClientRect()
      setTrackBox({ end: r.right, start: r.left })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  usePointerGuide(
    (x) => {
      const g = guide.current
      const l = guideLabel.current
      if (!(g && l && origin) || x < trackBox.start || x > trackBox.end) {
        g?.removeAttribute('data-on')
        return
      }
      g.setAttribute('data-on', '')
      g.style.transform = `translateX(${x - trackBox.start}px)`
      l.textContent = String(Math.round(x - origin.left))
    },
    () => guide.current?.removeAttribute('data-on')
  )

  const offset = origin ? origin.left - trackBox.start : 0
  const values = origin
    ? labels(trackBox.start - origin.left, trackBox.end - origin.left)
    : []

  return (
    <div
      aria-hidden
      className='ab-ruler sticky top-(--bar-h) z-30 hidden h-(--ruler-size) md:flex'
    >
      <div className='ab-ruler grid w-(--ruler-size) flex-none place-items-center border-(--panel-line) border-r border-b'>
        <span className='block size-1.5 rounded-full bg-(--tick)' />
      </div>
      <div
        className='ab-ruler ab-ruler-x relative min-w-0 flex-1 overflow-hidden border-(--panel-line) border-b'
        ref={track}
        style={{ backgroundPositionX: `${offset}px` }}
      >
        {values.map((v) => (
          <span
            className='absolute top-px leading-none'
            key={v}
            style={{ left: v + offset + 3 }}
          >
            {v}
          </span>
        ))}
        {sel ? (
          <>
            <span
              className='ab-ruler-band-x'
              style={{ left: sel.left - trackBox.start, width: sel.width }}
            />
            <span
              className='ab-ruler-mark top-px -translate-x-full'
              style={{ left: sel.left - trackBox.start - 1 }}
            >
              {Math.round(sel.left - (origin?.left ?? 0))}
            </span>
            <span
              className='ab-ruler-mark top-px'
              style={{ left: sel.right - trackBox.start + 1 }}
            >
              {Math.round(sel.right - (origin?.left ?? 0))}
            </span>
          </>
        ) : null}
        <div className='ab-guide top-0 bottom-0 left-0 w-px' ref={guide}>
          <span className='ab-guide-label top-px left-1' ref={guideLabel} />
        </div>
      </div>
    </div>
  )
}

/**
 * Vertical ruler. It scrolls with the page, which is exactly what a design
 * tool's ruler does: the numbers under the cursor are page coordinates, with
 * zero on the top edge of the first artboard.
 */
export function LeftRuler() {
  const origin = useOrigin()
  const sel = useSelectionRect()
  const self = useRef<HTMLDivElement>(null)
  const guide = useRef<HTMLDivElement>(null)
  const guideLabel = useRef<HTMLSpanElement>(null)
  const [top, setTop] = useState(0)

  useEffect(() => {
    const el = self.current
    if (!el) {
      return
    }
    const measure = () =>
      setTop(el.getBoundingClientRect().top + window.scrollY)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  usePointerGuide(
    (x, pageY) => {
      const g = guide.current
      const l = guideLabel.current
      const el = self.current
      if (!(g && l && origin && el)) {
        return
      }
      const r = el.getBoundingClientRect()
      const viewY = pageY - window.scrollY
      if (x < r.left || viewY < r.top + 0 || viewY < 60) {
        g.removeAttribute('data-on')
        return
      }
      g.setAttribute('data-on', '')
      g.style.transform = `translateY(${pageY - top}px)`
      l.textContent = String(Math.round(pageY - origin.top))
    },
    () => guide.current?.removeAttribute('data-on')
  )

  const offset = origin ? origin.top - top : 0
  const values = origin ? labels(-offset, origin.height - offset) : []

  return (
    <div
      aria-hidden
      className='ab-ruler ab-ruler-y relative hidden w-(--ruler-size) overflow-hidden border-(--panel-line) border-r md:block'
      ref={self}
      style={{ backgroundPositionY: `${offset}px` }}
    >
      {values.map((v) => (
        <span
          className='absolute left-px rotate-180 leading-none [writing-mode:vertical-rl]'
          key={v}
          style={{ top: v + offset + 3 }}
        >
          {v}
        </span>
      ))}
      {sel ? (
        <>
          <span
            className='ab-ruler-band-y'
            style={{ height: sel.height, top: sel.top - top }}
          />
          <span
            className='ab-ruler-mark left-px rotate-180 [writing-mode:vertical-rl]'
            style={{ top: sel.top - top + 2 }}
          >
            {Math.round(sel.top - (origin?.top ?? 0))}
          </span>
          <span
            className='ab-ruler-mark left-px -translate-y-full rotate-180 [writing-mode:vertical-rl]'
            style={{ top: sel.bottom - top - 2 }}
          >
            {Math.round(sel.bottom - (origin?.top ?? 0))}
          </span>
        </>
      ) : null}
      <div className='ab-guide top-0 right-0 left-0 h-px' ref={guide}>
        <span
          className='ab-guide-label top-1 left-px rotate-180 [writing-mode:vertical-rl]'
          ref={guideLabel}
        />
      </div>
    </div>
  )
}
