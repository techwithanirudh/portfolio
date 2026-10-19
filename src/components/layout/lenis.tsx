'use client'

import 'lenis/dist/lenis.css'
import { ReactLenis } from 'lenis/react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export function Lenis() {
  const reducedMotion = useReducedMotion()

  return reducedMotion ? null : (
    <ReactLenis
      options={{
        anchors: true,
        lerp: 0.18,
        prevent: (node: Element | null) =>
          node?.nodeName === 'VERCEL-LIVE-FEEDBACK' ||
          Boolean(node?.closest?.('[data-lenis-prevent]')),
      }}
      root
    />
  )
}
