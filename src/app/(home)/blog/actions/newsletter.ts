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
import { NewsletterSchema } from '@/lib/validators'
import { getSession } from '@/server/auth'

const splitName = (name = '') => {
  const [firstName, ...lastName] = name.split(' ').filter(Boolean)
  return {
    firstName: firstName ?? '',
    lastName: lastName.join(' '),
  }
}

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
    const { firstName, lastName } = splitName(session?.user.name)

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
          success: true,
        }
      }

      const { data, error } = await resend.contacts.create({
        audienceId,
        email,
        firstName,
        lastName,
        unsubscribed: false,
      })

      // TODO(slopradar): inconsistent-error-handling: throws a plain Error only for its own catch to rewrap, throw ActionError here and let unexpected errors reach the safe-action handler
      if (!data || error) {
        throw new Error(
          `Failed to create contact: ${error?.message || 'Unknown error'}`
        )
      }

      const posts = getSortedByDatePosts()
      await sendWelcomeEmail({
        firstName: firstName || 'there',
        posts,
        to: email,
      })

      return {
        message: "You're subscribed. Thanks for signing up!",
        success: true,
      }
    } catch (error) {
      console.error('Failed to subscribe:', error)
      if (error instanceof ActionError) {
        throw error
      }
      throw new ActionError(
        "You're not subscribed yet. Try again in a few minutes."
      )
    }
  })
