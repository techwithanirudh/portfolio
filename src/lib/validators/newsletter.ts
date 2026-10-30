import { z } from 'zod'

export const NewsletterSchema = z.object({
  email: z.email({ error: 'Enter an email address like name@example.com.' }),
})
