'use client'

import { Icons } from '@/components/icons/icons'
import type { GuestbookEntryItem } from '@/lib/validators/guestbook'
import { GuestbookEntryCard } from './entry-card'

interface GuestbookEntriesProps {
  currentUserId: string | null
  entries: GuestbookEntryItem[]
  isAdmin: boolean
  isSignedIn: boolean
}

export const GuestbookEntries = ({
  currentUserId,
  entries,
  isAdmin,
  isSignedIn,
}: GuestbookEntriesProps) => {
  if (entries.length === 0) {
    return (
      <div className='flex flex-col items-center gap-2 px-6 py-16 text-center'>
        <Icons.mail className='size-6 text-muted-foreground' />
        <p className='text-muted-foreground text-sm'>No messages yet.</p>
      </div>
    )
  }

  return (
    // The list flows with the page, so the section grows instead of scrolling
    <div className='divide-y divide-line'>
      {entries.map((entry) => (
        <GuestbookEntryCard
          currentUserId={currentUserId}
          entry={entry}
          isAdmin={isAdmin}
          isSignedIn={isSignedIn}
          key={entry.id}
        />
      ))}
    </div>
  )
}
