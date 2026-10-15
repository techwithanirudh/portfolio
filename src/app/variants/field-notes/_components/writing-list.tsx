import { format } from 'date-fns'
import Link from 'next/link'
import type { getWriting } from '../../_shared/profile'

type Post = ReturnType<typeof getWriting>[number]

/** Posts as a notebook's contents page: title, dot leader, date. */
export function WritingList({ posts }: { posts: Post[] }) {
  return (
    <ol className='border-[var(--fn-rule)] border-y'>
      {posts.map((post) => (
        <li
          className='border-[var(--fn-rule)] border-t border-dashed first:border-t-0'
          key={post.url}
        >
          <Link className='group block rounded-sm py-4' href={post.url}>
            <span className='flex items-baseline gap-3'>
              <span className='fn-serif text-[1.35rem] leading-snug transition-colors group-hover:text-[var(--fn-pen)] sm:text-[1.5rem]'>
                {post.title}
              </span>
              <span
                aria-hidden
                className='min-w-6 flex-1 -translate-y-[0.3em] border-[var(--fn-rule)] border-b-2 border-dotted'
              />
              <time
                className='fn-label shrink-0 tabular-nums'
                dateTime={post.date.toISOString()}
              >
                {format(post.date, 'd MMM yyyy')}
              </time>
            </span>
            <span className='fn-measure mt-0.5 block text-[15px] text-[var(--fn-muted)]'>
              {post.description}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  )
}
