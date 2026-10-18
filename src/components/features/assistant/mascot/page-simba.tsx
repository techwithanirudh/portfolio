'use client'

import type { ComponentProps } from 'react'
import { useClaimPageSimba } from './presence'
import { SimbaRig } from './rig'

export function PageSimba(props: ComponentProps<typeof SimbaRig>) {
  useClaimPageSimba()
  return <SimbaRig {...props} />
}
