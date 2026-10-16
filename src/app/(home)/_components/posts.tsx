import type { HTMLAttributes } from 'react'
import { PostCard } from '@/components/features/blog'
import { Section } from '@/components/layout/sections'
import { SearchRedirectInput } from '@/components/search-redirect-input'
import { ViewAnimation } from '@/components/view-animation'
import { formatDate } from '@/lib/format-date'
import type { BlogPage } from '@/lib/source'
import { cn } from '@/lib/utils'

export default function Posts({
  posts,
  className,
  ...props
}: { posts: BlogPage[] } & {
  sectionClassName?: string
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <Section
      {...props}
      className={cn(
        'flex flex-col divide-y divide-dashed divide-border',
        className
      )}
    >
      <ViewAnimation delay={0.1}>
        <SearchRedirectInput
          className='min-w-full'
          placeholder='Search posts...'
          tag='blog'
        />
      </ViewAnimation>
      <div className='grid divide-y divide-dashed divide-border text-left'>
        {posts.map((post, index) => {
          const date = formatDate(post.data.date)
          return (
            <ViewAnimation delay={0.05 * index} key={post.url}>
              <PostCard
                author={post.data.author}
                date={date}
                description={post.data.description ?? ''}
                title={post.data.title}
                url={post.url}
              />
            </ViewAnimation>
          )
        })}
      </div>
    </Section>
  )
}
