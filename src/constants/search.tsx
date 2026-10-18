import { Icons } from '@/components/icons/icons'
import { socials } from '@/constants/navigation'
import { pages } from '@/constants/pages'
import type { CommandGroup, CommandItem, CommandKind } from '@/types/search'

export const commands: CommandGroup[] = [
  {
    group: 'Portfolio',
    items: [
      {
        icon: <Icons.user className='size-4' />,
        kind: 'page',
        title: pages.about.title,
        url: pages.about.path,
      },
      {
        icon: <Icons.experience className='size-4' />,
        kind: 'page',
        title: 'Experience',
        url: `${pages.about.path}#experience`,
      },
      {
        icon: <Icons.download className='size-4' />,
        keywords: ['cv', 'pdf'],
        kind: 'page',
        title: pages.resume.title,
        url: pages.resume.path,
      },
      {
        icon: <Icons.mail className='size-4' />,
        kind: 'page',
        title: pages.contact.title,
        url: pages.contact.path,
      },
      {
        icon: <Icons.messageSquare className='size-4' />,
        kind: 'page',
        title: pages.guestbook.title,
        url: pages.guestbook.path,
      },
      {
        icon: <Icons.work className='size-4' />,
        kind: 'page',
        title: pages.projects.title,
        url: pages.projects.path,
      },
      {
        icon: <Icons.blog className='size-4' />,
        kind: 'page',
        title: pages.blog.title,
        url: pages.blog.path,
      },
      {
        icon: <Icons.wrench className='size-4' />,
        kind: 'page',
        title: pages.uses.title,
        url: pages.uses.path,
      },
      {
        icon: <Icons.post className='size-4' />,
        kind: 'page',
        title: pages.colophon.title,
        url: pages.colophon.path,
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
    group: 'Preferences',
    items: [
      {
        icon: <Icons.volumeOn className='size-4' />,
        keywords: ['sound', 'audio', 'mute', 'unmute', 'volume'],
        kind: 'sound',
        title: 'Toggle sound',
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
        title: 'RSS feed',
        // TODO(slopradar): magic-string: '/rss.xml' only works through the next.config redirect, while metadata.ts advertises '/blog/rss.xml'; export one feed path constant and use it in both
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

const commandKinds: Record<CommandItem['kind'], CommandKind> = {
  account: 'page',
  link: 'link',
  page: 'page',
  sound: 'command',
  theme: 'command',
}

export const COMMAND_META_MAP = new Map<string, CommandKind>(
  commands.flatMap(({ items }) =>
    items.map((item) => [item.title, commandKinds[item.kind]])
  )
)
