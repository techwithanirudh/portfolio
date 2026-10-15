'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { tagSwatch } from './color'
import { useWorkspace } from './workspace'

/**
 * Filter Work by stack tag. Lives in the Properties panel on wide screens and
 * inline above the grid everywhere else; both read the same state.
 */
export function StackFilter({
  className,
  layout = 'list',
}: {
  className?: string
  layout?: 'list' | 'chips'
}) {
  const { setStack, stack, stackTags } = useWorkspace()

  if (layout === 'chips') {
    return (
      <fieldset className={cn('flex flex-wrap gap-1.5', className)}>
        <legend className='sr-only'>Filter by stack</legend>
        <button
          aria-pressed={stack === null}
          className='ab-chip aria-pressed:bg-(--sel) aria-pressed:text-(--sel-ink)'
          onClick={() => setStack(null)}
          type='button'
        >
          All
        </button>
        {stackTags.slice(0, 12).map(({ count, tag }) => (
          <button
            aria-pressed={stack === tag}
            className='ab-chip aria-pressed:bg-(--sel) aria-pressed:text-(--sel-ink)'
            key={tag}
            onClick={() => setStack(stack === tag ? null : tag)}
            type='button'
          >
            {tag}
            <span className='opacity-60'>{count}</span>
          </button>
        ))}
      </fieldset>
    )
  }

  return (
    <ul aria-label='Filter by stack' className={cn('grid gap-px', className)}>
      {stackTags.map(({ count, tag }) => {
        const on = stack === tag
        return (
          <li key={tag}>
            <button
              aria-pressed={on}
              className={cn(
                'flex h-7 w-full items-center gap-2 rounded px-1.5 text-left text-[11px] hover:bg-(--hover)',
                on && 'bg-(--sel-fill) text-(--sel)'
              )}
              onClick={() => setStack(on ? null : tag)}
              type='button'
            >
              <span
                aria-hidden
                className='size-3.5 flex-none rounded-[3px] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.1)]'
                style={{ background: tagSwatch(tag) }}
              />
              <span className='min-w-0 flex-1 truncate'>{tag}</span>
              <span className='ab-mono text-(--faint)'>{count}</span>
              <Check
                aria-hidden
                className={cn('size-3', on ? 'opacity-100' : 'opacity-0')}
              />
            </button>
          </li>
        )
      })}
    </ul>
  )
}
