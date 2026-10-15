import Link from 'next/link'
import { Icons } from '@/components/icons/icons'

const MAX_TAGS = 8

interface TagsRowProps {
  tags: Array<{ name: string; count: number }>
}

// One scrollable line of tag chips, it fits the single column on every width
export function TagsRow({ tags }: TagsRowProps) {
  return (
    <div className='no-scrollbar flex items-center gap-1.5 overflow-x-auto px-4 py-2'>
      <Icons.tag className='mr-1 size-3.5 shrink-0 text-muted-foreground' />
      {tags.slice(0, MAX_TAGS).map((tag) => (
        <Link
          className='inline-flex shrink-0 items-center gap-1 border border-line px-2 py-0.5 font-mono text-muted-foreground text-xs transition-colors hover:border-primary/40 hover:text-foreground'
          href={`/blog/tags/${tag.name}`}
          key={tag.name}
        >
          {tag.name}
          <span className='text-muted-foreground'>{tag.count}</span>
        </Link>
      ))}
      <Link
        className='group ml-auto inline-flex shrink-0 items-center gap-1 font-mono text-muted-foreground text-xs transition-colors hover:text-foreground'
        href='/blog/tags'
      >
        All tags
        <Icons.arrowRight className='icon-arrow size-3' />
      </Link>
    </div>
  )
}
