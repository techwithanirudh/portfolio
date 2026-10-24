import { type BlogPage, getPosts } from './blog'
import { getProjectPages, type ProjectPage } from './projects'

export interface PageEntry {
  description?: string
  tag: 'blog' | 'projects'
  title: string
  url: string
}

const toPageEntry =
  (tag: PageEntry['tag']) =>
  (page: BlogPage | ProjectPage): PageEntry => ({
    description: page.data.description,
    tag,
    title: page.data.title,
    url: page.url,
  })

export const getPageEntries = (): PageEntry[] => [
  ...getPosts().map(toPageEntry('blog')),
  ...getProjectPages().map(toPageEntry('projects')),
]
