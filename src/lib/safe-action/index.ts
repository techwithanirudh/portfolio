import { actionClient } from './client'
import { adminMiddleware, botIdMiddleware, userMiddleware } from './middleware'

export { ActionError, actionClient } from './client'

export const publicActionClient = actionClient.use(botIdMiddleware)

export const userActionClient = publicActionClient.use(userMiddleware)

export const adminActionClient = userActionClient.use(adminMiddleware)
