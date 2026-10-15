import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { flushControlClassName } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const textareaVariants = cva(
  'field-sizing-content flex min-h-16 w-full rounded-md border border-input bg-transparent px-2.5 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
  {
    variants: {
      variant: {
        default: '',
        flush: `max-h-[20rem] min-h-[10rem] resize-y py-3 ${flushControlClassName}`,
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Textarea({
  className,
  variant,
  ...props
}: React.ComponentProps<'textarea'> & VariantProps<typeof textareaVariants>) {
  return (
    <textarea
      className={cn(textareaVariants({ variant }), className)}
      data-slot='textarea'
      {...props}
    />
  )
}

export { Textarea, textareaVariants }
