import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import type { getWriting } from '../../_shared/profile'
import { formatDay } from './data'

type Post = ReturnType<typeof getWriting>[number]

/** Posts as dated rows, like a drawing's list of reference documents. */
export function WritingList({ posts }: { posts: Post[] }) {
  return (
    <ol>
      {posts.map((post, i) => (
        <li
          className='ds-row-rule border-(--line) border-b last:border-b-0'
          key={post.url}
        >
          <Link
            className='group grid grid-cols-[6.5rem_minmax(0,1fr)] items-baseline gap-x-4 px-4 py-4 transition-colors hover:bg-(--hover) md:grid-cols-[3.5rem_7.5rem_minmax(0,1fr)_minmax(0,1fr)_1.5rem] md:px-6'
            href={post.url}
          >
            <span className='ds-label hidden md:block'>
              Ref {String(i + 1).padStart(2, '0')}
            </span>
            <time
              className='font-mono text-(--ink-muted) text-[13px] tabular-nums'
              dateTime={post.date.toISOString()}
            >
              {formatDay(post.date)}
            </time>
            <span className='font-medium text-[16px] leading-snug group-hover:text-(--accent)'>
              {post.title}
            </span>
            <span className='text-(--ink-muted) text-sm max-md:col-start-2 max-md:mt-1'>
              {post.description}
            </span>
            <ArrowRightIcon
              aria-hidden
              className='hidden size-4 self-center text-(--ink-faint) transition-transform group-hover:translate-x-0.5 group-hover:text-(--ink) md:block'
            />
          </Link>
        </li>
      ))}
    </ol>
  )
}
