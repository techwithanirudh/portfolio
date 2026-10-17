import { REDUCED_MOTION_QUERY } from './reduced-motion'

// Named media queries, so a breakpoint is written once. `docked` matches the
// `lg` breakpoint, where the assistant panel sits beside the page
export const MEDIA = {
  coarsePointer: '(pointer: coarse)',
  desktopNav: '(min-width: 768px)',
  docked: '(min-width: 64rem)',
  finePointer: '(pointer: fine)',
  hoverFinePointer: '(hover: hover) and (pointer: fine)',
  mobile: '(max-width: 767px)',
  reducedMotion: REDUCED_MOTION_QUERY,
} as const
