'use client'

import { Icons } from '@/components/icons/icons'
import { GuestbookEntryCard } from './guestbook-entry-card'
import type { GuestbookEntryItem } from './guestbook-types'

interface GuestbookEntriesProps {
  currentUserId: string | null
  entries: GuestbookEntryItem[]
  isSignedIn: boolean
}

export const GuestbookEntries = ({
  currentUserId,
  entries,
  isSignedIn,
}: GuestbookEntriesProps) => {
  if (entries.length === 0) {
    return (
      <div className='max-h-[32rem] w-full overflow-y-auto'>
        <div className='flex flex-col items-center gap-2 px-6 py-10 text-center'>
          <Icons.mail className='size-6 text-muted-foreground' />
          <p className='text-muted-foreground text-sm'>No messages yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='max-h-[32rem] w-full overflow-y-auto'>
      <div className='divide-y divide-dashed divide-border'>
        {entries.map((entry) => (
          <GuestbookEntryCard
            currentUserId={currentUserId}
            entry={entry}
            isSignedIn={isSignedIn}
            key={entry.id}
          />
        ))}
      </div>
    </div>
  )
}
