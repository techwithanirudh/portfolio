import { getPosts } from './blog'
import { getWorkPages } from './work'

export interface PageEntry {
  description?: string
  tag: 'blog' | 'projects'
  title: string
  url: string
}

export const getPageEntries = (): PageEntry[] => [
  ...getPosts().map((page) => ({
    description: page.data.description,
    tag: 'blog' as const,
    title: page.data.title ?? 'Untitled',
    url: page.url,
  })),
  ...getWorkPages().map((page) => ({
    description: page.data.description,
    tag: 'projects' as const,
    title: page.data.title ?? 'Untitled',
    url: page.url,
  })),
]
