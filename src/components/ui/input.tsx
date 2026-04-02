import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/lib/utils'

const inputVariants = cva(
  'h-9 w-full min-w-0 border border-input bg-transparent px-2.5 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
  {
    variants: {
      shape: {
        default: 'rounded-md',
        square: 'rounded-none',
      },
    },
    defaultVariants: {
      shape: 'default',
    },
  }
)

function Input({
  className,
  type,
  shape = 'default',
  ...props
}: React.ComponentProps<'input'> & VariantProps<typeof inputVariants>) {
  return (
    <input
      className={cn(inputVariants({ shape, className }))}
      data-shape={shape}
      data-slot='input'
      type={type}
      {...props}
    />
  )
}

export { Input }
