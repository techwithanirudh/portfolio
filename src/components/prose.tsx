import { Slot } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function Prose({
  className,
  asChild = false,
  ...props
}: ComponentProps<'div'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'div'

  return (
    <Comp
      className={cn(
        'prose prose-zinc dark:prose-invert prose-content max-w-none',
        className
      )}
      data-slot='prose'
      {...props}
    />
  )
}
