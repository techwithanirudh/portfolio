'use server'

import { env } from '@/env'
import { resend } from '@/lib/resend'
import { ActionError, actionClient } from '@/lib/safe-action/client'
import { botIdMiddleware } from '@/lib/safe-action/middleware'
import { ContactSchema } from '@/lib/validators/contact'

export const contact = actionClient
  .use(botIdMiddleware)
  .inputSchema(ContactSchema)
  .action(async ({ parsedInput: { name, email, message } }) => {
    const from = env.EMAIL_FROM
    const to = env.EMAIL_TO

    if (!(resend && from && to)) {
      throw new ActionError(
        'The contact form is unavailable right now. Please try again later.'
      )
    }

    try {
      const { error } = await resend.emails.send({
        from,
        replyTo: email,
        subject: `New contact form submission from ${name}`,
        text: message,
        to,
      })

      if (error) {
        console.error('Error sending contact email:', error)
        throw new ActionError(`Failed to send contact email: ${error.message}`)
      }

      return {
        message: "Thanks, I got your message. I'll reply soon.",
        success: true,
      }
    } catch (error) {
      console.error('Contact form error:', error)
      if (error instanceof ActionError) {
        throw error
      }
      throw new ActionError(
        'Failed to send your message. Please try again later.'
      )
    }
  })
