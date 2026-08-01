import { z } from 'zod'

// Input schemas
export const GuestbookEntrySchema = z.object({
  message: z
    .string()
    .trim()
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
  emoji: z.string().min(1).max(12),
  entryId: z.number().int().positive(),
})

export const GuestbookEntryIdSchema = z.object({
  entryId: z.number().int().positive(),
})

export const GuestbookEditSchema = GuestbookEntrySchema.merge(
  GuestbookEntryIdSchema
)

export const GuestbookDeleteSchema = GuestbookEntryIdSchema
export const GuestbookBanUserSchema = z.object({
  action: z.enum(['ban', 'unban']),
  userId: z.string().min(1),
})

export const GuestbookModerationInputSchema = GuestbookEntrySchema.pick({
  message: true,
  signature: true,
})

export const ModerationResultSchema = z.object({
  allowed: z.boolean(),
  reason: z.string().min(1).max(120),
})

// Output schemas
export const GuestbookReactionItemSchema = z.object({
  count: z.number(),
  emoji: z.string(),
  reacted: z.boolean(),
})

export const GuestbookEntryItemSchema = z.object({
  banned: z.boolean(),
  createdAt: z.string(),
  editedAt: z.string().nullable(),
  id: z.number(),
  message: z.string(),
  name: z.string(),
  reactions: z.array(GuestbookReactionItemSchema),
  role: z.string(),
  signature: z.string().nullable(),
  userId: z.string(),
})

// Inferred types
export type GuestbookEntry = z.infer<typeof GuestbookEntrySchema>
export type GuestbookReaction = z.infer<typeof GuestbookReactionSchema>
export type GuestbookEdit = z.infer<typeof GuestbookEditSchema>
export type GuestbookDelete = z.infer<typeof GuestbookDeleteSchema>
export type GuestbookBanUser = z.infer<typeof GuestbookBanUserSchema>
export type GuestbookModerationInput = z.infer<
  typeof GuestbookModerationInputSchema
>
export type GuestbookModerationResult = z.infer<typeof ModerationResultSchema>
export type GuestbookReactionItem = z.infer<typeof GuestbookReactionItemSchema>
export type GuestbookEntryItem = z.infer<typeof GuestbookEntryItemSchema>
