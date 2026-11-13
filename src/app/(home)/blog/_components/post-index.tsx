import { PostEmpty } from '@/components/features/blog/post-empty'
import { PostFilters } from '@/components/features/blog/post-filters'
import { PostLedger } from '@/components/features/blog/post-ledger'
import { Section } from '@/components/layout/sections'
import type { BlogPage } from '@/lib/source'

interface PostIndexProps {
  activeTag?: string
  posts: BlogPage[]
}

export const PostIndex = ({ activeTag, posts }: PostIndexProps) => (
  <Section className='dashed-stack' fill>
    <PostFilters activeTag={activeTag} />
    {posts.length > 0 ? (
      <PostLedger posts={posts} />
    ) : (
      <PostEmpty tag={activeTag} />
    )}
    <div className='min-h-10 flex-1 bg-dashed' />
  </Section>
)
