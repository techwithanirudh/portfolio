// TODO(slopradar): layering: imports PortraitChip from app/(home)/_components, move it into src/components so features never depend on a route folder
import { PortraitChip } from '@/app/(home)/_components/portrait'
import { owner } from '@/constants/site'
import { cn } from '@/lib/utils'

// TODO(slopradar): duplication: the same first-name split is features/assistant/owner-name.ts (which only lowercases it), export the first name once from constants/site and derive both
const ownerFirstName = owner.split(' ')[0] ?? owner
const coAuthorSeparator = /\s*(?:&|,|\band\b)\s*/

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
