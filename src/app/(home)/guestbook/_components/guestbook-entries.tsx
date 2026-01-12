'use client'

import { Icons } from '@/components/icons/icons'
import type { GuestbookEntryItem } from './guestbook-types'
import { GuestbookEntryCard } from './guestbook-entry-card'

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
      <div className='flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-6 py-10 text-center'>
        <Icons.mail className='size-6 text-muted-foreground' />
        <p className='text-muted-foreground text-sm'>No messages yet.</p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {entries.map((entry) => (
        <GuestbookEntryCard
          currentUserId={currentUserId}
          entry={entry}
          isSignedIn={isSignedIn}
          key={entry.id}
        />
      ))}
    </div>
  )
}
