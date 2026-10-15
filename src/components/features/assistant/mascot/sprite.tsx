'use client'

import { useSyncExternalStore } from 'react'
import { SIMBA } from './constants'
import type { SimbaController } from './controller'
import { SimbaFrame } from './frame'

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

  return <SimbaFrame className={className} x={x} y={y} />
}
