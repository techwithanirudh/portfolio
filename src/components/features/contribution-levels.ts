import { cn } from '@/lib/utils'

export const contributionLevels = cn(
  'data-[level="0"]:fill-foreground/5',
  'data-[level="1"]:fill-primary/25',
  'data-[level="2"]:fill-primary/50',
  'data-[level="3"]:fill-primary/75',
  'data-[level="4"]:fill-primary'
)
