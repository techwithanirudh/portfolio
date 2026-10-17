import type { LinkItemType } from 'fumadocs-ui/layouts/shared'
import { Icons } from '@/components/icons/icons'

export const linkItems: LinkItemType[] = [
  {
    active: 'url',
    icon: <Icons.user />,
    text: 'About',
    url: '/about',
  },
  {
    active: 'nested-url',
    icon: <Icons.work />,
    text: 'Projects',
    url: '/projects',
  },
  {
    active: 'nested-url',
    icon: <Icons.blog />,
    text: 'Blog',
    url: '/blog',
  },
  {
    active: 'url',
    icon: <Icons.mail />,
    text: 'Contact',
    url: '/contact',
  },
  {
    active: 'url',
    icon: <Icons.messageSquare />,
    text: 'Guestbook',
    url: '/guestbook',
  },
]
