'use client'

import { useSyncExternalStore } from 'react'
import type { Frame } from './constants'
import type { SimbaController } from './controller'
import { SimbaRig } from './rig'

const REST: Frame = { duration: 0, pose: 'rest' }
const getRest = () => REST

// Simba in whatever pose his controller is on
export function MascotSprite({
  className,
  mascot,
  size,
}: {
  className?: string
  mascot: SimbaController
  size?: number
}) {
  const { pose } = useSyncExternalStore(
    mascot.subscribe,
    mascot.getFrame,
    getRest
  )

  return <SimbaRig className={className} pose={pose} size={size} />
}
