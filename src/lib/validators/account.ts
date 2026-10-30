import { z } from 'zod'

export const ACCOUNT_NAME_MAX_LENGTH = 32

export const AccountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Enter a display name.' })
    .max(ACCOUNT_NAME_MAX_LENGTH, {
      message: `Shorten your display name to ${ACCOUNT_NAME_MAX_LENGTH} characters or fewer.`,
    }),
})

export type Account = z.infer<typeof AccountSchema>
