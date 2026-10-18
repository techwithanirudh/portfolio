import { type BlogPage, getPosts } from './blog'
import { getWorkPages, type WorkPage } from './work'

export interface PageEntry {
  description?: string
  tag: 'blog' | 'projects'
  title: string
  url: string
}

const toPageEntry =
  (tag: PageEntry['tag']) =>
  (page: BlogPage | WorkPage): PageEntry => ({
    description: page.data.description,
    tag,
    title: page.data.title,
    url: page.url,
  })

export const getPageEntries = (): PageEntry[] => [
  ...getPosts().map(toPageEntry('blog')),
  ...getWorkPages().map(toPageEntry('projects')),
]
