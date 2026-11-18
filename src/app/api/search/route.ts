import { createSearchAPI } from 'fumadocs-core/search/server'
import {
  type BlogPage,
  getPosts,
  getProjectPages,
  type ProjectPage,
} from '@/lib/source'

const toIndex =
  (tag: 'blog' | 'projects') => (page: BlogPage | ProjectPage) => ({
    description: page.data.description,
    id: page.url,
    structuredData: page.data.structuredData,
    tag,
    title: page.data.title,
    url: page.url,
  })

export const { GET } = createSearchAPI('advanced', {
  indexes: [
    ...getPosts().map(toIndex('blog')),
    ...getProjectPages().map(toIndex('projects')),
  ],
})
