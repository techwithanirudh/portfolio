import { Icons } from '@/components/icons/icons'
import { socials } from '@/constants/navigation'
import type { CommandGroup, CommandKind } from '@/types/search'

export const commands: CommandGroup[] = [
  {
    group: 'Portfolio',
    items: [
      {
        icon: <Icons.user className='size-4' />,
        kind: 'page',
        title: 'About',
        url: '/about',
      },
      {
        icon: <Icons.mail className='size-4' />,
        kind: 'page',
        title: 'Contact',
        url: '/contact',
      },
      {
        icon: <Icons.messageSquare className='size-4' />,
        kind: 'page',
        title: 'Guestbook',
        url: '/guestbook',
      },
      {
        icon: <Icons.work className='size-4' />,
        kind: 'page',
        title: 'Work',
        url: '/work',
      },
      {
        icon: <Icons.blog className='size-4' />,
        kind: 'page',
        title: 'Blog',
        url: '/blog',
      },
      {
        icon: <Icons.wrench className='size-4' />,
        kind: 'page',
        title: 'Uses',
        url: '/uses',
      },
      {
        icon: <Icons.post className='size-4' />,
        kind: 'page',
        title: 'Colophon',
        url: '/colophon',
      },
    ],
  },
  {
    group: 'Socials',
    items: socials.map((s) => ({
      icon: s.icon,
      kind: 'link' as const,
      title: s.name,
      url: s.url,
    })),
    position: 'after',
  },
  {
    group: 'Theme',
    items: [
      {
        icon: <Icons.sun className='size-4' />,
        keywords: ['theme', 'appearance'],
        kind: 'theme',
        theme: 'light',
        title: 'Light',
      },
      {
        icon: <Icons.moon className='size-4' />,
        keywords: ['theme', 'appearance'],
        kind: 'theme',
        theme: 'dark',
        title: 'Dark',
      },
      {
        icon: <Icons.desktop className='size-4' />,
        keywords: ['theme', 'auto', 'appearance'],
        kind: 'theme',
        theme: 'system',
        title: 'System',
      },
    ],
    position: 'after',
  },
  {
    group: 'Others',
    items: [
      {
        icon: <Icons.rss className='size-4' />,
        kind: 'link',
        title: 'RSS Feed',
        url: '/rss.xml',
      },
      {
        icon: <Icons.post className='size-4' />,
        kind: 'link',
        title: 'LLMs.txt',
        url: '/llms.txt',
      },
      {
        icon: <Icons.post className='size-4' />,
        kind: 'link',
        title: 'Sitemap',
        url: '/sitemap.xml',
      },
    ],
    position: 'after',
  },
]

export const COMMAND_META_MAP = new Map<string, CommandKind>(
  commands.flatMap(({ items }) =>
    items.map((item) => {
      let kind: CommandKind = 'page'

      if (item.kind === 'theme') {
        kind = 'command'
      }

      if (item.kind === 'link') {
        kind = 'link'
      }

      return [item.title, kind]
    })
  )
)
