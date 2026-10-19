// Adapted from fumadocs-ui src/utils/urls.ts, which its exports map doesn't expose

function normalize(urlOrPath: string) {
  if (urlOrPath.length > 1 && urlOrPath.endsWith('/')) {
    return urlOrPath.slice(0, -1)
  }
  return urlOrPath
}

export function isActive(
  href: string,
  pathname: string,
  { nested = true }: { nested?: boolean } = {}
): boolean {
  const normalizedHref = normalize(href)
  const normalizedPathname = normalize(pathname)

  return (
    normalizedHref === normalizedPathname ||
    (nested && normalizedPathname.startsWith(`${normalizedHref}/`))
  )
}

export { isLinkItemActive } from 'fumadocs-ui/layouts/shared'
