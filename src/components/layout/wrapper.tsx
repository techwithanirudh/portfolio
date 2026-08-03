'use client'

import type { LenisOptions } from 'lenis'
import { useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { Lenis } from './scroll/lenis'

interface WrapperProps {
  children: ReactNode
  lenis?: boolean | LenisOptions
}

export function Wrapper({ children, lenis = true }: WrapperProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <>
      {children}
      {lenis && !prefersReducedMotion && (
        <Lenis options={typeof lenis === 'object' ? lenis : {}} root />
      )}
    </>
  )
}
