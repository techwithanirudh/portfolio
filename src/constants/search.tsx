import type { ReactNode } from 'react'
import { Icons } from '@/components/icons/icons'
import { socials } from '@/constants/navigation'

// --------------------------------------------------------------------------
// Item types
// --------------------------------------------------------------------------

interface BaseCommand {
  group: string
  icon?: ReactNode
  id: string
  keywords?: string[]
  title: string
}

export type StaticCommand =
  | (BaseCommand & { kind: 'page'; url: string })
  | (BaseCommand & { kind: 'link'; url: string })
  | (BaseCommand & { kind: 'theme'; theme: 'light' | 'dark' | 'system' })

// --------------------------------------------------------------------------
// Static command registry
// --------------------------------------------------------------------------

export const COMMANDS: StaticCommand[] = [
  // Navigation
  {
    kind: 'page',
    id: 'nav-about',
    title: 'About',
    url: '/about',
    group: 'Navigation',
    icon: <Icons.user className='size-4' />,
  },
  {
    kind: 'page',
    id: 'nav-contact',
    title: 'Contact',
    url: '/contact',
    group: 'Navigation',
    icon: <Icons.mail className='size-4' />,
  },
  {
    kind: 'page',
    id: 'nav-guestbook',
    title: 'Guestbook',
    url: '/guestbook',
    group: 'Navigation',
    icon: <Icons.messageSquare className='size-4' />,
  },
  {
    kind: 'page',
    id: 'nav-work',
    title: 'Work',
    url: '/work',
    group: 'Navigation',
    icon: <Icons.work className='size-4' />,
  },
  {
    kind: 'page',
    id: 'nav-blog',
    title: 'Blog',
    url: '/blog',
    group: 'Navigation',
    icon: <Icons.blog className='size-4' />,
  },

  // Socials
  ...socials.map((s) => ({
    kind: 'link' as const,
    id: `social-${s.name.toLowerCase()}`,
    title: s.name,
    url: s.url,
    group: 'Socials',
    icon: s.icon,
  })),

  // Links
  {
    kind: 'link',
    id: 'link-rss',
    title: 'RSS Feed',
    url: '/rss.xml',
    group: 'Links',
    icon: <Icons.rss className='size-4' />,
  },
  {
    kind: 'link',
    id: 'link-llms',
    title: 'LLMs.txt',
    url: '/llms.txt',
    group: 'Links',
    icon: <Icons.post className='size-4' />,
  },
  {
    kind: 'link',
    id: 'link-sitemap',
    title: 'Sitemap',
    url: '/sitemap.xml',
    group: 'Links',
    icon: <Icons.post className='size-4' />,
  },
  {
    kind: 'page',
    id: 'link-colophon',
    title: 'Colophon',
    url: '/colophon',
    group: 'Links',
    icon: <Icons.post className='size-4' />,
  },

  // Theme
  {
    kind: 'theme',
    id: 'theme-light',
    title: 'Light',
    theme: 'light',
    group: 'Theme',
    icon: <Icons.sun className='size-4' />,
    keywords: ['theme', 'appearance'],
  },
  {
    kind: 'theme',
    id: 'theme-dark',
    title: 'Dark',
    theme: 'dark',
    group: 'Theme',
    icon: <Icons.moon className='size-4' />,
    keywords: ['theme', 'appearance'],
  },
  {
    kind: 'theme',
    id: 'theme-system',
    title: 'System',
    theme: 'system',
    group: 'Theme',
    icon: <Icons.desktop className='size-4' />,
    keywords: ['theme', 'auto', 'appearance'],
  },
]

// --------------------------------------------------------------------------
// Meta map for footer hint (derived from COMMANDS)
// --------------------------------------------------------------------------

export type CommandKind = 'command' | 'page' | 'link'

export const COMMAND_META_MAP = new Map<string, CommandKind>(
  COMMANDS.map((cmd) => [
    cmd.id,
    cmd.kind === 'theme' ? 'command' : cmd.kind === 'link' ? 'link' : 'page',
  ])
)
