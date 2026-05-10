import { getPosts, getWorkPages } from '@/lib/source'

export interface PageEntry {
  description?: string
  tag: 'blog' | 'projects'
  title: string
  url: string
}

// Regular server-side utility — returns only public page metadata, no auth needed.
// Not a server action ('use server' removed) since this is called from server components.
export function getPages(): PageEntry[] {
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
