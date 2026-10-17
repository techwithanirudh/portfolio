import Image from 'next/image'
import type { GuestbookEntryItem } from '@/lib/validators/guestbook'
import { GuestbookReactions } from '../reactions'

export const EntryFooter = ({
  canReact,
  entry,
}: {
  canReact: boolean
  entry: GuestbookEntryItem
}) => (
  <div className='flex w-full flex-wrap items-end justify-between gap-4 empty:hidden'>
    <GuestbookReactions
      canReact={canReact}
      entryId={entry.id}
      reactions={entry.reactions}
    />
    {entry.signature ? (
      <div className='h-[63px] w-[140px] rounded border border-border border-dashed bg-card'>
        <Image
          alt={`Signature by ${entry.name}`}
          className='h-[63px] w-[140px] object-contain dark:invert'
          height={63}
          src={entry.signature}
          unoptimized
          width={140}
        />
      </div>
    ) : null}
  </div>
)
