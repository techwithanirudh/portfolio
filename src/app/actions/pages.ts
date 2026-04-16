'use server'

import { getPosts, getWorkPages } from '@/lib/source'

export interface PageEntry {
  description?: string
  tag: 'blog' | 'projects'
  title: string
  url: string
}

export async function getPages(): Promise<PageEntry[]> {
  return [
    ...getPosts().map((page) => ({
      title: page.data.title ?? 'Untitled',
      url: page.url,
      tag: 'blog' as const,
      description: page.data.description,
    })),
    ...getWorkPages().map((page) => ({
      title: page.data.title ?? 'Untitled',
      url: page.url,
      tag: 'projects' as const,
      description: page.data.description,
    })),
  ]
}
