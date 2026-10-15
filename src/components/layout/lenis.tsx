'use client'

import type { LenisOptions } from 'lenis'
import 'lenis/dist/lenis.css'
import type { LenisRef, LenisProps as ReactLenisProps } from 'lenis/react'
import { ReactLenis } from 'lenis/react'
import { useRef, useSyncExternalStore } from 'react'
import { useTempus } from 'tempus/react'

interface LenisProps extends Omit<ReactLenisProps, 'ref'> {
  options: LenisOptions
  root: boolean
}

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

const subscribeReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

// Native scrolling is the reduced motion experience, so skip Lenis (and its
// Tempus loop) entirely, and pick it back up if the setting flips
export function Lenis(props: LenisProps) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => true
  )

  return reducedMotion ? null : <SmoothScroll {...props} />
}

function SmoothScroll({ root, options }: LenisProps) {
  const lenisRef = useRef<LenisRef>(null)

  useTempus(({ time }) => {
    if (lenisRef.current?.lenis) {
      lenisRef.current.lenis.raf(time)
    }
  })

  return (
    <ReactLenis
      options={{
        ...options,
        anchors: true,
        autoRaf: false,
        lerp: options?.lerp ?? 0.18,
        prevent: (node: Element | null) =>
          node?.nodeName === 'VERCEL-LIVE-FEEDBACK' ||
          node?.id === 'theatrejs-studio-root' ||
          Boolean(node?.closest?.('[data-lenis-prevent]')),
      }}
      ref={lenisRef}
      root={root}
    />
  )
}
