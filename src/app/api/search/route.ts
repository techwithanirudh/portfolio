import { createSearchAPI } from 'fumadocs-core/search/server'
import {
  type BlogPage,
  getPosts,
  getWorkPages,
  type WorkPage,
} from '@/lib/source'

const toIndex = (tag: 'blog' | 'projects') => (page: BlogPage | WorkPage) => ({
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
    ...getWorkPages().map(toIndex('projects')),
  ],
})
