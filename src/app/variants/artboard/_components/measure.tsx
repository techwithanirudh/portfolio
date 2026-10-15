'use client'

import { useEffect, useState } from 'react'

interface Measure {
  frame: DOMRect
  rect: DOMRect
}

/**
 * Hold Alt (Option) and hover a card to see its distance to the artboard's
 * edges, like the redlines a design tool draws. Fine pointers only.
 */
export function MeasureOverlay() {
  const [m, setM] = useState<Measure | null>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) {
      return
    }
    let alt = false
    let target: HTMLElement | null = null
    const update = () => {
      const frame = target?.closest<HTMLElement>('[data-frame]')
      if (!(alt && target && frame)) {
        setM(null)
        return
      }
      setM({
        frame: frame.getBoundingClientRect(),
        rect: target.getBoundingClientRect(),
      })
    }
    const onMove = (event: PointerEvent) => {
      alt = event.altKey
      target = (event.target as HTMLElement).closest<HTMLElement>(
        '.ab-selectable'
      )
      update()
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Alt') {
        event.preventDefault()
        alt = event.type === 'keydown'
        update()
      }
    }
    const onScroll = () => update()
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    const onBlur = () => {
      alt = false
      update()
    }
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', onKey)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('blur', onBlur)
    }
  }, [])

  if (!m) {
    return null
  }

  const { frame: f, rect: r } = m
  const cx = r.left + r.width / 2
  const cy = r.top + r.height / 2
  const lines = [
    { h: false, len: r.top - f.top, x: cx, y: f.top },
    { h: false, len: f.bottom - r.bottom, x: cx, y: r.bottom },
    { h: true, len: r.left - f.left, x: f.left, y: cy },
    { h: true, len: f.right - r.right, x: r.right, y: cy },
  ].filter((l) => l.len > 0.5)

  return (
    <div aria-hidden className='pointer-events-none fixed inset-0 z-30'>
      <span
        className='absolute outline outline-(--path) outline-1'
        style={{ height: r.height, left: r.left, top: r.top, width: r.width }}
      />
      {lines.map((l) => (
        <span
          className='absolute bg-(--path)'
          key={`${l.h}-${l.x}-${l.y}`}
          style={
            l.h
              ? { height: 1, left: l.x, top: l.y, width: l.len }
              : { height: l.len, left: l.x, top: l.y, width: 1 }
          }
        >
          <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-sm bg-(--path) px-1 font-mono text-[11px] text-white leading-4'>
            {Math.round(l.len)}
          </span>
        </span>
      ))}
    </div>
  )
}
