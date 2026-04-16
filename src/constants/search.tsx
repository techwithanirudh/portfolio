import { Icons } from '@/components/icons/icons'
import { socials } from '@/constants/navigation'
import type { CommandGroup, CommandKind } from '@/types/search'

export const commands: CommandGroup[] = [
  {
    group: 'Navigation',
    items: [
      {
        kind: 'page',
        title: 'About',
        url: '/about',
        icon: <Icons.user className='size-4' />,
      },
      {
        kind: 'page',
        title: 'Contact',
        url: '/contact',
        icon: <Icons.mail className='size-4' />,
      },
      {
        kind: 'page',
        title: 'Guestbook',
        url: '/guestbook',
        icon: <Icons.messageSquare className='size-4' />,
      },
      {
        kind: 'page',
        title: 'Work',
        url: '/work',
        icon: <Icons.work className='size-4' />,
      },
      {
        kind: 'page',
        title: 'Blog',
        url: '/blog',
        icon: <Icons.blog className='size-4' />,
      },
    ],
  },
  {
    group: 'Socials',
    items: socials.map((s) => ({
      kind: 'link' as const,
      title: s.name,
      url: s.url,
      icon: s.icon,
    })),
  },
  {
    group: 'Links',
    items: [
      {
        kind: 'link',
        title: 'RSS Feed',
        url: '/rss.xml',
        icon: <Icons.rss className='size-4' />,
      },
      {
        kind: 'link',
        title: 'LLMs.txt',
        url: '/llms.txt',
        icon: <Icons.post className='size-4' />,
      },
      {
        kind: 'link',
        title: 'Sitemap',
        url: '/sitemap.xml',
        icon: <Icons.post className='size-4' />,
      },
      {
        kind: 'page',
        title: 'Colophon',
        url: '/colophon',
        icon: <Icons.post className='size-4' />,
      },
    ],
  },
  {
    group: 'Theme',
    items: [
      {
        kind: 'theme',
        title: 'Light',
        theme: 'light',
        icon: <Icons.sun className='size-4' />,
        keywords: ['theme', 'appearance'],
      },
      {
        kind: 'theme',
        title: 'Dark',
        theme: 'dark',
        icon: <Icons.moon className='size-4' />,
        keywords: ['theme', 'appearance'],
      },
      {
        kind: 'theme',
        title: 'System',
        theme: 'system',
        icon: <Icons.desktop className='size-4' />,
        keywords: ['theme', 'auto', 'appearance'],
      },
    ],
  },
]

export const COMMAND_META_MAP = new Map<string, CommandKind>(
  commands.flatMap(({ items }) =>
    items.map((item) => [
      item.title,
      item.kind === 'theme'
        ? 'command'
        : item.kind === 'link'
          ? 'link'
          : 'page',
    ])
  )
)
