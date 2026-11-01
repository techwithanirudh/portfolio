'use client'

import { useSyncExternalStore } from 'react'
import { REST, type SimbaController } from './controller'
import { SimbaRig } from './rig'

const getRest = () => REST

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
