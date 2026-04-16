import { Icons } from '@/components/icons/icons'
import { socials } from '@/constants/navigation'

export type CommandItemKind = 'command' | 'page' | 'link'

export interface CommandLinkItem {
  icon?: React.ReactNode
  keywords?: string[]
  kind?: CommandItemKind
  openInNewTab?: boolean
  title: string
  url: string
}

export const NAV_ITEMS: CommandLinkItem[] = [
  { title: 'About', url: '/about', icon: <Icons.user className='size-4' /> },
  {
    title: 'Contact',
    url: '/contact',
    icon: <Icons.mail className='size-4' />,
  },
  {
    title: 'Guestbook',
    url: '/guestbook',
    icon: <Icons.messageSquare className='size-4' />,
  },
  { title: 'Work', url: '/work', icon: <Icons.work className='size-4' /> },
  { title: 'Blog', url: '/blog', icon: <Icons.blog className='size-4' /> },
]

export const SOCIAL_ITEMS: CommandLinkItem[] = socials.map((s) => ({
  title: s.name,
  url: s.url,
  icon: s.icon,
  openInNewTab: true,
  kind: 'link' as const,
}))

export const EXTRA_ITEMS: CommandLinkItem[] = [
  {
    title: 'RSS Feed',
    url: '/rss.xml',
    icon: <Icons.rss className='size-4' />,
    openInNewTab: true,
    kind: 'link',
  },
  {
    title: 'LLMs.txt',
    url: '/llms.txt',
    icon: <Icons.post className='size-4' />,
    openInNewTab: true,
    kind: 'link',
  },
  {
    title: 'Sitemap',
    url: '/sitemap.xml',
    icon: <Icons.post className='size-4' />,
    openInNewTab: true,
    kind: 'link',
  },
  {
    title: 'Colophon',
    url: '/colophon',
    icon: <Icons.post className='size-4' />,
  },
]

export const THEME_ITEMS = [
  {
    value: 'theme-light',
    label: 'Light',
    theme: 'light' as const,
    icon: <Icons.sun className='size-4' />,
    keywords: ['theme', 'light', 'appearance'],
  },
  {
    value: 'theme-dark',
    label: 'Dark',
    theme: 'dark' as const,
    icon: <Icons.moon className='size-4' />,
    keywords: ['theme', 'dark', 'appearance'],
  },
  {
    value: 'theme-system',
    label: 'System',
    theme: 'system' as const,
    icon: <Icons.desktop className='size-4' />,
    keywords: ['theme', 'system', 'auto', 'appearance'],
  },
]

function buildCommandMetaMap() {
  const map = new Map<string, CommandItemKind>()

  for (const item of THEME_ITEMS) {
    map.set(item.value, 'command')
  }

  for (const item of SOCIAL_ITEMS) {
    map.set(item.title, 'link')
  }

  for (const item of EXTRA_ITEMS) {
    map.set(item.title, item.kind ?? 'page')
  }

  return map
}

export const COMMAND_META_MAP = buildCommandMetaMap()
