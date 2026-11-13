import type { ReactNode } from 'react'
import { Lenis } from './lenis'

export function Wrapper({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Lenis />
    </>
  )
}
