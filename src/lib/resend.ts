import { Resend, type UpdateContactOptions } from 'resend'
import { env } from '@/env'
import { retryWithBackoff } from '@/lib/retry'
import { url } from '@/lib/url'
import NewsletterWelcomeEmail from '../../emails/newsletter-welcome'
import type { getPosts } from './source'

export const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null

const requireResend = () => {
  if (!resend) {
    throw new Error('RESEND_API_KEY is not set.')
  }

  return resend
}

export async function updateContact({
  email,
  audienceId,
  ...props
}: {
  email: string
  audienceId: string
} & Omit<UpdateContactOptions, 'email' | 'audienceId' | 'id'>) {
  const { data, error } = await requireResend().contacts.update({
    audienceId,
    email,
    ...props,
  })

  if (error) {
    if (error.name === 'not_found') {
      return null
    }
    throw new Error(`Failed to update contact: ${error.message}`)
  }

  if (!data) {
    throw new Error('Failed to update contact: Resend returned no data.')
  }

  return data
}

export async function getContact({
  email,
  audienceId,
}: {
  email: string
  audienceId: string
}) {
  const { data, error } = await requireResend().contacts.get({
    audienceId,
    email,
  })

  if (error) {
    if (error.name === 'not_found') {
      return null
    }
    throw new Error(`Failed to get contact: ${error.message}`)
  }

  return data
}

export async function sendWelcomeEmail({
  posts,
  firstName,
  to,
}: {
  posts: ReturnType<typeof getPosts>
  firstName: string
  to: string
}) {
  const from = env.EMAIL_FROM

  if (!(from && firstName && to)) {
    throw new Error('Missing required email fields')
  }

  const client = requireResend()

  const formattedPosts = posts.map((post) => ({
    ...post.data,
    image: post.data.image ? url(post.data.image) : undefined,
    url: url(post.url),
  }))

  try {
    await retryWithBackoff(
      async () => {
        const { error } = await client.emails.send({
          from,
          react: NewsletterWelcomeEmail({ firstName, posts: formattedPosts }),
          subject: 'Welcome to my newsletter',
          to,
        })

        if (error) {
          throw error
        }
      },
      {
        attempts: 3,
        baseDelayMs: 650,
        shouldRetry: isRateLimitError,
      }
    )
  } catch (error) {
    if (isRateLimitError(error)) {
      return { reason: 'rate_limit_exceeded' as const, sent: false }
    }

    throw new Error(`Failed to send welcome email: ${JSON.stringify(error)}`, {
      cause: error,
    })
  }

  return { sent: true }
}

const isRateLimitError = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return false
  }

  return (
    ('name' in error && error.name === 'rate_limit_exceeded') ||
    ('statusCode' in error && error.statusCode === 429)
  )
}
