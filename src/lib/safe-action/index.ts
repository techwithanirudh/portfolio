import { actionClient } from './client'
import { adminMiddleware, botIdMiddleware, userMiddleware } from './middleware'

export { ActionError, actionClient } from './client'
export type { ActionContext } from './middleware'
export {
  adminMiddleware,
  botIdMiddleware,
  userMiddleware,
} from './middleware'

export const userActionClient = actionClient
  .use(botIdMiddleware)
  .use(userMiddleware)

export const adminActionClient = userActionClient.use(adminMiddleware)
