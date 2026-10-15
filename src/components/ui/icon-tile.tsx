// Adapted from chanhdai.com (MIT, (c) Chanh Dai): https://github.com/ncdai/chanhdai.com
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function IconTile({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex size-6 shrink-0 select-none items-center justify-center rounded-md',
        'border border-muted-foreground/15 bg-muted text-muted-foreground',
        'ring-1 ring-border/50 ring-offset-1 ring-offset-background dark:ring-line',
        "[&_svg:not([class*='size-'])]:size-3.5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      data-slot='icon-tile'
      {...props}
    />
  )
}
