import { Icons } from '@/components/icons/icons'
import type { SvgIcon } from '@/components/icons/utils'
import { pages } from '@/constants/pages'

interface SearchTag {
  heading: string
  icon: SvgIcon
  path: string
}

const searchTags: Partial<Record<string, SearchTag>> = {
  blog: { heading: pages.blog.title, icon: Icons.blog, path: pages.blog.path },
  projects: {
    heading: pages.projects.title,
    icon: Icons.work,
    path: pages.projects.path,
  },
}

const otherTag: Omit<SearchTag, 'path'> = { heading: 'Pages', icon: Icons.page }

export const TAG_ORDER = Object.keys(searchTags)

export const getTagMeta = (tag: string) => searchTags[tag] ?? otherTag

export const tagFromUrl = (url: string) =>
  Object.entries(searchTags).find(
    ([, meta]) => meta && (url === meta.path || url.startsWith(`${meta.path}/`))
  )?.[0] ?? 'other'
