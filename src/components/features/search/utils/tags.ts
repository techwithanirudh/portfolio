import { Icons } from '@/components/icons/icons'
import type { SvgIcon } from '@/components/icons/utils'
import { pages } from '@/constants/pages'

interface SearchTag {
  heading: string
  icon: SvgIcon
  path: string
}

const searchTags = {
  blog: { heading: pages.blog.title, icon: Icons.blog, path: pages.blog.path },
  projects: {
    heading: pages.projects.title,
    icon: Icons.work,
    path: pages.projects.path,
  },
} satisfies Record<string, SearchTag>

const isSearchTag = (tag: string): tag is keyof typeof searchTags =>
  Object.hasOwn(searchTags, tag)

export const TAG_ORDER = Object.keys(searchTags)

export const getTagMeta = (tag: string) =>
  isSearchTag(tag) ? searchTags[tag] : { heading: 'Pages', icon: Icons.page }

export const tagFromUrl = (url: string) =>
  Object.entries(searchTags).find(
    ([, meta]) => url === meta.path || url.startsWith(`${meta.path}/`)
  )?.[0] ?? 'other'
