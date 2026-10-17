import Link from 'next/link'
import { SearchRedirectInput } from '@/components/search-redirect-input'
import { pages } from '@/constants/pages'
import { getPostsByTag, getTags } from '@/lib/source'
import { cn } from '@/lib/utils'

// Busiest tags first, so the filters people reach for most sit at the front
const getFilterTags = () =>
  getTags()
    .map((tag) => ({ count: getPostsByTag(tag).length, tag }))
    .toSorted((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
    .map(({ tag }) => tag)

const FilterLink = ({
  active,
  children,
  href,
}: {
  active: boolean
  children: string
  href: string
}) => (
  <Link
    aria-current={active ? 'page' : undefined}
    className={cn(
      'py-0.5 underline-offset-[5px] transition-colors hover:text-foreground',
      active
        ? 'text-foreground underline decoration-primary/70'
        : 'text-muted-foreground'
    )}
    href={href}
  >
    {children}
  </Link>
)

/**
 * The list header over the blog ledger: "Everything" plus each tag as inline
 * text filters, with search on the right. Each filter is a real link to its
 * tag page; the "all plus each category" links with `aria-current` are adapted
 * from braydoncoyer.dev by Braydon Coyer (no license, used with attribution):
 * https://github.com/braydoncoyer/braydoncoyer.dev/blob/v4/app/components/CategorySelect.tsx
 */
export const PostFilters = ({ activeTag }: { activeTag?: string }) => (
  <div className='flex flex-col gap-1 py-2 md:flex-row md:items-center md:justify-between md:gap-6 md:py-1.5'>
    <nav
      aria-label='Filter posts by tag'
      className='flex flex-wrap gap-x-4.5 gap-y-1 px-6 pt-1.5 text-sm md:pt-0'
    >
      <FilterLink active={!activeTag} href={pages.blog.path}>
        Everything
      </FilterLink>
      {getFilterTags().map((tag) => (
        <FilterLink
          active={tag === activeTag}
          href={`/blog/tags/${tag}`}
          key={tag}
        >
          {tag}
        </FilterLink>
      ))}
    </nav>
    <SearchRedirectInput
      className='w-full shrink-0 px-3 md:w-56'
      placeholder='Search posts'
      tag='blog'
    />
  </div>
)
