'use client'

import { AnimatePresence, motion } from 'motion/react'
import { parseAsString, useQueryState } from 'nuqs'
import { useSyncExternalStore } from 'react'
import { cn } from '@/lib/utils'
import { IndexCard, type WorkItem } from './index-card'
import { tilt } from './notes'

const query = '(min-width: 640px)'

function useTwoColumns() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => true
  )
}

/**
 * The wall of index cards with a row of stack tags to filter by. Cards are
 * dealt into two columns in reading order (pinned first), so the wall looks
 * hand-pinned without CSS columns scrambling the order.
 */
export function WorkWall({
  items,
  tags,
}: {
  items: WorkItem[]
  tags: { count: number; key: string; name: string }[]
}) {
  const [tag, setTag] = useQueryState(
    'tag',
    parseAsString.withDefault('').withOptions({ scroll: false })
  )
  const two = useTwoColumns()
  const visible = tag
    ? items.filter((i) => i.tags.some((t) => t.toLowerCase() === tag))
    : items
  const tagName = tags.find((t) => t.key === tag)?.name ?? tag
  const columns = two
    ? [
        visible.filter((_, i) => i % 2 === 0),
        visible.filter((_, i) => i % 2 === 1),
      ]
    : [visible]

  const chip = (key: string, name: string, count: number, index: number) => {
    const active = key === tag
    return (
      <li key={key || 'all'}>
        <button
          aria-pressed={active}
          className={cn(
            'rounded-[3px] border px-2 py-1 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors',
            active
              ? 'border-[var(--fn-pen)] bg-[var(--fn-pen)] text-[var(--fn-card)]'
              : 'border-[var(--fn-rule)] text-[var(--fn-muted)] hover:border-[var(--fn-pen-soft)] hover:text-[var(--fn-pen)]'
          )}
          onClick={() => setTag(key || null)}
          style={{ transform: `rotate(${tilt(index, 0.3)}deg)` }}
          type='button'
        >
          {name} <span className='opacity-60'>{count}</span>
        </button>
      </li>
    )
  }

  return (
    <div>
      <div className='max-w-[860px]'>
        <p className='fn-hand mb-3 text-[1.35rem]'>
          filter by what it’s made with
        </p>
        <ul aria-label='Filter by stack' className='flex flex-wrap gap-2'>
          {chip('', 'All', items.length, 0)}
          {tags.map((t, i) => chip(t.key, t.name, t.count, i + 1))}
        </ul>
        <p aria-live='polite' className='fn-label mt-5'>
          {tag
            ? `${visible.length} of ${items.length} cards use ${tagName}`
            : `${items.length} cards, pinned first`}
        </p>
      </div>
      <div className='mt-10 flex max-w-[940px] gap-6 sm:gap-8'>
        {columns.map((column, c) => (
          <div
            className={cn(
              'flex min-w-0 flex-1 flex-col gap-6 sm:gap-8',
              c === 1 && 'sm:pt-14'
            )}
            // biome-ignore lint/suspicious/noArrayIndexKey: columns are positional
            key={c}
          >
            <AnimatePresence initial={false} mode='popLayout'>
              {column.map((item) => {
                const index = items.indexOf(item)
                return (
                  <motion.div
                    animate={{ opacity: 1, rotate: 0, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    initial={{ opacity: 0, rotate: 2, y: 8 }}
                    key={item.slug}
                    layout
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <IndexCard index={index} item={item} showImage />
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className='fn-hand mt-10 text-[1.5rem]'>
          nothing on the wall with that tag yet
        </p>
      ) : null}
    </div>
  )
}
