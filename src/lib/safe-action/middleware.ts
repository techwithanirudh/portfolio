import { createMiddleware } from 'next-safe-action'
import { getSession, type SessionUser } from '@/server/auth'
import { isBotRequest } from '@/server/botid'
import { ActionError } from './client'

interface ActionContext {
  user: SessionUser
}

export const botIdMiddleware = createMiddleware().define(async ({ next }) => {
  if (await isBotRequest()) {
    throw new ActionError(
      'Bot protection blocked this request. Refresh the page and try again.'
    )
  }

  return next()
})

export const userMiddleware = createMiddleware().define(async ({ next }) => {
  const session = await getSession()
  const user = session?.user

  if (!user) {
    throw new ActionError('Sign in to do that.')
  }

  return next({ ctx: { user } satisfies ActionContext })
})

export const adminMiddleware = createMiddleware<{
  ctx: ActionContext
}>().define(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new ActionError('Only admins can do that.')
  }

  return next()
})
