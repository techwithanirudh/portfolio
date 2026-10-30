'use client'

import { useClaimPageSimba } from '@/components/features/assistant/mascot/presence'
import { SimbaRig } from '@/components/features/assistant/mascot/rig'

export function SimbaThinking({
  className,
  size,
}: {
  className?: string
  /** Height as px, or any CSS length so he can scale with text via em */
  size?: number | string
}) {
  useClaimPageSimba()

  return <SimbaRig className={className} pose='thinking' size={size} />
}
