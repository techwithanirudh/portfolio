// Adapted from chanhdai.com/src/features/portfolio/components/handwritten-note.tsx (MIT, © 2026 Chánh Đại). See ../NOTICES.md
import type React from 'react'
import { cn } from '@/lib/utils'

function HandwrittenNote({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'ds-hand pointer-events-none absolute select-none text-(--accent) text-[22px]/none tracking-normal',
        className
      )}
      data-slot='handwritten-note'
      {...props}
    />
  )
}

/** Points down-left. Rotate or mirror it to aim at the subject. */
function HandwrittenArrow({
  className,
  ...props
}: React.ComponentProps<'svg'>) {
  return (
    <svg
      aria-hidden
      className={cn('size-8 shrink-0 text-(--accent)', className)}
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.5'
      viewBox='0 0 40 40'
      {...props}
    >
      <path d='M34 4c1 15-5 26-21 30' />
      <path d='m22 37-9-3 7.5-8' />
    </svg>
  )
}

export { HandwrittenArrow, HandwrittenNote }
