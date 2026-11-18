import { and, count, desc, eq } from 'drizzle-orm'
import { unstable_cache } from 'next/cache'
import { db } from '@/server/db'
import { guestbookEntries, guestbookReactions, users } from '@/server/db/schema'
import type {
  GuestbookEntryItem,
  GuestbookReactionItem,
} from '@/types/guestbook'

/** Tags the shared entry list; actions expire it after every write */
export const GUESTBOOK_CACHE_TAG = 'guestbook'

type SharedGuestbookEntry = Omit<GuestbookEntryItem, 'reactions'> & {
  reactions: Omit<GuestbookReactionItem, 'reacted'>[]
}

const getSharedGuestbookEntries = unstable_cache(
  async (): Promise<SharedGuestbookEntry[]> => {
    const rows = await db
      .select({
        banned: users.banned,
        count: count(guestbookReactions.emoji),
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
          signature: row.signature,
          userId: row.userId,
        }
        entries.set(row.id, entry)
      }

      if (row.emoji) {
        entry.reactions.push({ count: row.count, emoji: row.emoji })
      }
    }

    return [...entries.values()]
  },
  ['guestbook'],
  { tags: [GUESTBOOK_CACHE_TAG] }
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

/** Admins can delete any entry, everyone else only their own */
export const deleteGuestbookEntry = async ({
  entryId,
  isAdmin,
  userId,
}: {
  entryId: number
  isAdmin: boolean
  userId: string
}) => {
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

  return deleted[0] ?? null
}

export const insertGuestbookEntry = async (
  entry: typeof guestbookEntries.$inferInsert
) => {
  await db.insert(guestbookEntries).values(entry)
}

export const toggleGuestbookEntryReaction = async (
  entryId: number,
  userId: string,
  emoji: string
) => {
  const deleted = await db
    .delete(guestbookReactions)
    .where(
      and(
        eq(guestbookReactions.entryId, entryId),
        eq(guestbookReactions.userId, userId),
        eq(guestbookReactions.emoji, emoji)
      )
    )
    .returning({ entryId: guestbookReactions.entryId })

  if (deleted.length === 0) {
    await db
      .insert(guestbookReactions)
      .values({ emoji, entryId, userId })
      .onConflictDoNothing()
  }
}

export const updateGuestbookEntryMessage = async (
  entryId: number,
  userId: string,
  message: string,
  isAdmin = false
) => {
  const updated = await db
    .update(guestbookEntries)
    .set({ editedAt: new Date(), message })
    .where(
      isAdmin
        ? eq(guestbookEntries.id, entryId)
        : and(
            eq(guestbookEntries.id, entryId),
            eq(guestbookEntries.userId, userId)
          )
    )
    .returning({ id: guestbookEntries.id })

  return updated[0] ?? null
}

export const getGuestbookUserStatus = async (userId: string) => {
  const [user] = await db
    .select({ banned: users.banned, role: users.role })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  return user ?? null
}
