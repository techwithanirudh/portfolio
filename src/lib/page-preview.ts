export interface PagePreview {
  description: string | null
  image: string | null
  title: string
}

const pagePreviewPattern = /^(\/(?:blog|projects)\/[^/?#]+)\/?(?:[?#].*)?$/

export function getPagePreviewPath(href: string): string | null {
  return pagePreviewPattern.exec(href)?.[1] ?? null
}
