import type { TOCItemType } from 'fumadocs-core/toc'
import { type PageInfo, pages } from '@/constants/pages'
import { getSortedByDatePosts, getSortedWork, getTags } from '@/lib/source'

export interface SiteSection {
  id: string
  title: string
}

export interface SitePage {
  description: string
  path: string
  sections: SiteSection[]
  title: string
}

const sectionsByPath: Record<string, SiteSection[]> = {
  '/': [{ id: 'experience', title: 'Experience preview' }],
  '/about': [
    { id: 'story', title: 'Story' },
    { id: 'experience', title: 'Experience' },
    { id: 'stack', title: 'Stack' },
    { id: 'activity', title: 'Activity' },
  ],
}

const pageOrder: PageInfo[] = [
  pages.home,
  pages.about,
  pages.projects,
  pages.blog,
  pages.uses,
  pages.colophon,
  pages.contact,
  pages.guestbook,
  pages.resume,
  pages.search,
]

export const staticPages: SitePage[] = pageOrder.map((page) => ({
  description: page.summary ?? page.description,
  path: page.path,
  sections: sectionsByPath[page.path] ?? [],
  title: page.title,
}))

const LEADING_HASH = /^#/

const tocSections = (toc: TOCItemType[]): SiteSection[] =>
  toc.map((item) => {
    const id = item.url.replace(LEADING_HASH, '')
    return { id, title: typeof item.title === 'string' ? item.title : id }
  })

export const getSitePages = (): SitePage[] => [
  ...staticPages,
  ...getSortedWork().map((page) => ({
    description: page.data.description ?? '',
    path: page.url,
    sections: tocSections(page.data.toc),
    title: page.data.title ?? 'Untitled',
  })),
  ...getSortedByDatePosts().map((page) => ({
    description: page.data.description ?? '',
    path: page.url,
    sections: tocSections(page.data.toc),
    title: page.data.title ?? 'Untitled',
  })),
  ...getTags().map((tag) => ({
    description: `The blog filtered to posts tagged ${tag}, grouped by year.`,
    path: `/blog/tags/${tag}`,
    sections: [],
    title: `Tag: ${tag}`,
  })),
]

export function getSiteMapText() {
  return `# Site map
Paths a visitor can be taken to. Section ids follow a #.

${getSitePages()
  .map((page) => {
    const sections = page.sections.length
      ? ` Sections: ${page.sections.map((section) => `#${section.id}`).join(', ')}`
      : ''
    return `- ${page.path} (${page.title}): ${page.description}${sections}`
  })
  .join('\n')}
`
}
