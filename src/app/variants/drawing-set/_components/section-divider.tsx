import { cn } from '@/lib/utils'
import { pad } from './data'

/**
 * A hatched band between sections (chanhdai.com's `stripe-divider`) carrying
 * the section number, the way a drawing marks its section cuts.
 */
export function SectionDivider({
  className,
  label,
  n,
}: {
  className?: string
  label?: string
  n: number
}) {
  return (
    <div
      aria-hidden
      className={cn(
        'stripe-divider flex h-10 items-center px-4 md:px-6',
        className
      )}
    >
      <span className='ds-label flex items-center gap-2 border border-(--line) bg-(--sheet) px-1.5 py-0.5 text-(--ink)'>
        § {pad(n)}
        {label && <span className='text-(--ink-muted)'>{label}</span>}
      </span>
    </div>
  )
}
