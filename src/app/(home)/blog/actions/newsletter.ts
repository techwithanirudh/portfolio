'use server'

import { Resend } from 'resend'
import { env } from '@/env'
import { getContact, sendWelcomeEmail, updateContact } from '@/lib/resend'
import { ActionError, actionClient } from '@/lib/safe-action/client'
import { botIdMiddleware } from '@/lib/safe-action/middleware'
import { getSortedByDatePosts } from '@/lib/source'
import { NewsletterSchema } from '@/lib/validators'
import { getSession } from '@/server/auth'

const resend = new Resend(env.RESEND_API_KEY)
const audienceId = env.RESEND_AUDIENCE_ID

const splitName = (name = '') => {
  const [firstName, ...lastName] = name.split(' ').filter(Boolean)
  return {
    firstName,
    lastName: lastName.join(' '),
  }
}

export const subscribe = actionClient
  .use(botIdMiddleware)
  .inputSchema(NewsletterSchema)
  .action(async ({ parsedInput: { email } }) => {
    const session = await getSession()
    const fullName = session?.user.name || ''
    const { firstName, lastName } = fullName
      ? splitName(fullName)
      : { firstName: '', lastName: '' }

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
          message: 'You are already subscribed to our newsletter!',
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
        message: 'You are now subscribed to our newsletter!',
        success: true,
      }
    } catch (error) {
      console.error('Failed to subscribe:', error)
      if (error instanceof ActionError) {
        throw error
      }
      throw new ActionError('Oops, something went wrong while subscribing.')
    }
  })
