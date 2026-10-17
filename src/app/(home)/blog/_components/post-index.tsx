import { PostEmpty } from '@/components/features/blog/post-empty'
import { PostFilters } from '@/components/features/blog/post-filters'
import { PostLedger } from '@/components/features/blog/post-ledger'
import { SectionBody } from '@/components/layout/sections/body'
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

/**
 * The blog listing shared by /blog and each tag page: tag filters and search,
 * the year ledger (or bashful Simba when nothing matches), then a hatched band that holds the pagination. The band
 * takes whatever height the screen has left, so a short list ends in the
 * hatch rather than in empty rows.
 */
export const PostIndex = ({
  activeTag,
  currentPage,
  path,
  posts,
  totalPages,
}: PostIndexProps) => (
  <SectionBody className='dashed-stack'>
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
  </SectionBody>
)
