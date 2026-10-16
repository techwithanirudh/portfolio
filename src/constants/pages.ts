import {
  owner,
  description as siteDescription,
  title as siteTitle,
} from './site'

export interface PageInfo {
  description: string
  path: string
  /** What the page holds, for the llms site map when it differs from the description */
  summary?: string
  title: string
}

export const pages = {
  about: {
    description: 'A bit about who I am and what I do.',
    path: '/about',
    title: 'About',
  },
  blog: {
    description:
      'Notes on design engineering, full-stack development, AI experiments, and how I built recent projects.',
    path: '/blog',
    title: 'Blog',
  },
  blogTags: {
    description: 'Browse blog posts by topic.',
    path: '/blog/tags',
    title: 'Tags',
  },
  colophon: {
    description: 'The tools, fonts, and people behind this website.',
    path: '/colophon',
    title: 'Colophon',
  },
  contact: {
    description: 'Contact me with questions or feedback.',
    path: '/contact',
    summary: 'Contact form, social links and FAQ.',
    title: 'Contact',
  },
  guestbook: {
    description: 'Leave a note and react to messages from other visitors.',
    path: '/guestbook',
    title: 'Guestbook',
  },
  home: {
    description: siteDescription,
    path: '/',
    summary:
      'Intro, current role, recent experience, projects, writing and testimonials.',
    title: 'Home',
  },
  projects: {
    description: 'Recent projects and collaborations.',
    path: '/projects',
    title: 'Projects',
  },
  resume: {
    description: `Resume of ${owner}: experience, selected projects and stack.`,
    path: '/resume',
    summary: 'A printable one-page resume.',
    title: 'Resume',
  },
  search: {
    description: `Search posts and projects on ${siteTitle}.`,
    path: '/search',
    title: 'Search',
  },
  uses: {
    description: 'The hardware and software I use every day.',
    path: '/uses',
    title: 'Uses',
  },
} satisfies Record<string, PageInfo>
