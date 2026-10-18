'use server'

import { env } from '@/env'
import { resend } from '@/lib/resend'
import { ActionError, publicActionClient } from '@/lib/safe-action'
import { ContactSchema } from '@/lib/validators/contact'
// TODO(slopradar): path-alias: five-level relative import into emails/, add an @/emails path alias
import ContactNotificationEmail from '../../../../../emails/contact-notification'

const sentAtFormat = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
  // TODO(slopradar): magic-string: the owner's time zone and the ' IST' suffix are typed here, read the zone from src/constants/portfolio/profile and let Intl print timeZoneName
  timeZone: 'Asia/Kolkata',
})

export const contact = publicActionClient
  .inputSchema(ContactSchema)
  .action(async ({ parsedInput: { name, email, message } }) => {
    const from = env.EMAIL_FROM
    const to = env.EMAIL_TO

    if (!(resend && from && to)) {
      throw new ActionError(
        'The contact form is unavailable right now. Please try again later.'
      )
    }

    const sentAt = `${sentAtFormat.format(new Date())} IST`

    // Resend returns API failures and throws on network ones. Either way the
    // detail is logged once and the visitor gets a generic message
    const { error } = await resend.emails
      .send({
        from,
        react: ContactNotificationEmail({ email, message, name, sentAt }),
        replyTo: email,
        subject: `New contact form submission from ${name}`,
        text: `${message}\n\nFrom ${name} (${email}), ${sentAt}`,
        to,
      })
      .catch((cause: unknown) => ({ error: cause }))

    if (error) {
      console.error('Failed to send contact email:', error)
      throw new ActionError(
        'Failed to send your message. Please try again later.'
      )
    }

    return {
      message: "Thanks, I got your message. I'll reply soon.",
      success: true,
    }
  })
