export interface PagePreview {
  description: string | null
  image: string | null
  title: string
}

const pagePreviewPattern = /^(\/(?:blog|projects)\/[^/?#]+)\/?(?:[?#].*)?$/

/** Returns the pathname when `href` points at a page that has a preview card. */
export function getPagePreviewPath(href: string): string | null {
  return pagePreviewPattern.exec(href)?.[1] ?? null
}
