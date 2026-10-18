// Kept apart from the action clients so client components can import it
// without pulling in the server-only middleware

/** The message a failed action should show, or the fallback when it has none */
export const getActionErrorMessage = (
  error: { serverError?: unknown },
  fallback: string
) =>
  typeof error.serverError === 'string' && error.serverError
    ? error.serverError
    : fallback
