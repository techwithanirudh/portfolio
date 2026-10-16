import { ViewAnimation } from '@/components/view-animation'
import { formatDate } from '@/lib/format-date'
import type { BlogPage } from '@/lib/source'
import { cn } from '@/lib/utils'
import { PostCard } from './post-card'

interface PostListProps {
  className?: string
  posts: BlogPage[]
}

export const PostList = ({ className, posts }: PostListProps) => (
  <div className={cn('dashed-stack grid text-left', className)}>
    {posts.map((post, index) => (
      <ViewAnimation delay={0.05 * index} key={post.url}>
        <PostCard
          author={post.data.author}
          date={formatDate(post.data.date)}
          description={post.data.description ?? ''}
          title={post.data.title}
          url={post.url}
        />
      </ViewAnimation>
    ))}
  </div>
)
