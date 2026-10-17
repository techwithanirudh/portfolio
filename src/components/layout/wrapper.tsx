'use client'

import type { LenisOptions } from 'lenis'
import type { ReactNode } from 'react'
import { Lenis } from './lenis'

interface WrapperProps {
  children: ReactNode
  lenis?: boolean | LenisOptions
}

// Lenis skips itself when reduced motion is preferred
export function Wrapper({ children, lenis = true }: WrapperProps) {
  return (
    <>
      {children}
      {lenis && <Lenis options={typeof lenis === 'object' ? lenis : {}} root />}
    </>
  )
}
