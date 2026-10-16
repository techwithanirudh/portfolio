import { and, desc, eq, sql } from 'drizzle-orm'
import { unstable_cache } from 'next/cache'

import type {
  GuestbookEntryItem,
  GuestbookReactionItem,
} from '@/lib/validators/guestbook'
import { db } from '@/server/db'
import { guestbookEntries, guestbookReactions, users } from '@/server/db/schema'

type SharedGuestbookEntry = Omit<GuestbookEntryItem, 'reactions'> & {
  reactions: Omit<GuestbookReactionItem, 'reacted'>[]
}

const fetchSharedGuestbookEntries = async (): Promise<
  SharedGuestbookEntry[]
> => {
  const rows = await db
    .select({
      banned: users.banned,
      count: sql<number>`count(${guestbookReactions.emoji})`.mapWith(Number),
      createdAt: guestbookEntries.createdAt,
      editedAt: guestbookEntries.editedAt,
      emoji: guestbookReactions.emoji,
      id: guestbookEntries.id,
      message: guestbookEntries.message,
      name: guestbookEntries.name,
      role: users.role,
      signature: guestbookEntries.signature,
      userId: guestbookEntries.userId,
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
      users.banned,
      guestbookEntries.createdAt,
      guestbookEntries.editedAt,
      guestbookReactions.emoji
    )
    .orderBy(desc(guestbookEntries.createdAt))

  const entries = new Map<number, SharedGuestbookEntry>()

  for (const row of rows) {
    let entry = entries.get(row.id)

    if (!entry) {
      entry = {
        banned: row.banned ?? false,
        createdAt: row.createdAt.toISOString(),
        editedAt: row.editedAt?.toISOString() ?? null,
        id: row.id,
        message: row.message,
        name: row.name,
        reactions: [],
        role: row.role,
        signature: row.signature ?? null,
        userId: row.userId,
      }
      entries.set(row.id, entry)
    }

    if (row.emoji) {
      entry.reactions.push({ count: row.count, emoji: row.emoji })
    }
  }

  return [...entries.values()]
}

const getSharedGuestbookEntries = unstable_cache(
  fetchSharedGuestbookEntries,
  ['guestbook'],
  { tags: ['guestbook'] }
)

const getViewerReactionKeys = async (userId: string) => {
  const rows = await db
    .select({
      emoji: guestbookReactions.emoji,
      entryId: guestbookReactions.entryId,
    })
    .from(guestbookReactions)
    .where(eq(guestbookReactions.userId, userId))

  return new Set(rows.map((row) => `${row.entryId}:${row.emoji}`))
}

export const getGuestbookEntries = async (
  currentUserId?: string | null
): Promise<GuestbookEntryItem[]> => {
  const [entries, viewerReactions] = await Promise.all([
    getSharedGuestbookEntries(),
    currentUserId ? getViewerReactionKeys(currentUserId) : null,
  ])

  return entries.map((entry) => ({
    ...entry,
    reactions: entry.reactions.map((reaction) => ({
      ...reaction,
      reacted: viewerReactions?.has(`${entry.id}:${reaction.emoji}`) ?? false,
    })),
  }))
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
    .returning({
      id: guestbookEntries.id,
      signature: guestbookEntries.signature,
    })

  return deleted.length > 0 ? deleted[0] : null
}
