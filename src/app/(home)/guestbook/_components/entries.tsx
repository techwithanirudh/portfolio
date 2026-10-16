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
      <ScrollArea className='h-[32rem] w-full' data-lenis-prevent>
        <div className='flex flex-col items-center gap-2 px-6 py-10 text-center'>
          <Icons.mail className='size-6 text-muted-foreground' />
          <p className='text-muted-foreground text-sm'>No messages yet.</p>
        </div>
      </ScrollArea>
    )
  }

  return (
    <ScrollArea className='h-[32rem] w-full' data-lenis-prevent>
      <div className='divide-y divide-dashed divide-border'>
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
  )
}

export const GuestbookEntriesError = () => (
  <div className='flex h-[32rem] w-full flex-col items-center justify-center gap-2 px-6 text-center'>
    <Icons.mail className='size-6 text-muted-foreground' />
    <p className='text-muted-foreground text-sm'>
      Couldn't load the entries right now. Try again in a bit.
    </p>
  </div>
)
