export const SIGN_IN_PARAM = 'signin'

export function sanitizeRedirect(redirectTo?: string | null): string {
  if (!redirectTo) {
    return '/'
  }

  const candidate = redirectTo.trim()

  return candidate.startsWith('/') && !candidate.startsWith('//')
    ? candidate
    : '/'
}

// Server-safe link that opens the sign-in modal on the home page,
// e.g. for redirecting signed-out visitors away from protected routes.
export function getSignInUrl(redirectTo?: string): string {
  return `/?${SIGN_IN_PARAM}=${encodeURIComponent(sanitizeRedirect(redirectTo))}`
}
