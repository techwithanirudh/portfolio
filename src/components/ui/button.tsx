import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 active:scale-[0.96]",
  {
    variants: {
      variant: {
        default:
          'group relative isolate overflow-hidden transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] shadow-[0_0_12px_rgba(56,103,214,0.3),0_1px_3px_rgba(0,0,0,0.2)] ring-1 ring-inset hover:shadow-[0_0_16px_rgba(56,103,214,0.4),0_2px_8px_rgba(0,0,0,0.3)] focus-visible:shadow-[0_0_16px_rgba(56,103,214,0.4),0_2px_8px_rgba(0,0,0,0.3)] after:pointer-events-none after:select-none after:absolute after:top-0 after:right-0 after:bottom-0 after:left-0 after:m-px after:rounded-[calc(0.375rem-1px)] after:border after:border-white after:opacity-20 after:[mask:linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_100%)] dark:after:opacity-15 bg-gradient-to-br from-blue-500 to-blue-700 text-white ring-blue-600 dark:from-blue-400 dark:to-blue-600 dark:shadow-[0_0_20px_rgba(136,164,230,0.4),0_2px_8px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_0_28px_rgba(136,164,230,0.5),0_4px_12px_rgba(0,0,0,0.6)] dark:ring-blue-400',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-border dark:bg-input/30 dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      data-slot='button'
      {...props}
    />
  )
}

export { Button, buttonVariants }
