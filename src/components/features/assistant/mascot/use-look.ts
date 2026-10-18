import { clamp } from 'motion/react'
import { type RefObject, useEffect } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

type Watcher = (x: number, y: number) => void

const watchers = new Set<Watcher>()
let frame = 0
let pointer: { x: number; y: number } | null = null

const flush = () => {
  frame = 0
  if (!pointer) {
    return
  }
  for (const watch of watchers) {
    watch(pointer.x, pointer.y)
  }
}

const onPointerMove = (event: PointerEvent) => {
  pointer = { x: event.clientX, y: event.clientY }
  frame ||= requestAnimationFrame(flush)
}

const watch = (watcher: Watcher) => {
  if (watchers.size === 0) {
    window.addEventListener('pointermove', onPointerMove, { passive: true })
  }
  watchers.add(watcher)
  // Picks up where the pointer is, e.g. when he stops reading
  if (pointer) {
    watcher(pointer.x, pointer.y)
  }
  return () => {
    watchers.delete(watcher)
    if (watchers.size === 0) {
      window.removeEventListener('pointermove', onPointerMove)
      cancelAnimationFrame(frame)
      frame = 0
    }
  }
}

const LOOK_RANGE_PX = 360
const LOOK_SHIFT_X_PX = 1.6
const LOOK_SHIFT_Y_PX = 1.3
const LOOK_TILT_DEG = 5

const toLook = (offset: number) => clamp(-1, 1, offset / LOOK_RANGE_PX)

export function useLook(ref: RefObject<SVGSVGElement | null>, enabled = true) {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const svg = ref.current
    if (!(svg && enabled) || reducedMotion) {
      return
    }
    return watch((x, y) => {
      const box = svg.getBoundingClientRect()
      const dx = toLook(x - (box.left + box.width / 2))
      const dy = toLook(y - (box.top + box.height * 0.35))
      svg.style.setProperty('--look-x', `${dx * LOOK_SHIFT_X_PX}px`)
      svg.style.setProperty('--look-y', `${dy * LOOK_SHIFT_Y_PX}px`)
      svg.style.setProperty('--look-tilt', `${dx * LOOK_TILT_DEG}deg`)
    })
  }, [enabled, ref, reducedMotion])
}
