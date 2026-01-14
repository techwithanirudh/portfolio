'use client'

import { Icons } from '@/components/icons/icons'
import { ViewAnimation } from '@/components/view-animation'
import type { GuestbookEntryItem } from '@/lib/validators/guestbook'
import { GuestbookEntryCard } from './entry-card'

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
        {entries.map((entry, index) => (
          <ViewAnimation
            delay={0.05 * index}
            initial={{ opacity: 0, translateY: 6 }}
            key={entry.id}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <GuestbookEntryCard
              currentUserId={currentUserId}
              entry={entry}
              isSignedIn={isSignedIn}
            />
          </ViewAnimation>
        ))}
      </div>
    </div>
  )
}
