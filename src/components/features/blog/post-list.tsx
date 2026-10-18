import { staggerDelay, ViewAnimation } from '@/components/view-animation'
import type { BlogPage } from '@/lib/source'
import { cn } from '@/lib/utils'
import { PostRow } from './post-row'

interface PostListProps {
  className?: string
  posts: BlogPage[]
}

export const PostList = ({ className, posts }: PostListProps) => (
  <ul className={cn('dashed-stack text-left', className)}>
    {posts.map((post, index) => (
      <ViewAnimation as='li' delay={staggerDelay(index)} key={post.url}>
        <PostRow meta={false} post={post} />
      </ViewAnimation>
    ))}
  </ul>
)
