import { z } from 'zod'

export const GuestbookEntrySchema = z.object({
  message: z
    .string()
    .min(3, { message: 'Message must be at least 3 characters.' })
    .max(500, { message: 'Message must be under 500 characters.' }),
})

export const GuestbookReactionSchema = z.object({
  entryId: z.number().int().positive(),
  emoji: z.string().min(1).max(12),
})

export const GuestbookEditSchema = GuestbookEntrySchema.extend({
  entryId: z.number().int().positive(),
})

export type GuestbookEntry = z.infer<typeof GuestbookEntrySchema>
export type GuestbookReaction = z.infer<typeof GuestbookReactionSchema>
export type GuestbookEdit = z.infer<typeof GuestbookEditSchema>
