import { z } from 'zod'

export const RevokeSessionSchema = z.object({
  token: z.string().min(1, { message: 'Session token is required.' }),
})
