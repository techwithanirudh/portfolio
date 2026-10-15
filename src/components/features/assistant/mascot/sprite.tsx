'use client'

import { useSyncExternalStore } from 'react'
import { cn } from '@/lib/utils'
import { SIMBA } from './constants'
import type { SimbaController } from './controller'

const first = () => SIMBA.animations.Idle.frames[0] ?? { x: 0, y: 0 }

export function MascotSprite({
  className,
  mascot,
}: {
  className?: string
  mascot: SimbaController
}) {
  const { x, y } = useSyncExternalStore(
    mascot.subscribe,
    mascot.getFrame,
    first
  )
  const [width, height] = SIMBA.frame

  return (
    <span
      aria-hidden
      className={cn('block bg-no-repeat', className)}
      style={{
        backgroundImage: `url(${SIMBA.sprite})`,
        backgroundPosition: `-${x}px -${y}px`,
        height,
        width,
      }}
    />
  )
}
