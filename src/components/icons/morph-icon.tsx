'use client'

import { Check, CircleX, Copy, Mail, Volume2, VolumeX } from 'lucide'
import { MorphIcon as Morph, type MorphIconProps } from 'morphicons/react'

// morphicons reads raw icon data, so these come from `lucide`, not `lucide-react`
export const morphIcons = {
  check: Check,
  copy: Copy,
  error: CircleX,
  mail: Mail,
  volumeOff: VolumeX,
  volumeOn: Volume2,
} as const

export const MorphIcon = (props: MorphIconProps) => (
  <Morph reducedMotion='user' spring='snappy' {...props} />
)
