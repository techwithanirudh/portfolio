import { cn } from '@/lib/utils'
import { careerKinds } from '../_lib/timeline'

export function KindLegend({ className }: { className?: string }) {
  return (
    <ul
      aria-label='Legend'
      className={cn('flex flex-wrap gap-x-4 gap-y-1.5', className)}
    >
      {careerKinds.map((k) => (
        <li
          className='inline-flex items-center gap-1.5 text-[12px] text-[var(--muted)]'
          key={k.kind}
        >
          <span
            aria-hidden
            className='size-2.5 rounded-[3px]'
            style={{ background: k.tone }}
          />
          {k.label}
        </li>
      ))}
    </ul>
  )
}
