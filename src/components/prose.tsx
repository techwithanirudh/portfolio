import { Slot } from '@radix-ui/react-slot'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function Prose({
  className,
  asChild = false,
  ...props
}: ComponentProps<'div'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'div'

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
