import { z } from 'zod'

export const MODERATION_REASON_MAX_LENGTH = 120

export const ModerationResultSchema = z.object({
  allowed: z.boolean(),
  reason: z
    .string()
    .min(1)
    .max(MODERATION_REASON_MAX_LENGTH)
    .describe(
      `One short, user-facing sentence on why, under ${MODERATION_REASON_MAX_LENGTH} characters.`
    ),
})
