import { createSafeActionClient } from 'next-safe-action'
import { UNEXPECTED_ACTION_ERROR } from './error-message'

export class ActionError extends Error {}

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error('Failed to execute action:', e.message)

    if (e instanceof ActionError) {
      return e.message
    }

    return UNEXPECTED_ACTION_ERROR
  },
})
