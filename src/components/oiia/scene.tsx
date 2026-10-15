'use client'

import { OiiaAudio } from './audio'
import { OiiaEngine } from './engine'
import { OiiaWidget } from './widget'

export function OiiaScene() {
  return (
    <>
      <OiiaEngine />
      <OiiaWidget />
      <OiiaAudio />
    </>
  )
}
