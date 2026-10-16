import { actionClient } from './client'
import { adminMiddleware, botIdMiddleware, userMiddleware } from './middleware'

export { ActionError, actionClient } from './client'
export type { ActionContext } from './middleware'
export {
  adminMiddleware,
  botIdMiddleware,
  userMiddleware,
} from './middleware'

// Anyone may call these, but bots are turned away
export const publicActionClient = actionClient.use(botIdMiddleware)

export const userActionClient = publicActionClient.use(userMiddleware)

export const adminActionClient = userActionClient.use(adminMiddleware)
