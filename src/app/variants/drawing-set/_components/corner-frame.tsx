import type React from 'react'
import { cn } from '@/lib/utils'

const corners = ['tl', 'tr', 'bl', 'br'] as const

/** Wraps a box in crop-mark corner ticks, drawn just outside its edges. */
export function CornerFrame({
  children,
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div className={cn('ds-ticks', className)} {...props}>
      {children}
      {corners.map((corner) => (
        <span
          aria-hidden
          className='ds-tick'
          data-corner={corner}
          key={corner}
        />
      ))}
    </div>
  )
}

/** Labelled hatched box for a photo Anirudh still needs to supply. */
export function Placeholder({
  className,
  label,
  ...props
}: React.ComponentProps<'div'> & { label: string }) {
  return (
    <div
      aria-label={`Placeholder: ${label}`}
      className={cn(
        'ds-placeholder flex items-center justify-center border border-(--line) border-dashed p-3 text-center',
        className
      )}
      role='img'
      {...props}
    >
      <span className='ds-label bg-(--sheet) px-1.5 py-0.5 normal-case tracking-normal'>
        {label}
      </span>
    </div>
  )
}
