import Link from 'next/link'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import { SectionMoreLink } from '@/components/layout/sections/more-link'
import { ViewAnimation } from '@/components/view-animation'
import type { BlogPage } from '@/lib/source'

const dateFormat = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export default function Writing({ posts }: { posts: BlogPage[] }) {
  return (
    <Section className='relative w-full pt-10'>
      <div className='flex flex-col gap-10'>
        <SectionHeader
          align='left'
          className='px-6'
          description='Notes on things I build and learn.'
          title='Writing'
        />

        <div>
          <ul className='divide-y divide-dashed divide-border border-border border-t border-dashed'>
            {posts.map((post, index) => (
              <ViewAnimation delay={0.05 * index} key={post.url}>
                <li>
                  <Link
                    className='group flex flex-col gap-3 px-6 py-6 transition-colors hover:bg-card/80'
                    href={post.url}
                  >
                    <div className='flex items-baseline justify-between gap-6'>
                      <h3 className='text-balance font-medium text-lg tracking-tight transition-colors group-hover:text-primary md:text-xl'>
                        {post.data.title}
                      </h3>
                      <time
                        className='shrink-0 font-mono text-muted-foreground text-xs tabular-nums'
                        dateTime={new Date(post.data.date).toISOString()}
                      >
                        {dateFormat.format(new Date(post.data.date))}
                      </time>
                    </div>
                    {post.data.description && (
                      <p className='line-clamp-2 max-w-2xl text-pretty text-muted-foreground leading-relaxed'>
                        {post.data.description}
                      </p>
                    )}
                    {post.data.tags && post.data.tags.length > 0 && (
                      <ul className='flex flex-wrap gap-1.5'>
                        {post.data.tags.map((tag) => (
                          <li
                            className='rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-[0.7rem] text-muted-foreground'
                            key={tag}
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Link>
                </li>
              </ViewAnimation>
            ))}
          </ul>
          <SectionMoreLink delay={0.05 * posts.length} href='/blog'>
            View all posts
          </SectionMoreLink>
        </div>
      </div>
    </Section>
  )
}
