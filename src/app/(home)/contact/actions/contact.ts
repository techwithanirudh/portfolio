'use server'

import { profile } from '@/constants/portfolio/profile'
import { email as ownerEmail } from '@/constants/site'
import { env } from '@/env'
import { resend } from '@/lib/resend'
import { ActionError, publicActionClient } from '@/lib/safe-action'
import { ContactSchema } from '@/lib/validators/contact'
// TODO(slopradar): path-alias: five-level relative import into emails/, add an @/emails path alias
import ContactNotificationEmail from '../../../../../emails/contact-notification'

const sentAtFormat = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: profile.timeZone,
})

export const contact = publicActionClient
  .inputSchema(ContactSchema)
  .action(async ({ parsedInput: { name, email, message } }) => {
    const from = env.EMAIL_FROM
    const to = env.EMAIL_TO

    if (!(resend && from && to)) {
      console.error(
        'Contact form unavailable: Resend or the email env is not configured'
      )
      throw new ActionError(
        `The contact form is unavailable right now. Email me at ${ownerEmail} instead.`
      )
    }

    // TODO(slopradar): magic-string: the ' IST' suffix still restates profile.timeZone; timeZoneName cannot be combined with dateStyle/timeStyle and en-US prints 'GMT+5:30', so printing it from Intl changes the email text (owner call)
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
        `Your message didn't send. Try again in a few minutes, or email me at ${ownerEmail}.`
      )
    }

    return {
      message: "Thanks, I got your message. I'll reply soon.",
      success: true,
    }
  })
