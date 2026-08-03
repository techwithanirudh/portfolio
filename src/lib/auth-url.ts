export function getLoginUrl(redirectTo?: string): string {
  if (!redirectTo) {
    return '/login'
  }

  const safe =
    redirectTo.startsWith('/') && !redirectTo.startsWith('//')
      ? redirectTo
      : '/'

  return `/login?redirectTo=${encodeURIComponent(safe)}`
}
