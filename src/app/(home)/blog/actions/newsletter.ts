'use server'

import { env } from '@/env'
import {
  getContact,
  resend,
  sendWelcomeEmail,
  updateContact,
} from '@/lib/resend'
import { ActionError, publicActionClient } from '@/lib/safe-action'
import { getSortedByDatePosts } from '@/lib/source'
import { NewsletterSchema } from '@/lib/validators/newsletter'
import { getSession } from '@/server/auth'

const NOT_SUBSCRIBED = "You're not subscribed yet. Try again in a few minutes."

export const subscribe = publicActionClient
  .inputSchema(NewsletterSchema)
  .action(async ({ parsedInput: { email } }) => {
    const audienceId = env.RESEND_AUDIENCE_ID

    if (!(resend && audienceId && env.EMAIL_FROM)) {
      console.error(
        'Newsletter unavailable: Resend or the audience env is not configured'
      )
      throw new ActionError(
        'The newsletter is unavailable right now. Try again later.'
      )
    }

    const session = await getSession()
    const [firstName = '', ...lastNames] = (session?.user.name ?? '')
      .split(' ')
      .filter(Boolean)
    const lastName = lastNames.join(' ')

    try {
      const contact = await getContact({ audienceId, email })

      if (contact) {
        await updateContact({
          audienceId,
          email,
          firstName,
          lastName,
          unsubscribed: false,
        })

        return {
          message: "You're already subscribed to the newsletter.",
        }
      }

      const { data, error } = await resend.contacts.create({
        audienceId,
        email,
        firstName,
        lastName,
        unsubscribed: false,
      })

      if (!data || error) {
        console.error('Failed to create newsletter contact:', error)
        throw new ActionError(NOT_SUBSCRIBED)
      }

      const posts = getSortedByDatePosts()
      await sendWelcomeEmail({
        firstName: firstName || 'there',
        posts,
        to: email,
      })

      return {
        message: "You're subscribed. Thanks for signing up!",
      }
    } catch (error) {
      if (error instanceof ActionError) {
        throw error
      }
      console.error('Failed to subscribe:', error)
      throw new ActionError(NOT_SUBSCRIBED)
    }
  })
