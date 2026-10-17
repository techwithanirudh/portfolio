import { type RefObject, useEffect } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

type Watcher = (x: number, y: number) => void

// One pointer listener feeds every Simba on the page
const watchers = new Set<Watcher>()
let frame = 0
let pointer = { x: 0, y: 0 }

const flush = () => {
  frame = 0
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
  return () => {
    watchers.delete(watcher)
    if (watchers.size === 0) {
      window.removeEventListener('pointermove', onPointerMove)
      cancelAnimationFrame(frame)
      frame = 0
    }
  }
}

const clamp = (value: number) => Math.max(-1, Math.min(1, value))

// Eyes and head drift toward the pointer through CSS variables, so following
// it never re-renders
export function useLook(ref: RefObject<SVGSVGElement | null>, enabled = true) {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const svg = ref.current
    if (!(svg && enabled) || reducedMotion) {
      return
    }
    return watch((x, y) => {
      const box = svg.getBoundingClientRect()
      const dx = clamp((x - (box.left + box.width / 2)) / 360)
      const dy = clamp((y - (box.top + box.height * 0.35)) / 360)
      svg.style.setProperty('--look-x', `${dx * 1.6}px`)
      svg.style.setProperty('--look-y', `${dy * 1.3}px`)
      svg.style.setProperty('--look-tilt', `${dx * 5}deg`)
    })
  }, [enabled, ref, reducedMotion])
}
