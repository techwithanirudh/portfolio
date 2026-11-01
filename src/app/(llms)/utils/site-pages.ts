import { type PageInfo, pages, sectionIds } from '@/constants/pages'
import {
  type BlogPage,
  getSortedByDatePosts,
  getSortedProjects,
  getTags,
  type ProjectPage,
} from '@/lib/source'

interface SiteSection {
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
  [pages.home.path]: [
    { id: sectionIds.experience, title: 'Experience preview' },
  ],
  [pages.about.path]: [
    { id: sectionIds.story, title: 'Story' },
    { id: sectionIds.experience, title: 'Experience' },
    { id: sectionIds.stack, title: 'Stack' },
    { id: sectionIds.activity, title: 'Activity' },
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

export const LEADING_HASH = /^#/

const toSitePage = (page: BlogPage | ProjectPage): SitePage => ({
  description: page.data.description ?? '',
  path: page.url,
  sections: page.data.toc.map((item) => {
    const id = item.url.replace(LEADING_HASH, '')
    return { id, title: typeof item.title === 'string' ? item.title : id }
  }),
  title: page.data.title,
})

export const getSitePages = (): SitePage[] => [
  ...staticPages,
  ...getSortedProjects().map(toSitePage),
  ...getSortedByDatePosts().map(toSitePage),
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
