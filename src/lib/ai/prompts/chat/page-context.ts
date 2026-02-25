type PageContext = {
  pathname?: string
}

const escapeXml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

export const pageContextPrompt = (pageContext?: PageContext): string => {
  if (!pageContext) {
    return ''
  }

  const pathname = pageContext.pathname?.trim()
  if (!pathname) {
    return ''
  }

  const parts = ['<page-context>']

  if (pathname) {
    parts.push(`<pathname>${escapeXml(pathname)}</pathname>`)
  }

  parts.push('</page-context>')

  return parts.join('\n')
}
