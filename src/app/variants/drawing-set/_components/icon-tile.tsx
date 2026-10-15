// Adapted from chanhdai.com/src/components/ui/icon-tile.tsx (MIT, © 2026 Chánh Đại). See ../NOTICES.md
import type React from 'react'
import { cn } from '@/lib/utils'

/**
 * Small square chip that frames a leading icon in list rows. Squared off and
 * drawn with the sheet's own line colour instead of the original's ring, so it
 * reads as a symbol box on a drawing.
 */
export function IconTile({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex size-6 shrink-0 select-none items-center justify-center rounded-[3px]',
        'border border-(--line-strong)/60 bg-(--paper) text-(--ink-muted)',
        'shadow-[0_0_0_2px_var(--sheet),0_0_0_3px_var(--line)]',
        "[&_svg:not([class*='size-'])]:size-3.5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      data-slot='icon-tile'
      {...props}
    />
  )
}
