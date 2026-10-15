import { Archive, Check, Moon, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'

const pills = {
  archived: { icon: Archive, label: 'Archived', tone: 'var(--archived)' },
  completed: { icon: Check, label: 'Completed', tone: 'var(--muted)' },
  current: { icon: null, label: 'Current', tone: 'var(--ok)' },
  idle: { icon: Moon, label: 'Idle', tone: 'var(--warn)' },
  maintained: { icon: Wrench, label: 'Maintained', tone: 'var(--maint)' },
  operational: { icon: null, label: 'Operational', tone: 'var(--ok)' },
} as const

export type PillKind = keyof typeof pills

interface StatusPillProps {
  className?: string
  kind: PillKind
  label?: string
}

/** A status label that never relies on colour alone: icon or dot plus text. */
export function StatusPill({ className, kind, label }: StatusPillProps) {
  const { icon: Icon, label: fallback, tone } = pills[kind]
  return (
    <span
      className={cn(
        'inline-flex h-6 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 font-medium text-[12px] leading-none',
        className
      )}
      style={{
        background: `color-mix(in srgb, ${tone} 13%, transparent)`,
        color: `color-mix(in srgb, ${tone} 82%, var(--text))`,
      }}
    >
      {Icon ? (
        <Icon aria-hidden className='size-3' strokeWidth={2.25} />
      ) : (
        <span
          aria-hidden
          className='vs-dot size-1.5!'
          style={{ '--dot': tone } as React.CSSProperties}
        />
      )}
      {label ?? fallback}
    </span>
  )
}
