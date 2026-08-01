import { createSearchAPI } from 'fumadocs-core/search/server'
import { getPosts, getWorkPages } from '@/lib/source'

export const { GET } = createSearchAPI('advanced', {
  indexes: [
    ...getPosts().map((page) => ({
      description: page.data.description,
      id: page.url,
      structuredData: page.data.structuredData,
      tag: 'blog',
      title: page.data.title ?? 'Untitled',
      url: page.url,
    })),
    ...getWorkPages().map((page) => ({
      description: page.data.description,
      id: page.url,
      structuredData: page.data.structuredData,
      tag: 'projects',
      title: page.data.title ?? 'Untitled',
      url: page.url,
    })),
  ],
})
