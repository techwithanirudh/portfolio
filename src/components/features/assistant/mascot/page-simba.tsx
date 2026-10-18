'use client'

import type { ComponentProps } from 'react'
import { useClaimPageSimba } from './presence'
import { SimbaRig } from './rig'

// Simba as part of a page (a sent message, an empty list), which sends the
// corner Simba away while he's on screen
export function PageSimba(props: ComponentProps<typeof SimbaRig>) {
  useClaimPageSimba()
  return <SimbaRig {...props} />
}
