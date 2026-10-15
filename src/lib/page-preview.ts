export interface PagePreview {
  description: string | null
  image: string | null
  title: string
}

// Internal pages that have a hover preview (a single post or project)
export const pagePreviewPattern = /^\/(blog|work)\/[^/?#]+$/
