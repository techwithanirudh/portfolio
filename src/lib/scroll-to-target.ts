import type LenisInstance from 'lenis'

export const scrollToTarget = (
  lenis: LenisInstance | undefined,
  target: HTMLElement,
  // TODO(slopradar): dead-option: both callers (search/dialog.tsx, tools/navigate.tsx) pass `immediate: prefersReducedMotion()`, read the preference here and drop the parameter; header/index.tsx scroll-to-top still hand-rolls the same lenis-or-native branch
  { immediate }: { immediate: boolean }
) => {
  if (lenis) {
    lenis.scrollTo(target, { immediate })
  } else {
    target.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' })
  }
}
