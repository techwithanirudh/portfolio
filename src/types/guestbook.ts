import type { guestbookEntries, users } from '@/server/db/schema'

type Entry = typeof guestbookEntries.$inferSelect
type User = typeof users.$inferSelect

export interface GuestbookReactionItem {
  count: number
  emoji: string
  reacted: boolean
}

/** One entry as the guestbook query reads it, with dates serialized */
export interface GuestbookEntryItem
  extends Pick<Entry, 'id' | 'message' | 'name' | 'signature' | 'userId'> {
  banned: boolean
  createdAt: string
  editedAt: string | null
  reactions: GuestbookReactionItem[]
  role: User['role']
}
