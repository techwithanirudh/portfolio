import { z } from 'zod'

export const RevokeSessionSchema = z.object({
  sessionId: z.string().min(1, { message: 'Session id is required.' }),
})

export type RevokeSession = z.infer<typeof RevokeSessionSchema>
