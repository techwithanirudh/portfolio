import { PostEmpty } from '@/components/features/blog/post-empty'
import { PostFilters } from '@/components/features/blog/post-filters'
import { PostLedger } from '@/components/features/blog/post-ledger'
import { Section } from '@/components/layout/sections'
import { NumberedPagination } from '@/components/numbered-pagination'
import { getPageHref } from '@/lib/pagination'
import type { BlogPage } from '@/lib/source'

interface PostIndexProps {
  activeTag?: string
  currentPage: number
  /** The listing's own path, which its page links hang off */
  path: string
  posts: BlogPage[]
  totalPages: number
}

export const PostIndex = ({
  activeTag,
  currentPage,
  path,
  posts,
  totalPages,
}: PostIndexProps) => (
  <Section className='dashed-stack' fill>
    <PostFilters activeTag={activeTag} />
    {posts.length > 0 ? (
      <PostLedger posts={posts} />
    ) : (
      <PostEmpty tag={activeTag} />
    )}
    <div className='flex min-h-10 flex-1 flex-col bg-dashed'>
      {totalPages > 1 && (
        <div className='p-2'>
          <NumberedPagination
            currentPage={currentPage}
            getHref={(page) => getPageHref(path, page)}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  </Section>
)
