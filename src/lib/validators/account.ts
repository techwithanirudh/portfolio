import { z } from 'zod'

export const AccountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Name is required.' })
    .max(32, { message: 'Name must not be longer than 32 characters.' }),
})

export type Account = z.infer<typeof AccountSchema>
