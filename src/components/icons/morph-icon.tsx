'use client'

import {
  Copy01Icon,
  Mail01Icon,
  MultiplicationSignCircleIcon,
  Tick02Icon,
  VolumeHighIcon,
  VolumeMute02Icon,
} from '@hugeicons/core-free-icons'
import { MorphIcon as Morph, type MorphIconProps } from 'morphicons/react'

// morphicons reads raw icon data, so these are the Hugeicons nodes, the same
// ones `Icons` renders statically for these keys
export const morphIcons = {
  check: Tick02Icon,
  copy: Copy01Icon,
  error: MultiplicationSignCircleIcon,
  mail: Mail01Icon,
  volumeOff: VolumeMute02Icon,
  volumeOn: VolumeHighIcon,
} as const

export const MorphIcon = (props: MorphIconProps) => (
  <Morph reducedMotion='user' spring='snappy' {...props} />
)
