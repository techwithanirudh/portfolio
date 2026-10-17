import { PortraitChip } from '@/app/(home)/_components/portrait'
import { owner } from '@/constants/site'
import { cn } from '@/lib/utils'

const ownerFirstName = owner.split(' ')[0] ?? owner
const coAuthorSeparator = /\s*(?:&|,|\band\b)\s*/

/**
 * A post's author line with my face chip in front when I wrote it, alone or
 * with co-authors ("Anirudh & Devarsh"). Names stay plain text.
 */
export const AuthorByline = ({
  author,
  className,
}: {
  author: string
  className?: string
}) => {
  const byOwner = author.split(coAuthorSeparator).includes(ownerFirstName)

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      {byOwner && (
        <PortraitChip className='m-0 size-[1.15em] translate-y-0' still />
      )}
      {author}
    </span>
  )
}
