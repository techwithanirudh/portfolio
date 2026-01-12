import { and, desc, eq } from 'drizzle-orm'

import { db } from '@/server/db'
import { guestbookEntries, guestbookReactions } from '@/server/db/schema'

interface ReactionState {
  emoji: string
  count: number
  reacted: boolean
}

export const getGuestbookEntries = async (currentUserId?: string | null) => {
  const rows = await db
    .select({
      id: guestbookEntries.id,
      name: guestbookEntries.name,
      message: guestbookEntries.message,
      userId: guestbookEntries.userId,
      editedAt: guestbookEntries.editedAt,
      createdAt: guestbookEntries.createdAt,
      reactionEmoji: guestbookReactions.emoji,
      reactionUserId: guestbookReactions.userId,
    })
    .from(guestbookEntries)
    .leftJoin(
      guestbookReactions,
      eq(guestbookEntries.id, guestbookReactions.entryId)
    )
    .orderBy(desc(guestbookEntries.createdAt))

  const entriesMap = new Map(
    rows.map((row) => [
      row.id,
      {
        id: row.id,
        name: row.name,
        message: row.message,
        userId: row.userId,
        editedAt: row.editedAt,
        createdAt: row.createdAt,
        reactions: new Map<string, ReactionState>(),
      },
    ])
  )

  for (const row of rows) {
    const entry = entriesMap.get(row.id)
    if (!entry) {
      continue
    }

    if (!row.reactionEmoji) {
      continue
    }

    const emoji = row.reactionEmoji
    const reaction = entry.reactions.get(emoji) ?? {
      emoji,
      count: 0,
      reacted: false,
    }

    const reactedByUser = row.reactionUserId === currentUserId

    entry.reactions.set(emoji, {
      ...reaction,
      count: reaction.count + 1,
      reacted: reactedByUser ? true : reaction.reacted,
    })
  }

  return [...entriesMap.values()].map((entry) => ({
    ...entry,
    createdAt: entry.createdAt.toISOString(),
    editedAt: entry.editedAt ? entry.editedAt.toISOString() : null,
    reactions: [...entry.reactions.values()],
  }))
}

export const deleteGuestbookEntry = async (entryId: number, userId: string) => {
  const deleted = await db
    .delete(guestbookEntries)
    .where(
      and(eq(guestbookEntries.id, entryId), eq(guestbookEntries.userId, userId))
    )
    .returning({ id: guestbookEntries.id })

  return deleted.length > 0
}
