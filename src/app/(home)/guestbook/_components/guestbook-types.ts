export interface GuestbookReactionItem {
  emoji: string
  count: number
  reacted: boolean
}

export interface GuestbookEntryItem {
  id: number
  name: string
  message: string
  userId: string
  createdAt: string
  editedAt: string | null
  reactions: GuestbookReactionItem[]
}
