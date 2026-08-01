'use server'

import { getPosts, getWorkPages } from '@/lib/source'

export interface PageEntry {
  description?: string
  tag: 'blog' | 'projects'
  title: string
  url: string
}

// biome-ignore lint: server action must be async
export async function getPages(): Promise<PageEntry[]> {
  return [
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
}
