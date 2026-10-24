'use server'

import { del, put } from '@vercel/blob'
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
} from '@/lib/validators/guestbook'
import { auth } from '@/server/auth'
import {
  deleteGuestbookEntry,
  GUESTBOOK_CACHE_TAG,
  getGuestbookUserStatus,
  insertGuestbookEntry,
  toggleGuestbookEntryReaction,
  updateGuestbookEntryMessage,
} from '@/server/db/queries/guestbook'
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

    await insertGuestbookEntry({
      message: parsedInput.message,
      name: user.name,
      signature: signatureUrl,
      userId: user.id,
    })

    updateTag(GUESTBOOK_CACHE_TAG)
  })

export const toggleGuestbookReaction = userActionClient
  .inputSchema(GuestbookReactionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx
    const { entryId, emoji } = parsedInput

    await toggleGuestbookEntryReaction(entryId, user.id, emoji)

    updateTag(GUESTBOOK_CACHE_TAG)
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

    const updated = await updateGuestbookEntryMessage(
      parsedInput.entryId,
      user.id,
      parsedInput.message,
      isAdmin
    )

    if (!updated) {
      throw new ActionError(
        "Couldn't update this entry. Refresh the page and try again."
      )
    }

    updateTag(GUESTBOOK_CACHE_TAG)
  })

export const removeGuestbookEntry = userActionClient
  .inputSchema(GuestbookDeleteSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx
    const removed = await deleteGuestbookEntry({
      entryId: parsedInput.entryId,
      isAdmin: user.role === 'admin',
      userId: user.id,
    })

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

    updateTag(GUESTBOOK_CACHE_TAG)
  })

export const banGuestbookUser = adminActionClient
  .inputSchema(GuestbookBanUserSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx

    if (parsedInput.userId === user.id) {
      throw new ActionError('You cannot ban your own account.')
    }

    const targetUser = await getGuestbookUserStatus(parsedInput.userId)

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

    updateTag(GUESTBOOK_CACHE_TAG)
  })
