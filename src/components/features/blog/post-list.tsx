import { ViewAnimation } from '@/components/view-animation'
import type { BlogPage } from '@/lib/source'
import { cn } from '@/lib/utils'
import { PostRow } from './post-row'

interface PostListProps {
  className?: string
  posts: BlogPage[]
}

/**
 * A flat run of ledger rows with the full date in the rail, for previews like
 * the home page's. Just title and gist there; the blog itself carries authors and tags
 */
export const PostList = ({ className, posts }: PostListProps) => (
  <ul className={cn('dashed-stack text-left', className)}>
    {posts.map((post, index) => (
      <ViewAnimation as='li' delay={0.05 * index} key={post.url}>
        <PostRow meta={false} post={post} />
      </ViewAnimation>
    ))}
  </ul>
)
