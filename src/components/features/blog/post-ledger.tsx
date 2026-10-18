import { ViewAnimation } from '@/components/view-animation'
import type { BlogPage } from '@/lib/source'
import { staggerDelay } from '@/lib/stagger'
import { PostRow } from './post-row'

// Posts arrive newest first, so years come out in order and keep their posts' order.
const groupByYear = (posts: BlogPage[]) => {
  const years = Map.groupBy(posts, (post) => post.data.date.getUTCFullYear())
  let start = 0
  return [...years].map(([year, yearPosts]) => {
    const group = { start, year, yearPosts }
    start += yearPosts.length
    return group
  })
}

export const PostLedger = ({ posts }: { posts: BlogPage[] }) => {
  return (
    <div className='dashed-stack'>
      {groupByYear(posts).map(({ start, year, yearPosts }) => (
        <section
          aria-labelledby={`year-${year}`}
          className='grid md:grid-cols-[10rem_minmax(0,1fr)]'
          key={year}
        >
          {/* The year is bigger type than the row titles, so on the same top
              padding its baseline lands 10px low. 22px puts it on the first
              title's baseline, so it moves with the rows' sm:py-8 */}
          <div className='border-border border-b border-dashed px-6 py-3 md:border-r md:border-b-0 md:pt-5.5 md:pb-8'>
            <h2
              className='font-mono text-muted-foreground text-xl tabular-nums tracking-tight md:sticky md:top-20 md:text-2xl'
              id={`year-${year}`}
            >
              {year}
            </h2>
          </div>
          <ul className='dashed-stack'>
            {yearPosts.map((post, i) => (
              <ViewAnimation
                as='li'
                delay={staggerDelay(start + i)}
                key={post.url}
              >
                <PostRow date='short' post={post} />
              </ViewAnimation>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
