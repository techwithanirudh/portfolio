// Adapted from chanhdai.com/src/components/ui/tag.tsx (MIT, © 2026 Chánh Đại). See ../NOTICES.md
import type React from 'react'
import { cn } from '@/lib/utils'

function Tag({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-[3px] border border-(--line) bg-(--paper) px-1.5 py-px font-mono text-(--ink-muted) text-[11px] leading-4',
        "[&_svg:not([class*='size-'])]:size-3 [&_svg]:shrink-0",
        className
      )}
      data-slot='tag'
      {...props}
    />
  )
}

export { Tag }
