'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath, updateTag } from 'next/cache'

import { ActionError, actionClient } from '@/lib/safe-action/client'
import type { ActionContext } from '@/lib/safe-action/middleware'
import { botIdMiddleware, userMiddleware } from '@/lib/safe-action/middleware'

import {
  type GuestbookDelete,
  GuestbookDeleteSchema,
  type GuestbookEdit,
  GuestbookEditSchema,
  type GuestbookEntry,
  GuestbookEntrySchema,
  type GuestbookReaction,
  GuestbookReactionSchema,
} from '@/lib/validators'
import { db } from '@/server/db'
import { deleteGuestbookEntry } from '@/server/db/queries/guestbook'
import { guestbookEntries, guestbookReactions } from '@/server/db/schema'

const protectedGuestbookAction = actionClient
  .use(botIdMiddleware)
  .use(userMiddleware)

export const createGuestbookEntry = protectedGuestbookAction
  .inputSchema(GuestbookEntrySchema)
  .action(
    async ({
      parsedInput,
      ctx,
    }: {
      parsedInput: GuestbookEntry
      ctx: ActionContext
    }) => {
      const { user } = ctx
      const name = user.name ?? 'Guest'

      await db.insert(guestbookEntries).values({
        userId: user.id,
        name,
        message: parsedInput.message,
      })

      revalidatePath('/guestbook')
      updateTag('guestbook')

      return { success: true }
    }
  )

export const toggleGuestbookReaction = protectedGuestbookAction
  .inputSchema(GuestbookReactionSchema)
  .action(
    async ({
      parsedInput,
      ctx,
    }: {
      parsedInput: GuestbookReaction
      ctx: ActionContext
    }) => {
      const { user } = ctx
      const { entryId, emoji } = parsedInput

      const deleted = await db
        .delete(guestbookReactions)
        .where(
          and(
            eq(guestbookReactions.entryId, entryId),
            eq(guestbookReactions.userId, user.id),
            eq(guestbookReactions.emoji, emoji)
          )
        )
        .returning({ entryId: guestbookReactions.entryId })

      if (deleted.length === 0) {
        await db
          .insert(guestbookReactions)
          .values({
            entryId,
            userId: user.id,
            emoji,
          })
          .onConflictDoNothing()
      }

      revalidatePath('/guestbook')
      updateTag('guestbook')

      return { success: true }
    }
  )

export const editGuestbookEntry = protectedGuestbookAction
  .inputSchema(GuestbookEditSchema)
  .action(
    async ({
      parsedInput,
      ctx,
    }: {
      parsedInput: GuestbookEdit
      ctx: ActionContext
    }) => {
      const { user } = ctx

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
      updateTag('guestbook')

      return { success: true }
    }
  )

export const removeGuestbookEntry = protectedGuestbookAction
  .inputSchema(GuestbookDeleteSchema)
  .action(
    async ({
      parsedInput,
      ctx,
    }: {
      parsedInput: GuestbookDelete
      ctx: ActionContext
    }) => {
      const { user } = ctx
      const removed = await deleteGuestbookEntry(parsedInput.entryId, user.id)

      if (!removed) {
        throw new ActionError('Unable to delete this message.')
      }

      revalidatePath('/guestbook')
      updateTag('guestbook')

      return { success: true }
    }
  )
