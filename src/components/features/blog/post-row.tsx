import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import { formatDate, formatMonthDay } from '@/lib/format-date'
import type { BlogPage } from '@/lib/source'
import { cn } from '@/lib/utils'
import { AuthorByline } from './author-byline'

/** What a row reads, so plain data shaped like a page works too */
type PostRowPost = Pick<BlogPage, 'url'> & {
  data: Pick<
    BlogPage['data'],
    'author' | 'date' | 'description' | 'tags' | 'title'
  >
}

interface PostRowProps {
  /** `short` drops the year ("Feb 25") for lists already grouped by year */
  date?: 'short' | 'full'
  /** Drops the author and #tags line, for short previews that only need the title and gist */
  meta?: boolean
  post: PostRowPost
}

/**
 * The mono `<time>` rail beside the text column is adapted from braydoncoyer.dev
 * by Braydon Coyer (no license, used with attribution):
 * https://github.com/braydoncoyer/braydoncoyer.dev/blob/v4/app/components/BlogPostList.tsx
 */
export const PostRow = ({ date = 'full', meta = true, post }: PostRowProps) => {
  const { author, date: published, description, tags, title } = post.data

  return (
    <Link
      className={cn(
        'group grid gap-x-6 gap-y-1.5 px-6 py-6 wide:py-8 transition-colors duration-150 hover:bg-card/80 focus-visible:bg-card/80',
        date === 'short'
          ? 'wide:grid-cols-[4.75rem_minmax(0,1fr)]'
          : 'wide:grid-cols-[7.5rem_minmax(0,1fr)]'
      )}
      href={post.url}
    >
      <time
        className='font-mono text-muted-foreground text-xs tabular-nums leading-6 wide:leading-7'
        dateTime={published.toISOString().slice(0, 10)}
      >
        {date === 'short' ? formatMonthDay(published) : formatDate(published)}
      </time>
      <div className='min-w-0'>
        <h3 className='flex items-center gap-2 text-pretty font-medium text-lg leading-7 tracking-tight transition-colors duration-150 group-hover:text-primary group-focus-visible:text-primary'>
          {title}
          <Icons.arrowRight
            aria-hidden
            className='size-4 shrink-0 -translate-x-1 opacity-0 transition-[opacity,translate] duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100'
          />
        </h3>
        {description && (
          <p className='mt-1 max-w-[70ch] text-pretty text-muted-foreground leading-relaxed'>
            {description}
          </p>
        )}
        {meta && (
          <p className='mt-2.5 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-muted-foreground text-sm'>
            {author && <AuthorByline author={author} />}
            {tags?.map((tag) => (
              <span key={tag}>
                <span aria-hidden className='opacity-60'>
                  #
                </span>
                {tag}
              </span>
            ))}
          </p>
        )}
      </div>
    </Link>
  )
}
