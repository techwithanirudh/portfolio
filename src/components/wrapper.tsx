'use client'

import type { ReactNode } from 'react'

interface WrapperProps {
  children: ReactNode
}

export function Wrapper({ children }: WrapperProps) {
  return <>{children}</>
}
