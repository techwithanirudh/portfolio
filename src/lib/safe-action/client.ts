import { createSafeActionClient } from 'next-safe-action'
import { UNEXPECTED_ACTION_ERROR } from './error-message'

export class ActionError extends Error {}

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof ActionError) {
      return e.message
    }

    console.error('Failed to execute action:', e)
    return UNEXPECTED_ACTION_ERROR
  },
})
