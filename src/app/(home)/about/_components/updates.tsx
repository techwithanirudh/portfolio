import Link from 'next/link'
import { ViewTransition } from 'react'
import { Section } from '@/components/layout/sections'
import { SectionButton } from '@/components/layout/sections/button'
import { SectionHeader } from '@/components/layout/sections/header'
import { ViewAnimation } from '@/components/view-animation'
import type { BlogPage } from '@/lib/source'

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

// Post list rows after chanhdai.com's blog list (MIT, (c) Chanh Dai)
const Updates = ({ posts }: { posts: BlogPage[] }) => (
  <Section className='relative w-full'>
    <SectionHeader title='Blog' />
    <ul className='divide-y divide-line'>
      {posts.slice(0, 5).map((post, index) => (
        <ViewAnimation as='li' delay={0.05 * index} key={post.url}>
          <Link
            className='group flex items-baseline gap-4 px-4 py-3 transition-colors hover:bg-card'
            data-sound-hover
            href={post.url}
          >
            <ViewTransition
              name={`blog/${post.slugs.join('/')}-title`}
              share='via-blur'
            >
              <span className='min-w-0 flex-1 text-balance font-medium text-sm transition-colors group-hover:text-primary'>
                {post.data.title}
              </span>
            </ViewTransition>
            <time
              className='shrink-0 font-mono text-muted-foreground text-xs tabular-nums'
              dateTime={new Date(post.data.date).toISOString()}
            >
              {formatDate(new Date(post.data.date))}
            </time>
          </Link>
        </ViewAnimation>
      ))}
    </ul>
    <SectionButton href='/blog'>All posts</SectionButton>
  </Section>
)

export default Updates
