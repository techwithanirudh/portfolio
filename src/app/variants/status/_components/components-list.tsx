'use client'

import { parseAsStringLiteral, useQueryState } from 'nuqs'
import { cn } from '@/lib/utils'
import type { ComponentItem, ProjectStatus } from '../_lib/timeline'
import { ComponentAxis, ComponentRow } from './component-row'

const FILTERS = ['all', 'operational', 'maintained', 'archived'] as const

const LABELS: Record<(typeof FILTERS)[number], string> = {
  all: 'All',
  archived: 'Archived',
  maintained: 'Maintained',
  operational: 'Operational',
}

const TONES: Record<ProjectStatus, string> = {
  archived: 'var(--archived)',
  maintained: 'var(--maintained)',
  operational: 'var(--ok)',
}

interface ComponentsListProps {
  axis: { offset: number; year: number }[]
  items: ComponentItem[]
}

/** Every project as a component, filterable by derived status (`?status=`). */
export function ComponentsList({ axis, items }: ComponentsListProps) {
  const [filter, setFilter] = useQueryState(
    'status',
    parseAsStringLiteral(FILTERS).withDefault('all')
  )
  const visible =
    filter === 'all' ? items : items.filter((i) => i.status === filter)
  const groups = [
    { items: visible.filter((i) => i.pinned), name: 'Pinned' },
    { items: visible.filter((i) => !i.pinned), name: 'Everything else' },
  ].filter((g) => g.items.length > 0)

  return (
    <div className='flex flex-col gap-4'>
      <div
        aria-label='Filter by status'
        className='-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0'
        role='toolbar'
      >
        {FILTERS.map((f) => {
          const count =
            f === 'all'
              ? items.length
              : items.filter((i) => i.status === f).length
          const active = filter === f
          return (
            <button
              aria-pressed={active}
              className={cn(
                'inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-[13px] transition-colors',
                active
                  ? 'bg-[var(--panel)] font-medium text-[var(--text)] shadow-[var(--feature-card)]'
                  : 'text-[var(--muted)] hover:bg-[var(--panel-raised)] hover:text-[var(--text)]'
              )}
              key={f}
              onClick={() => setFilter(f === 'all' ? null : f)}
              type='button'
            >
              {f === 'all' ? null : (
                <span
                  aria-hidden
                  className='vs-dot size-1.5!'
                  style={{ '--dot': TONES[f] } as React.CSSProperties}
                />
              )}
              {LABELS[f]}
              <span className='vs-num text-[11px] text-[var(--muted)]'>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {groups.map((group) => (
        <section
          aria-label={group.name}
          className='vs-card overflow-hidden'
          key={group.name}
        >
          <div className='flex items-center justify-between border-[var(--line)] border-b bg-[var(--panel-raised)] px-4 py-2 sm:px-5'>
            <p className='font-medium text-[13px]'>{group.name}</p>
            <p className='vs-num text-[11px] text-[var(--muted)]'>
              {group.items.length}
            </p>
          </div>
          <ComponentAxis axis={axis} />
          <ul className='divide-y divide-[var(--line)]'>
            {group.items.map((item) => (
              <ComponentRow item={item} key={item.slug} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
