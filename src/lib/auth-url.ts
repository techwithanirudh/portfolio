export const SIGN_IN_PARAM = 'signin'

export function sanitizeRedirect(redirectTo?: string | null): string {
  if (!redirectTo) {
    return '/'
  }

  const candidate = redirectTo.trim()

  return candidate.startsWith('/') &&
    !candidate.startsWith('//') &&
    !candidate.startsWith('/\\')
    ? candidate
    : '/'
}

export function getSignInUrl(redirectTo?: string): string {
  return `/?${SIGN_IN_PARAM}=${encodeURIComponent(sanitizeRedirect(redirectTo))}`
}
