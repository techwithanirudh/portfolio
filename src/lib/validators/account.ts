import { z } from 'zod'

export const ACCOUNT_NAME_MAX_LENGTH = 32

export const AccountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Name is required.' })
    .max(ACCOUNT_NAME_MAX_LENGTH, {
      message: `Name must not be longer than ${ACCOUNT_NAME_MAX_LENGTH} characters.`,
    }),
})

export type Account = z.infer<typeof AccountSchema>
