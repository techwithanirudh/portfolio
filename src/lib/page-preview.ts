export interface PagePreview {
  description: string | null
  image: string | null
  title: string
}

export const pagePreviewPattern = /^\/(blog|projects)\/[^/?#]+$/
