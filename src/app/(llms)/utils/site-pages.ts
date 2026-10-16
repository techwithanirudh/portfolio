import type { TOCItemType } from 'fumadocs-core/toc'
import { title as siteTitle } from '@/constants/site'
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

export const staticPages: SitePage[] = [
  {
    description:
      'Intro, current role, recent experience, projects, writing and testimonials.',
    path: '/',
    sections: [{ id: 'experience', title: 'Experience preview' }],
    title: 'Home',
  },
  {
    description: 'A bit about who I am and what I do.',
    path: '/about',
    sections: [
      { id: 'story', title: 'Story' },
      { id: 'experience', title: 'Experience' },
      { id: 'stack', title: 'Stack' },
    ],
    title: 'About',
  },
  {
    description: 'Recent projects and collaborations.',
    path: '/projects',
    sections: [],
    title: 'Projects',
  },
  {
    description:
      'Notes on design engineering, full-stack development, AI experiments, and how I built recent projects.',
    path: '/blog',
    sections: [],
    title: 'Blog',
  },
  {
    description: 'Browse blog posts by topic.',
    path: '/blog/tags',
    sections: [],
    title: 'Blog tags',
  },
  {
    description: 'The hardware and software I use every day.',
    path: '/uses',
    sections: [],
    title: 'Uses',
  },
  {
    description: 'The tools, fonts, and people behind this website.',
    path: '/colophon',
    sections: [],
    title: 'Colophon',
  },
  {
    description: 'Contact form, social links and FAQ.',
    path: '/contact',
    sections: [],
    title: 'Contact',
  },
  {
    description: 'Leave a note and react to messages from other visitors.',
    path: '/guestbook',
    sections: [],
    title: 'Guestbook',
  },
  {
    description: 'A printable one-page resume.',
    path: '/resume',
    sections: [],
    title: 'Resume',
  },
  {
    description: `Search posts and projects on ${siteTitle}.`,
    path: '/search',
    sections: [],
    title: 'Search',
  },
]

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
    description: `Blog posts tagged ${tag}.`,
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
