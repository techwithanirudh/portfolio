import { ViewAnimation } from '@/components/view-animation'
import type { BlogPage } from '@/lib/source'
import { PostRow } from './post-row'

// Posts arrive newest first, so years come out in order and keep their posts' order.
// Each group also carries its first row's position, so the stagger runs on
// across years
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
  let start = 0
  return [...years].map(([year, yearPosts]) => {
    const group = { start, year, yearPosts }
    start += yearPosts.length
    return group
  })
}

/**
 * Posts grouped by year: the year sits in a left column and sticks while its
 * rows scroll past, and below `md` it becomes a strip above them. Each year is
 * only as tall as its rows, so a short list stays compact.
 */
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
              className='font-mono text-muted-foreground/70 text-xl tabular-nums tracking-tight md:sticky md:top-20 md:text-2xl'
              id={`year-${year}`}
            >
              {year}
            </h2>
          </div>
          <ul className='dashed-stack'>
            {yearPosts.map((post, i) => (
              <ViewAnimation as='li' delay={0.05 * (start + i)} key={post.url}>
                <PostRow date='short' post={post} />
              </ViewAnimation>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
