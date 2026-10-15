import Link from 'next/link'
import { ViewTransition } from 'react'
import { PanelButton } from '@/components/layout/panel'
import { Section } from '@/components/layout/sections'
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
    <ul className='divide-y divide-dashed divide-line'>
      {posts.slice(0, 5).map((post, index) => (
        <ViewAnimation
          delay={0.05 * index}
          initial={{ opacity: 0, translateY: -6 }}
          key={post.url}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <li>
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
          </li>
        </ViewAnimation>
      ))}
    </ul>
    <PanelButton href='/blog'>All posts</PanelButton>
  </Section>
)

export default Updates
