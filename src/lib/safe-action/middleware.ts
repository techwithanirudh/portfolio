import type { MiddlewareFn } from 'next-safe-action'
import { getSession } from '@/server/auth'
import { isBotRequest } from '@/server/botid'
import { ActionError } from './client'

type SessionUser = NonNullable<Awaited<ReturnType<typeof getSession>>>['user']

export interface ActionContext {
  user: SessionUser
}

type BotIdMiddleware = MiddlewareFn<string, undefined, object, object>
type UserMiddleware = MiddlewareFn<string, undefined, object, ActionContext>

export const botIdMiddleware: BotIdMiddleware = async ({ next }) => {
  if (await isBotRequest()) {
    throw new ActionError(
      'Bot protection blocked this request. Please refresh and try again.'
    )
  }

  return next()
}

export const userMiddleware: UserMiddleware = async ({ ctx, next }) => {
  const session = await getSession()
  const user = session?.user

  if (!user) {
    throw new ActionError('You must be signed in to do that.')
  }

  return next({
    ctx: {
      ...ctx,
      user,
    },
  })
}
