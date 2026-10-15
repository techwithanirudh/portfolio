/** Query param on `/` that tells the client to open the sign-in modal. */
export const SIGN_IN_PARAM = 'signin'

export function sanitizeRedirect(value: string): string {
  const candidate = value.trim()

  return candidate.startsWith('/') && !candidate.startsWith('//')
    ? candidate
    : '/'
}

/** URL for server-side redirects that should land on a page with the sign-in modal open. */
export function getSignInUrl(redirectTo?: string): string {
  if (!redirectTo) {
    return `/?${SIGN_IN_PARAM}=%2F`
  }

  return `/?${SIGN_IN_PARAM}=${encodeURIComponent(sanitizeRedirect(redirectTo))}`
}
