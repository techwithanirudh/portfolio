import type { HTMLAttributes } from 'react'
import { PostList } from '@/components/features/blog/post-list'
import { Section } from '@/components/layout/sections'
import { SearchRedirectInput } from '@/components/search-redirect-input'
import { ViewAnimation } from '@/components/view-animation'
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
    <Section {...props} className={cn('dashed-stack flex flex-col', className)}>
      <ViewAnimation delay={0.1}>
        <SearchRedirectInput
          className='min-w-full'
          placeholder='Search posts...'
          tag='blog'
        />
      </ViewAnimation>
      <PostList posts={posts} />
    </Section>
  )
}
