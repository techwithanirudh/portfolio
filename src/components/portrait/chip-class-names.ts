import { cn } from '@/lib/utils'

export const portraitChipClassName =
  'inline-block size-[0.8em] shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border ring-inset'

export const inlineChipClassName = cn(
  portraitChipClassName,
  'mx-[0.04em] translate-y-[0.08em]'
)
