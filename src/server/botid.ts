import 'server-only'

import { checkBotId } from 'botid/server'
import { env } from '@/env'

export const isBotRequest = async () => {
  const verification = await checkBotId({
    developmentOptions:
      env.NODE_ENV !== 'production' && env.BOTID_DEV_BYPASS
        ? {
            bypass: env.BOTID_DEV_BYPASS,
          }
        : undefined,
  })

  return verification.isBot
}
