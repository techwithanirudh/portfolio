'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

import { ActionError, actionClient } from '@/lib/safe-action'
import {
  GuestbookEditSchema,
  GuestbookEntrySchema,
  GuestbookReactionSchema,
} from '@/lib/validators'
import { getSession } from '@/server/auth'
import { db } from '@/server/db'
import { guestbookEntries, guestbookReactions } from '@/server/db/schema'

const requireUser = async () => {
  const session = await getSession()
  const user = session?.user

  if (!user) {
    throw new ActionError('You must be signed in to do that.')
  }

  return user
}

export const createGuestbookEntry = actionClient
  .schema(GuestbookEntrySchema)
  .action(async ({ parsedInput }) => {
    const user = await requireUser()
    const name = user.name ?? user.email ?? 'Guest'

    await db.insert(guestbookEntries).values({
      userId: user.id,
      name,
      message: parsedInput.message,
    })

    revalidatePath('/guestbook')

    return { success: true }
  })

export const toggleGuestbookReaction = actionClient
  .schema(GuestbookReactionSchema)
  .action(async ({ parsedInput }) => {
    const user = await requireUser()
    const { entryId, emoji } = parsedInput

    const existing = await db
      .select({ entryId: guestbookReactions.entryId })
      .from(guestbookReactions)
      .where(
        and(
          eq(guestbookReactions.entryId, entryId),
          eq(guestbookReactions.userId, user.id),
          eq(guestbookReactions.emoji, emoji)
        )
      )
      .limit(1)

    if (existing.length > 0) {
      await db
        .delete(guestbookReactions)
        .where(
          and(
            eq(guestbookReactions.entryId, entryId),
            eq(guestbookReactions.userId, user.id),
            eq(guestbookReactions.emoji, emoji)
          )
        )
    } else {
      await db.insert(guestbookReactions).values({
        entryId,
        userId: user.id,
        emoji,
      })
    }

    revalidatePath('/guestbook')

    return { success: true }
  })

export const editGuestbookEntry = actionClient
  .schema(GuestbookEditSchema)
  .action(async ({ parsedInput }) => {
    const user = await requireUser()

    const updated = await db
      .update(guestbookEntries)
      .set({
        message: parsedInput.message,
        editedAt: new Date(),
      })
      .where(
        and(
          eq(guestbookEntries.id, parsedInput.entryId),
          eq(guestbookEntries.userId, user.id)
        )
      )
      .returning({ id: guestbookEntries.id })

    if (updated.length === 0) {
      throw new ActionError('Unable to edit this message.')
    }

    revalidatePath('/guestbook')

    return { success: true }
  })
