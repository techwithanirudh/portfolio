import { and, desc, eq, sql } from 'drizzle-orm'

import { db } from '@/server/db'
import { guestbookEntries, guestbookReactions } from '@/server/db/schema'

interface ReactionState {
  emoji: string
  count: number
  reacted: boolean
}

export const getGuestbookEntries = async (currentUserId?: string | null) => {
  const reactedExpression = currentUserId
    ? sql<boolean>`coalesce(bool_or(${guestbookReactions.userId} = ${currentUserId}), false)`
    : sql<boolean>`false`

  const rows = await db
    .select({
      id: guestbookEntries.id,
      name: guestbookEntries.name,
      message: guestbookEntries.message,
      userId: guestbookEntries.userId,
      editedAt: guestbookEntries.editedAt,
      createdAt: guestbookEntries.createdAt,
      emoji: guestbookReactions.emoji,
      reactionCount: sql<number>`count(${guestbookReactions.emoji})`.mapWith(
        Number
      ),
      reacted: reactedExpression,
    })
    .from(guestbookEntries)
    .leftJoin(
      guestbookReactions,
      eq(guestbookEntries.id, guestbookReactions.entryId)
    )
    .groupBy(
      guestbookEntries.id,
      guestbookEntries.name,
      guestbookEntries.message,
      guestbookEntries.userId,
      guestbookEntries.editedAt,
      guestbookEntries.createdAt,
      guestbookReactions.emoji
    )
    .orderBy(desc(guestbookEntries.createdAt))

  const entriesMap = new Map<
    number,
    {
      id: number
      name: string
      message: string
      userId: string
      editedAt: Date | null
      createdAt: Date
      reactions: ReactionState[]
    }
  >()

  for (const row of rows) {
    const entry = entriesMap.get(row.id) ?? {
      id: row.id,
      name: row.name,
      message: row.message,
      userId: row.userId,
      editedAt: row.editedAt,
      createdAt: row.createdAt,
      reactions: [],
    }

    if (!entriesMap.has(row.id)) {
      entriesMap.set(row.id, entry)
    }

    if (!row.emoji) {
      continue
    }

    entry.reactions.push({
      emoji: row.emoji,
      count: row.reactionCount,
      reacted: row.reacted,
    })
  }

  return [...entriesMap.values()].map((entry) => ({
    ...entry,
    createdAt: entry.createdAt.toISOString(),
    editedAt: entry.editedAt ? entry.editedAt.toISOString() : null,
    reactions: entry.reactions,
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
