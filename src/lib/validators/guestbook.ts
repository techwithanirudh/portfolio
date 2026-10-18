import { z } from 'zod'

export const GUESTBOOK_MESSAGE_MAX_LENGTH = 500

const entryId = z.number().int().positive()

export const GuestbookEntrySchema = z.object({
  message: z
    .string()
    .trim()
    .min(3, { message: 'Message must be at least 3 characters.' })
    .max(GUESTBOOK_MESSAGE_MAX_LENGTH, {
      message: `Message must be under ${GUESTBOOK_MESSAGE_MAX_LENGTH} characters.`,
    }),
  signature: z
    .string()
    .startsWith('data:image/png;base64,', {
      message: 'Signature must be a PNG data URL.',
    })
    .max(200_000, { message: 'Signature is too large.' })
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

// TODO(slopradar): misplaced: these are the read model server/db/queries/guestbook.ts builds, not validators, and `role`/`banned`/`signature` restate Drizzle columns; move them next to the query (or src/types) and type the column fields from typeof users.$inferSelect / guestbookEntries.$inferSelect
export interface GuestbookReactionItem {
  count: number
  emoji: string
  reacted: boolean
}

export interface GuestbookEntryItem {
  banned: boolean
  createdAt: string
  editedAt: string | null
  id: number
  message: string
  name: string
  reactions: GuestbookReactionItem[]
  role: string
  signature: string | null
  userId: string
}
