import { baseUrl } from './metadata'

export const url = (path: string | string[]): string => {
  const pathname = Array.isArray(path) ? `/${path.join('/')}` : path
  return new URL(pathname, baseUrl).toString()
}

const relativeMarkdownLink = /\]\((\/[^)\s]*)\)/g

/** Turns `[label](/path)` links into absolute URLs for text read off site */
export const absoluteMarkdownLinks = (markdown: string) =>
  markdown.replace(relativeMarkdownLink, (_, path: string) => `](${url(path)})`)
