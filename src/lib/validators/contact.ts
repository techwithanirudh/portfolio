import { z } from 'zod'

export const CONTACT_NAME_MAX_LENGTH = 80
export const CONTACT_MESSAGE_MIN_LENGTH = 30
export const CONTACT_MESSAGE_MAX_LENGTH = 5000

export const ContactSchema = z.object({
  email: z.email({
    error: 'Enter an email address like name@example.com.',
  }),
  message: z
    .string()
    .min(CONTACT_MESSAGE_MIN_LENGTH, {
      message: `Write a message with at least ${CONTACT_MESSAGE_MIN_LENGTH} characters.`,
    })
    .max(CONTACT_MESSAGE_MAX_LENGTH, {
      message: `Shorten your message to ${CONTACT_MESSAGE_MAX_LENGTH.toLocaleString('en-US')} characters or fewer.`,
    }),
  name: z
    .string()
    .min(2, {
      message: 'Enter a name with at least 2 characters.',
    })
    .max(CONTACT_NAME_MAX_LENGTH, {
      message: `Shorten your name to ${CONTACT_NAME_MAX_LENGTH} characters or fewer.`,
    }),
})

export type Contact = z.infer<typeof ContactSchema>
