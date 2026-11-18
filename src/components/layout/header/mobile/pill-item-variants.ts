import { cva } from 'class-variance-authority'

export const pillItemVariants = cva(
  'relative flex size-8 touch-manipulation select-none items-center justify-center rounded-full transition-[color,background-color,scale] duration-150 ease-out-strong after:absolute after:-inset-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-96',
  {
    defaultVariants: { active: false },
    variants: {
      active: {
        false: 'text-muted-foreground hover:text-foreground',
        true: 'bg-primary/10 text-primary',
      },
    },
  }
)
