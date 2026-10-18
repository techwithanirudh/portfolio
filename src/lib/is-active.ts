function normalize(urlOrPath: string) {
  if (urlOrPath.length > 1 && urlOrPath.endsWith('/')) {
    return urlOrPath.slice(0, -1)
  }
  return urlOrPath
}

// TODO(slopradar): attribution: copied from fumadocs-ui src/utils/urls.ts (not in its exports map) with its JSDoc; add an adapted-from header and drop the JSDoc that restates the name
/**
 * @returns if `href` is matching the given pathname
 */
export function isActive(
  href: string,
  pathname: string,
  nested = true
): boolean {
  const normalizedHref = normalize(href)
  const normalizedPathname = normalize(pathname)

  return (
    normalizedHref === normalizedPathname ||
    (nested && normalizedPathname.startsWith(`${normalizedHref}/`))
  )
}
