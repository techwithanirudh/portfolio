import { StaticPortraitChip } from '@/components/portrait/static-portrait-chip'
import { owner } from '@/constants/site'
import { cn } from '@/lib/utils'

const coAuthorSeparator = /\s*(?:&|,|\band\b)\s*/

export const AuthorByline = ({
  author,
  className,
}: {
  author: string
  className?: string
}) => {
  const byOwner = author
    .split(coAuthorSeparator)
    .includes(owner.split(' ')[0] ?? owner)

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      {byOwner && <StaticPortraitChip className='size-[1.15em]' />}
      {author}
    </span>
  )
}
