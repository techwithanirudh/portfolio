'use client'

import { Icons } from '@/components/icons/icons'
import { ScrollArea } from '@/components/ui/scroll-area'
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
      <div className='flex min-h-0 flex-1 flex-col items-center justify-center gap-2 px-6 text-center'>
        <Icons.mail className='size-6 text-muted-foreground' />
        <p className='text-muted-foreground text-sm'>No messages yet.</p>
      </div>
    )
  }

  return (
    // Fills whatever height the section gets (see Section's fill) and
    // scrolls within it
    <div className='min-h-0 flex-1'>
      <ScrollArea className='h-full w-full' data-lenis-prevent>
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
      </ScrollArea>
    </div>
  )
}

// Shown when the entries can't be loaded, so the rest of the page still works
export const GuestbookEntriesError = () => (
  <div className='flex min-h-0 flex-1 flex-col items-center justify-center gap-2 px-6 text-center'>
    <Icons.mail className='size-6 text-muted-foreground' />
    <p className='text-muted-foreground text-sm'>
      Couldn't load the entries right now. Try again in a bit.
    </p>
  </div>
)
