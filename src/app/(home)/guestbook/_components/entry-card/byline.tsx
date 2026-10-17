import { formatDistanceToNow } from 'date-fns'
import { Icons } from '@/components/icons/icons'
import type { GuestbookEntryItem } from '@/lib/validators/guestbook'

export const EntryByline = ({ entry }: { entry: GuestbookEntryItem }) => (
  <div className='min-w-0 space-y-1'>
    <h3 className='wrap-anywhere font-medium text-sm'>
      {entry.name}
      {entry.role === 'admin' ? (
        <Icons.verifiedAdmin
          aria-label='Verified admin'
          className='icon-pop ml-1.5 inline size-4 align-[-3px] text-primary'
        />
      ) : null}
    </h3>
    <p className='text-muted-foreground text-xs'>
      {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
      {entry.editedAt ? ' • Edited' : ''}
    </p>
  </div>
)
