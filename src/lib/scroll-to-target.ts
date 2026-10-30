import type LenisInstance from 'lenis'
import { prefersReducedMotion } from '@/lib/reduced-motion'

export const scrollToTarget = (
  lenis: LenisInstance | undefined,
  target: HTMLElement
) => {
  const immediate = prefersReducedMotion()
  if (lenis) {
    lenis.scrollTo(target, { immediate })
  } else {
    target.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' })
  }
}
