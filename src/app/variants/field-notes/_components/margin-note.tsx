import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { type ArrowDirection, HandArrow } from './hand-arrow'

/**
 * A handwritten note in the margin. On large screens it sits in the notes
 * column with an arrow pointing back at its paragraph. On small screens it
 * becomes a short inline aside, or disappears when it is only decoration.
 */
export function MarginNote({
  arrow = 'left',
  children,
  className,
  decorative = false,
  rotate = -2,
}: {
  arrow?: ArrowDirection | 'none'
  children: ReactNode
  className?: string
  decorative?: boolean
  rotate?: number
}) {
  const arrowAfter = arrow === 'down' || arrow === 'down-left'
  return (
    <aside
      aria-hidden={decorative || undefined}
      className={cn(
        decorative ? 'hidden lg:block' : 'mt-4 lg:mt-0',
        'relative',
        className
      )}
    >
      {/* small screens: a quiet inline aside */}
      {decorative ? null : (
        <p className='fn-hand flex gap-2 border-[var(--fn-pen-soft)] border-l-2 pl-3 text-[1.35rem] lg:hidden'>
          {children}
        </p>
      )}
      {/* large screens: in the margin, with an arrow */}
      <div
        className={cn(
          'hidden lg:flex',
          arrowAfter ? 'flex-col items-start' : 'items-start gap-1.5'
        )}
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        {arrow !== 'none' && !arrowAfter ? (
          <HandArrow className='mt-1' direction={arrow} />
        ) : null}
        <p className='fn-hand text-[1.45rem]'>{children}</p>
        {arrowAfter ? (
          <HandArrow className='mt-1 ml-6' direction={arrow} />
        ) : null}
      </div>
    </aside>
  )
}

/** A paragraph (or any block) with its margin note beside it. */
export function Annotated({
  children,
  className,
  note,
}: {
  children: ReactNode
  className?: string
  note?: ReactNode
}) {
  return (
    <div className={cn('fn-annotated', className)}>
      <div className='min-w-0'>{children}</div>
      {note}
    </div>
  )
}
