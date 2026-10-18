import type LenisInstance from 'lenis'

export const scrollToTarget = (
  lenis: LenisInstance | undefined,
  target: HTMLElement,
  { immediate }: { immediate: boolean }
) => {
  if (lenis) {
    lenis.scrollTo(target, { immediate })
  } else {
    target.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' })
  }
}
