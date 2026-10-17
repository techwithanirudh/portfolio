import { z } from 'zod'

export const CONTACT_NAME_MAX_LENGTH = 80
export const CONTACT_MESSAGE_MAX_LENGTH = 5000

export const ContactSchema = z.object({
  email: z.email({
    error: 'Please provide a valid email address.',
  }),
  message: z
    .string()
    .min(30, {
      message: 'Message must be at least 30 characters.',
    })
    .max(CONTACT_MESSAGE_MAX_LENGTH, {
      message: 'Message must be under 5,000 characters.',
    }),
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(CONTACT_NAME_MAX_LENGTH, {
      message: `Name must not be longer than ${CONTACT_NAME_MAX_LENGTH} characters.`,
    }),
})

export type Contact = z.infer<typeof ContactSchema>
