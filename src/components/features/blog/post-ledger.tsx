import { ViewAnimation } from '@/components/view-animation'
import type { BlogPage } from '@/lib/source'
import { PostRow } from './post-row'

// Posts arrive newest first, so years come out in order and keep their posts' order
const groupByYear = (posts: BlogPage[]) => {
  const years = new Map<number, BlogPage[]>()
  for (const post of posts) {
    const year = post.data.date.getUTCFullYear()
    const group = years.get(year)
    if (group) {
      group.push(post)
    } else {
      years.set(year, [post])
    }
  }
  return [...years]
}

/**
 * Posts grouped by year: the year sits in a left column and sticks while its
 * rows scroll past, and below `md` it becomes a strip above them. Each year is
 * only as tall as its rows, so a short list stays compact.
 */
export const PostLedger = ({ posts }: { posts: BlogPage[] }) => {
  let index = 0

  return (
    <div className='dashed-stack'>
      {groupByYear(posts).map(([year, yearPosts]) => (
        <section
          aria-labelledby={`year-${year}`}
          className='grid md:grid-cols-[10rem_minmax(0,1fr)]'
          key={year}
        >
          <div className='border-border border-b border-dashed px-6 py-3 md:border-r md:border-b-0 md:py-6'>
            <h2
              className='font-mono text-muted-foreground/70 text-xl tabular-nums tracking-tight md:sticky md:top-20 md:text-2xl'
              id={`year-${year}`}
            >
              {year}
            </h2>
          </div>
          <ul className='dashed-stack'>
            {yearPosts.map((post) => (
              <ViewAnimation as='li' delay={0.05 * index++} key={post.url}>
                <PostRow date='short' post={post} />
              </ViewAnimation>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
