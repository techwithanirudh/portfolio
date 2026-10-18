'use client'

import type { ReactNode } from 'react'
import { Icons } from '@/components/icons/icons'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { GuestbookEntryItem } from '@/lib/validators/guestbook'
import { GuestbookEntryCard } from './entry-card'

const EntriesNotice = ({ children }: { children: ReactNode }) => (
  <div className='flex min-h-0 flex-1 flex-col items-center justify-center gap-2 px-6 text-center'>
    <Icons.mail className='size-6 text-muted-foreground' />
    <p className='text-muted-foreground text-sm'>{children}</p>
  </div>
)

interface GuestbookEntriesProps {
  currentUserId: string | null
  entries: GuestbookEntryItem[]
  isAdmin: boolean
}

export const GuestbookEntries = ({
  currentUserId,
  entries,
  isAdmin,
}: GuestbookEntriesProps) => {
  if (entries.length === 0) {
    return <EntriesNotice>No messages yet.</EntriesNotice>
  }

  return (
    <div className='min-h-0 flex-1'>
      <ScrollArea className='h-full w-full' data-lenis-prevent>
        <div className='dashed-stack'>
          {entries.map((entry) => (
            <GuestbookEntryCard
              currentUserId={currentUserId}
              entry={entry}
              isAdmin={isAdmin}
              key={entry.id}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export const GuestbookEntriesError = () => (
  <EntriesNotice>
    Couldn't load the entries right now. Try again in a bit.
  </EntriesNotice>
)
