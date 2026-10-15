'use client'

import { useEffect, useRef } from 'react'

const format = (n: number) =>
  `${n < 0 ? '-' : ''}${String(Math.abs(Math.round(n))).padStart(4, '0')}`

/**
 * X/Y readout measured from the sheet's top-left corner, so the gutters read
 * negative. Live on fine pointers only; touch devices keep the static origin.
 * Writes straight to the DOM once per frame instead of re-rendering React.
 */
export function PointerCoordinates() {
  const xRef = useRef<HTMLSpanElement>(null)
  const yRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) {
      return
    }
    const origin = document.querySelector('[data-sheet-origin]')
    let frame = 0
    let x = 0
    let y = 0

    const paint = () => {
      frame = 0
      const rect = origin?.getBoundingClientRect()
      const left = rect ? rect.left : 0
      const top = rect ? rect.top : 0
      if (xRef.current) {
        xRef.current.textContent = format(x - left)
      }
      if (yRef.current) {
        yRef.current.textContent = format(y - top)
      }
    }

    const onMove = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
      if (!frame) {
        frame = requestAnimationFrame(paint)
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <p aria-hidden className='ds-label whitespace-nowrap tabular-nums'>
      X{' '}
      <span className='text-(--ink)' ref={xRef}>
        0000
      </span>
      <span className='px-1.5 text-(--ink-faint)'>·</span>Y{' '}
      <span className='text-(--ink)' ref={yRef}>
        0000
      </span>
    </p>
  )
}
