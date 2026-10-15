'use client'

import { useLayoutEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { SIMBA } from './constants'

const FADE_MS = 160

const position = ({ x, y }: { x: number; y: number }) => `-${x}px -${y}px`

// Two stacked layers: the old pose stays underneath while the new one fades
// in over it, which reads as motion instead of a hard cut between poses
export function SimbaFrame({
  className,
  x,
  y,
}: {
  className?: string
  x: number
  y: number
}) {
  const back = useRef<HTMLSpanElement>(null)
  const front = useRef<HTMLSpanElement>(null)
  const shown = useRef({ x, y })
  const [width, height] = SIMBA.frame

  useLayoutEffect(() => {
    const previous = shown.current
    shown.current = { x, y }
    if (!(back.current && front.current)) {
      return
    }
    if (previous.x === x && previous.y === y) {
      return
    }
    back.current.style.backgroundPosition = position(previous)
    front.current.style.backgroundPosition = position({ x, y })
    for (const animation of front.current.getAnimations()) {
      animation.cancel()
    }
    front.current.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: FADE_MS,
      easing: 'ease-out',
    })
  }, [x, y])

  const layer = {
    backgroundImage: `url(${SIMBA.sprite})`,
    backgroundPosition: position({ x, y }),
    height,
    width,
  }

  return (
    <span
      aria-hidden
      className={cn('relative block shrink-0', className)}
      style={{ height, width }}
    >
      <span
        className='absolute inset-0 bg-no-repeat'
        ref={back}
        style={layer}
      />
      <span
        className='absolute inset-0 bg-no-repeat'
        ref={front}
        style={layer}
      />
    </span>
  )
}
