import { and, desc, eq, sql } from 'drizzle-orm'
import { unstable_cache } from 'next/cache'

import type { GuestbookEntryItem } from '@/lib/validators/guestbook'
import { db } from '@/server/db'
import { guestbookEntries, guestbookReactions, users } from '@/server/db/schema'

const fetchGuestbookEntries = async (
  currentUserId?: string | null
): Promise<GuestbookEntryItem[]> => {
  const rows = await db
    .select({
      // Entry info
      id: guestbookEntries.id,
      name: guestbookEntries.name,
      message: guestbookEntries.message,
      signature: guestbookEntries.signature,
      userId: guestbookEntries.userId,
      role: users.role,
      createdAt: guestbookEntries.createdAt,
      editedAt: guestbookEntries.editedAt,
      // Reactions
      emoji: guestbookReactions.emoji,
      count: sql<number>`count(${guestbookReactions.emoji})`.mapWith(Number),
      reacted: currentUserId
        ? sql<boolean>`coalesce(bool_or(${guestbookReactions.userId} = ${currentUserId}), false)`
        : sql<boolean>`false`,
    })
    .from(guestbookEntries)
    .innerJoin(users, eq(users.id, guestbookEntries.userId))
    .leftJoin(
      guestbookReactions,
      eq(guestbookReactions.entryId, guestbookEntries.id)
    )
    .groupBy(
      guestbookEntries.id,
      guestbookEntries.name,
      guestbookEntries.message,
      guestbookEntries.signature,
      guestbookEntries.userId,
      users.role,
      guestbookEntries.createdAt,
      guestbookEntries.editedAt,
      guestbookReactions.emoji
    )
    .orderBy(desc(guestbookEntries.createdAt))

  const entriesMap = new Map()

  for (const row of rows) {
    if (!entriesMap.has(row.id)) {
      entriesMap.set(row.id, {
        id: row.id,
        name: row.name,
        message: row.message,
        signature: row.signature ?? null,
        userId: row.userId,
        role: row.role,
        createdAt: row.createdAt,
        editedAt: row.editedAt,
        reactions: [],
      })
    }

    if (row.emoji) {
      entriesMap.get(row.id)!.reactions.push({
        emoji: row.emoji,
        count: row.count,
        reacted: row.reacted,
      })
    }
  }

  return [...entriesMap.values()].map((entry) => ({
    ...entry,
    createdAt: entry.createdAt.toISOString(),
    editedAt: entry.editedAt?.toISOString() ?? null,
  }))
}

export const getGuestbookEntries = (currentUserId?: string | null) => {
  return unstable_cache(
    () => fetchGuestbookEntries(currentUserId),
    ['guestbook', currentUserId ?? 'anonymous'],
    {
      tags: ['guestbook'],
    }
  )()
}

export const deleteGuestbookEntry = async (
  entryId: number,
  userId: string,
  isAdmin = false
) => {
  const deleted = await db
    .delete(guestbookEntries)
    .where(
      isAdmin
        ? eq(guestbookEntries.id, entryId)
        : and(
            eq(guestbookEntries.id, entryId),
            eq(guestbookEntries.userId, userId)
          )
    )
    .returning({ id: guestbookEntries.id })

  return deleted.length > 0
}
