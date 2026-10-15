'use client'

import { type ReactNode, useEffect } from 'react'
import { StackFilter } from './stack-filter'
import { useWorkspace } from './workspace'

/** Publishes the tag list to the Properties panel's filter. */
export function RegisterStackTags({
  tags,
}: {
  tags: { count: number; tag: string }[]
}) {
  const { setStackTags } = useWorkspace()
  useEffect(() => {
    setStackTags(tags)
    return () => setStackTags([])
  }, [setStackTags, tags])
  return null
}

/** Hides a project card that doesn't use the selected stack tag. */
export function FilterItem({
  children,
  tags,
}: {
  children: ReactNode
  tags: readonly string[]
}) {
  const { stack } = useWorkspace()
  return <li hidden={stack !== null && !tags.includes(stack)}>{children}</li>
}

export function FilterSummary({
  counts,
  total,
}: {
  counts: Record<string, number>
  total: number
}) {
  const { setStack, stack } = useWorkspace()
  return (
    <p aria-live='polite' className='ab-t-label text-(--muted)'>
      {stack ? (
        <>
          {counts[stack] ?? 0} of {total} use{' '}
          <span className='text-(--sel)'>{stack}</span> ·{' '}
          <button
            className='underline underline-offset-2 hover:text-(--ink)'
            onClick={() => setStack(null)}
            type='button'
          >
            clear
          </button>
        </>
      ) : (
        <>Showing all {total}. Filter by stack to narrow it down.</>
      )}
    </p>
  )
}

export function InlineStackFilter() {
  return <StackFilter className='xl:hidden' layout='chips' />
}
