import { format } from 'date-fns'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { getWriting } from '../../_shared/profile'

export function WritingList({ limit = 5 }: { limit?: number }) {
  const posts = getWriting().slice(0, limit)
  return (
    <ul className='vs-card divide-y divide-[var(--line)] overflow-hidden'>
      {posts.map((post) => (
        <li key={post.url}>
          <Link
            className='group grid gap-x-6 gap-y-1 px-4 py-4 transition-colors hover:bg-[color-mix(in_srgb,var(--panel-raised)_55%,transparent)] sm:grid-cols-[7.5rem_1fr_auto] sm:px-5'
            href={post.url}
          >
            <time
              className='vs-num pt-px text-[12px] text-[var(--muted)]'
              dateTime={post.date.toISOString()}
            >
              {format(post.date, 'd MMM yyyy')}
            </time>
            <span className='min-w-0'>
              <span className='block font-medium text-[15px] underline-offset-4 group-hover:underline'>
                {post.title}
              </span>
              <span className='mt-0.5 line-clamp-2 block text-[13px] text-[var(--muted)]'>
                {post.description}
              </span>
            </span>
            <ArrowUpRight
              aria-hidden
              className='hidden size-4 text-[var(--muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:block'
            />
          </Link>
        </li>
      ))}
    </ul>
  )
}
