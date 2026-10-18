'use client'

import type { ReactNode } from 'react'
import { Lenis } from './lenis'

// Lenis skips itself when reduced motion is preferred
// TODO(slopradar): pass-through-wrapper: Wrapper is `{children}<Lenis />` behind a needless 'use client' (Lenis is already a client component), mount <Lenis /> once in SiteShell and delete Wrapper and its five page imports
export function Wrapper({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Lenis />
    </>
  )
}
