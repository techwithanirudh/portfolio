'use client'

import 'lenis/dist/lenis.css'
import type { LenisRef } from 'lenis/react'
import { ReactLenis } from 'lenis/react'
import { useRef } from 'react'
import { useTempus } from 'tempus/react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export function Lenis() {
  const reducedMotion = useReducedMotion()

  return reducedMotion ? null : <SmoothScroll />
}

function SmoothScroll() {
  const lenisRef = useRef<LenisRef>(null)

  useTempus(({ time }) => {
    if (lenisRef.current?.lenis) {
      lenisRef.current.lenis.raf(time)
    }
  })

  return (
    <ReactLenis
      options={{
        anchors: true,
        autoRaf: false,
        lerp: 0.18,
        prevent: (node: Element | null) =>
          node?.nodeName === 'VERCEL-LIVE-FEEDBACK' ||
          Boolean(node?.closest?.('[data-lenis-prevent]')),
      }}
      ref={lenisRef}
      root
    />
  )
}
