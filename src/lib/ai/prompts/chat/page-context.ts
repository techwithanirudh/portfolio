type PageContext = {
  pathname?: string
}

export const pageContextPrompt = (pageContext?: PageContext): string => {
  const pathname = pageContext?.pathname?.trim()

  if (!pathname) {
    return ''
  }

  const parts = ['<page-context>']

  if (pathname) {
    parts.push(`<pathname>${pathname}</pathname>`)
  }

  parts.push('</page-context>')

  return parts.join('\n')
}
