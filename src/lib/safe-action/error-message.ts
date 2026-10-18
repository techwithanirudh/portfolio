/** What an unexpected throw (not an `ActionError`) sends back to the client */
export const UNEXPECTED_ACTION_ERROR =
  "That didn't go through. Check your connection and try again."

/**
 * The action's own message, or the form's fallback when it has none. The
 * fallback also wins over the generic unexpected error, since it can say
 * what failed
 */
export const getActionErrorMessage = (
  error: { serverError?: unknown },
  fallback: string
) =>
  typeof error.serverError === 'string' &&
  error.serverError &&
  error.serverError !== UNEXPECTED_ACTION_ERROR
    ? error.serverError
    : fallback
