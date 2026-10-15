'use client'

import { useSyncExternalStore } from 'react'
import type { SimbaController } from './controller'
import { SimbaRig } from './rig'

const rest = () => ({ duration: 0, pose: 'rest' as const })

export function MascotSprite({
  className,
  mascot,
}: {
  className?: string
  mascot: SimbaController
}) {
  const { pose } = useSyncExternalStore(mascot.subscribe, mascot.getFrame, rest)

  return <SimbaRig className={className} pose={pose} />
}
