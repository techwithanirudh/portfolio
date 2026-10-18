import { z } from 'zod'

export const ModerationResultSchema = z.object({
  allowed: z.boolean(),
  reason: z.string().min(1).max(120),
})
