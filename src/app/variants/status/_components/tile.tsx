// Adapted from nelsonlai.dev/src/components/home/about-me.tsx and its cards
// (connect.tsx, coding-hours.tsx) (MIT, © 2025 Nelson Lai). See ../NOTICES.md
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Nelson's borderless bento card (`rounded-2xl p-4 lg:p-6
 * shadow-feature-card`), with spans snapped to the 12-column grid.
 */
const spans = {
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  6: 'lg:col-span-6',
  8: 'lg:col-span-8',
  12: 'lg:col-span-12',
} as const

const mdSpans = {
  3: 'md:col-span-3',
  6: 'md:col-span-6',
} as const

interface TileProps {
  children: ReactNode
  className?: string
  /** Span on the 6-column tablet grid. */
  md?: keyof typeof mdSpans
  /** Span on the 12-column desktop grid. */
  span: keyof typeof spans
}

export function Tile({ children, className, md = 6, span }: TileProps) {
  return (
    <section
      className={cn(
        'vs-card relative flex min-w-0 flex-col gap-5 overflow-hidden p-4 lg:p-5',
        mdSpans[md],
        spans[span],
        className
      )}
    >
      {children}
    </section>
  )
}

interface TileHeaderProps {
  aside?: ReactNode
  icon: LucideIcon
  title: string
}

export function TileHeader({ aside, icon: Icon, title }: TileHeaderProps) {
  return (
    <header className='flex items-center justify-between gap-3'>
      <div className='flex min-w-0 items-center gap-2'>
        <Icon
          aria-hidden
          className='size-4 shrink-0 text-[var(--muted)]'
          strokeWidth={1.75}
        />
        <h3 className='truncate font-medium text-[13px] text-[var(--muted)]'>
          {title}
        </h3>
      </div>
      {aside}
    </header>
  )
}
