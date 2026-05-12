import type { ResolvedSearchTag } from '@/types/search/results'

export const searchTagOrder: ResolvedSearchTag[] = ['blog', 'projects', 'other']

const searchTagLabels: Record<ResolvedSearchTag, string> = {
  blog: 'Blog',
  other: 'Other',
  projects: 'Projects',
}

export function getSearchTagLabel(tag: string) {
  return searchTagLabels[tag as ResolvedSearchTag] ?? tag
}
