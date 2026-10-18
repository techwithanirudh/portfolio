'use server'

import { del, put } from '@vercel/blob'
import { and, eq } from 'drizzle-orm'
import { updateTag } from 'next/cache'
import { headers } from 'next/headers'
import { type Base64FileParts, parseB64File } from '@/lib/files'
import {
  ActionError,
  adminActionClient,
  userActionClient,
} from '@/lib/safe-action'
import {
  GuestbookBanUserSchema,
  GuestbookDeleteSchema,
  GuestbookEditSchema,
  GuestbookEntrySchema,
  GuestbookReactionSchema,
} from '@/lib/validators'
import { auth } from '@/server/auth'
import { db } from '@/server/db'
import { deleteGuestbookEntry } from '@/server/db/queries/guestbook'
import { guestbookEntries, guestbookReactions, users } from '@/server/db/schema'
import { moderateEntry } from './utils/moderation'

export const createGuestbookEntry = userActionClient
  .inputSchema(GuestbookEntrySchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx
    let parsedSignature: Base64FileParts | null = null

    if (parsedInput.signature) {
      parsedSignature = parseB64File(parsedInput.signature)

      if (parsedSignature?.mediaType !== 'image/png') {
        throw new ActionError(
          "Your signature couldn't be read. Clear it and sign again."
        )
      }
    }

    const moderation = await moderateEntry({
      message: parsedInput.message,
      signature: parsedSignature ?? undefined,
    })

    if (!moderation.allowed) {
      throw new ActionError(moderation.reason)
    }

    let signatureUrl: string | null = null

    if (parsedSignature) {
      const buffer = Buffer.from(parsedSignature.data, 'base64')
      const blob = await put(
        `guestbook/signatures/${user.id}-${Date.now()}.png`,
        buffer,
        {
          access: 'public',
          cacheControlMaxAge: 31_536_000,
          contentType: 'image/png',
        }
      )
      signatureUrl = blob.url
    }

    await db.insert(guestbookEntries).values({
      message: parsedInput.message,
      name: user.name,
      signature: signatureUrl,
      userId: user.id,
    })

    // TODO(slopradar): magic-string: the 'guestbook' cache tag is repeated 5 times here and again in the query's cacheTag, export one constant from @/server/db/queries/guestbook
    updateTag('guestbook')

    // TODO(slopradar): dead-field: no caller reads `success` (x5 in this file, also revoke-session.ts and beside `message` in contact.ts and newsletter.ts), next-safe-action already reports success through onSuccess and hasSucceeded, return nothing or only what the client reads
    return { success: true }
  })

export const toggleGuestbookReaction = userActionClient
  .inputSchema(GuestbookReactionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx
    const { entryId, emoji } = parsedInput

    // TODO(slopradar): boundary: reactions, edits and bans run Drizzle inline while list and delete go through server/db/queries/guestbook (x3 in this file), move them into the queries module
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
          emoji,
          entryId,
          userId: user.id,
        })
        .onConflictDoNothing()
    }

    updateTag('guestbook')

    return { success: true }
  })

export const editGuestbookEntry = userActionClient
  .inputSchema(GuestbookEditSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx
    const isAdmin = user.role === 'admin'

    const moderation = await moderateEntry({ message: parsedInput.message })

    if (!moderation.allowed) {
      throw new ActionError(moderation.reason)
    }

    // TODO(slopradar): boundary: inline Drizzle update in an action, see toggleGuestbookReaction above
    const updated = await db
      .update(guestbookEntries)
      .set({
        editedAt: new Date(),
        message: parsedInput.message,
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
      throw new ActionError(
        "Couldn't update this entry. Refresh the page and try again."
      )
    }

    updateTag('guestbook')

    return { success: true }
  })

export const removeGuestbookEntry = userActionClient
  .inputSchema(GuestbookDeleteSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx
    const isAdmin = user.role === 'admin'
    const removed = await deleteGuestbookEntry(
      parsedInput.entryId,
      user.id,
      isAdmin
    )

    if (!removed) {
      throw new ActionError(
        "Couldn't delete this entry. Refresh the page and try again."
      )
    }

    if (removed.signature) {
      try {
        await del(removed.signature)
      } catch (error) {
        console.error('Failed to delete guestbook signature blob:', {
          entryId: parsedInput.entryId,
          error:
            error instanceof Error
              ? { message: error.message, name: error.name }
              : String(error),
          signature: removed.signature,
        })
      }
    }

    updateTag('guestbook')

    return { success: true }
  })

export const banGuestbookUser = adminActionClient
  .inputSchema(GuestbookBanUserSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx

    if (parsedInput.userId === user.id) {
      throw new ActionError('You cannot ban your own account.')
    }

    const [targetUser] = await db
      .select({
        banned: users.banned,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, parsedInput.userId))
      .limit(1)

    if (!targetUser) {
      throw new ActionError(
        "That account doesn't exist anymore. Refresh the page."
      )
    }

    if (targetUser.role === 'admin') {
      throw new ActionError("You can't ban admin accounts here.")
    }

    if (parsedInput.action === 'ban') {
      if (targetUser.banned) {
        throw new ActionError('This user is already banned.')
      }

      await auth.api.banUser({
        body: {
          banReason: 'Banned by an admin from the guestbook.',
          userId: parsedInput.userId,
        },
        headers: await headers(),
      })
    } else {
      if (!targetUser.banned) {
        throw new ActionError('This user is not banned.')
      }

      await auth.api.unbanUser({
        body: {
          userId: parsedInput.userId,
        },
        headers: await headers(),
      })
    }

    updateTag('guestbook')

    return { success: true }
  })
