import { z } from 'zod'

export const GUESTBOOK_MESSAGE_MAX_LENGTH = 500

const entryId = z.number().int().positive()

export const GuestbookEntrySchema = z.object({
  message: z
    .string()
    .trim()
    .min(3, { message: 'Write a message with at least 3 characters.' })
    .max(GUESTBOOK_MESSAGE_MAX_LENGTH, {
      message: `Shorten your message to ${GUESTBOOK_MESSAGE_MAX_LENGTH} characters or fewer.`,
    }),
  signature: z
    .string()
    .startsWith('data:image/png;base64,', {
      message: "Your signature couldn't be read. Clear it and sign again.",
    })
    .max(200_000, {
      message:
        'Your signature is too detailed to save. Clear it and sign with fewer strokes.',
    })
    .optional(),
})

export const GuestbookReactionSchema = z.object({
  emoji: z.string().min(1).max(12),
  entryId,
})

export const GuestbookEditSchema = GuestbookEntrySchema.extend({ entryId })

export const GuestbookDeleteSchema = z.object({ entryId })

export const GuestbookBanUserSchema = z.object({
  action: z.enum(['ban', 'unban']),
  userId: z.string().min(1),
})
