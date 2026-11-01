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

/** -1 to 1 across 360px either side of him */
const toLook = (offset: number) => clamp(-1, 1, offset / 360)

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
      svg.style.setProperty('--look-x', `${dx * 1.6}px`)
      svg.style.setProperty('--look-y', `${dy * 1.3}px`)
      svg.style.setProperty('--look-tilt', `${dx * 5}deg`)
    })
  }, [enabled, ref, reducedMotion])
}
