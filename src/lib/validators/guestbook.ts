import { z } from 'zod'

// Input schemas
export const GuestbookEntrySchema = z.object({
  message: z
    .string()
    .min(3, { message: 'Message must be at least 3 characters.' })
    .max(500, { message: 'Message must be under 500 characters.' }),
  signature: z
    .string()
    .startsWith('data:image/png;base64,', {
      message: 'Signature must be a PNG data URL.',
    })
    .max(200_000, { message: 'Signature is too large.' })
    .optional(),
})

export const GuestbookReactionSchema = z.object({
  entryId: z.number().int().positive(),
  emoji: z.string().min(1).max(12),
})

export const GuestbookEntryIdSchema = z.object({
  entryId: z.number().int().positive(),
})

export const GuestbookEditSchema = GuestbookEntrySchema.merge(
  GuestbookEntryIdSchema
)

export const GuestbookDeleteSchema = GuestbookEntryIdSchema

export const GuestbookModerationInputSchema = GuestbookEntrySchema.pick({
  message: true,
  signature: true,
})

export const GuestbookModerationResultSchema = z.object({
  allowed: z.boolean(),
  reason: z.string().min(1).max(120),
})

// Output schemas
export const GuestbookReactionItemSchema = z.object({
  emoji: z.string(),
  count: z.number(),
  reacted: z.boolean(),
})

export const GuestbookEntryItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  message: z.string(),
  signature: z.string().nullable(),
  userId: z.string(),
  role: z.string(),
  createdAt: z.string(),
  editedAt: z.string().nullable(),
  reactions: z.array(GuestbookReactionItemSchema),
})

// Inferred types
export type GuestbookEntry = z.infer<typeof GuestbookEntrySchema>
export type GuestbookReaction = z.infer<typeof GuestbookReactionSchema>
export type GuestbookEdit = z.infer<typeof GuestbookEditSchema>
export type GuestbookDelete = z.infer<typeof GuestbookDeleteSchema>
export type GuestbookModerationInput = z.infer<
  typeof GuestbookModerationInputSchema
>
export type GuestbookModerationResult = z.infer<
  typeof GuestbookModerationResultSchema
>
export type GuestbookReactionItem = z.infer<typeof GuestbookReactionItemSchema>
export type GuestbookEntryItem = z.infer<typeof GuestbookEntryItemSchema>
