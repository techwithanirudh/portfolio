'use server'

import { put } from '@vercel/blob'
import { and, eq } from 'drizzle-orm'
import { revalidatePath, updateTag } from 'next/cache'
import { headers } from 'next/headers'
import { ActionError, actionClient } from '@/lib/safe-action/client'
import type { ActionContext } from '@/lib/safe-action/middleware'
import { botIdMiddleware, userMiddleware } from '@/lib/safe-action/middleware'
import {
  type GuestbookBanUser,
  GuestbookBanUserSchema,
  type GuestbookDelete,
  GuestbookDeleteSchema,
  type GuestbookEdit,
  GuestbookEditSchema,
  type GuestbookEntry,
  GuestbookEntrySchema,
  type GuestbookReaction,
  GuestbookReactionSchema,
} from '@/lib/validators'
import { auth } from '@/server/auth'
import { db } from '@/server/db'
import { deleteGuestbookEntry } from '@/server/db/queries/guestbook'
import { guestbookEntries, guestbookReactions, users } from '@/server/db/schema'
import { moderateGuestbookEntry } from './utils/moderation'

const BASE64_PNG_PREFIX = /^data:image\/png;base64,/

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

      const moderation = await moderateGuestbookEntry({
        message: parsedInput.message,
        signature: parsedInput.signature,
      })

      if (!moderation.allowed) {
        throw new ActionError(moderation.reason)
      }

      let signatureUrl: string | null = null

      if (parsedInput.signature) {
        const base64Data = parsedInput.signature.replace(BASE64_PNG_PREFIX, '')
        const buffer = Buffer.from(base64Data, 'base64')
        const blob = await put(
          `guestbook/signatures/${user.id}-${Date.now()}.png`,
          buffer,
          {
            access: 'public',
            contentType: 'image/png',
            cacheControlMaxAge: 31_536_000,
          }
        )
        signatureUrl = blob.url
      }

      await db.insert(guestbookEntries).values({
        userId: user.id,
        name,
        message: parsedInput.message,
        signature: signatureUrl,
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
      const isAdmin = user.role === 'admin'

      const updated = await db
        .update(guestbookEntries)
        .set({
          message: parsedInput.message,
          editedAt: new Date(),
        })
        .where(
          isAdmin
            ? eq(guestbookEntries.id, parsedInput.entryId)
            : and(
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
      const isAdmin = user.role === 'admin'
      const removed = await deleteGuestbookEntry(
        parsedInput.entryId,
        user.id,
        isAdmin
      )

      if (!removed) {
        throw new ActionError('Unable to delete this message.')
      }

      revalidatePath('/guestbook')
      updateTag('guestbook')

      return { success: true }
    }
  )

export const banGuestbookUser = protectedGuestbookAction
  .inputSchema(GuestbookBanUserSchema)
  .action(
    async ({
      parsedInput,
      ctx,
    }: {
      parsedInput: GuestbookBanUser
      ctx: ActionContext
    }) => {
      const { user } = ctx
      const isAdmin = user.role === 'admin'

      if (!isAdmin) {
        throw new ActionError('Only admins can ban users.')
      }

      if (parsedInput.userId === user.id) {
        throw new ActionError('You cannot ban your own account.')
      }

      const [targetUser] = await db
        .select({
          role: users.role,
        })
        .from(users)
        .where(eq(users.id, parsedInput.userId))
        .limit(1)

      if (!targetUser) {
        throw new ActionError('User not found.')
      }

      if (targetUser.role === 'admin') {
        throw new ActionError('Admin accounts cannot be banned from here.')
      }

      await auth.api.banUser({
        body: {
          userId: parsedInput.userId,
          banReason: 'Banned by an admin from the guestbook.',
        },
        headers: await headers(),
      })

      revalidatePath('/guestbook')
      updateTag('guestbook')

      return { success: true }
    }
  )
