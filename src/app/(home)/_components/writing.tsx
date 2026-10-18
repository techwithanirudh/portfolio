import { PostList } from '@/components/features/blog/post-list'
import { ListSection } from '@/components/layout/sections/list-section'
import { pages } from '@/constants/pages'
import type { BlogPage } from '@/lib/source'

export default function Writing({ posts }: { posts: BlogPage[] }) {
  return (
    <ListSection
      description='Notes on things I build and learn.'
      more={{
        delay: 0.05 * posts.length,
        href: pages.blog.path,
        label: 'View all posts',
      }}
      title='Writing'
    >
      <PostList
        className='border-border border-t border-dashed'
        posts={posts}
      />
    </ListSection>
  )
}
