import { cn } from '@/lib/utils'
import type { Finish } from './data'

/**
 * One drafting symbol per finish, so the BOM can be scanned by shape as well
 * as by word: filled dot, ring, diamond, triangle, struck circle.
 */
export function FinishSymbol({
  className,
  finish,
}: {
  className?: string
  finish: Finish
}) {
  return (
    <svg
      aria-hidden
      className={cn('size-2.5 shrink-0', className)}
      fill='none'
      stroke='currentColor'
      strokeWidth='1.2'
      viewBox='0 0 10 10'
    >
      {finish === 'Shipped' && (
        <circle cx='5' cy='5' fill='currentColor' r='4' />
      )}
      {finish === 'Source' && <circle cx='5' cy='5' r='3.8' />}
      {finish === 'Template' && <path d='M5 .9 9.1 5 5 9.1.9 5z' />}
      {finish === 'Research' && <path d='M5 1 9.2 8.8H.8z' />}
      {finish === 'Archived' && (
        <>
          <circle cx='5' cy='5' r='3.8' />
          <path d='m2.3 7.7 5.4-5.4' />
        </>
      )}
    </svg>
  )
}

export function FinishLabel({ finish }: { finish: Finish }) {
  return (
    <span
      className={cn(
        'ds-label inline-flex items-center gap-1.5 whitespace-nowrap',
        finish === 'Shipped' && 'text-(--accent)',
        finish === 'Archived' && 'text-(--ink-faint)'
      )}
    >
      <FinishSymbol finish={finish} />
      {finish}
    </span>
  )
}
