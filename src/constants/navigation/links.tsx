import type { LinkItemType } from 'fumadocs-ui/layouts/shared'
import { Icons } from '@/components/icons/icons'

export const linkItems: LinkItemType[] = [
  {
    icon: <Icons.user />,
    text: 'About',
    url: '/about',
    active: 'url',
  },
  {
    icon: <Icons.mail />,
    text: 'Contact',
    url: '/contact',
    active: 'url',
  },
  {
    icon: <Icons.messageSquare />,
    text: 'Guestbook',
    url: '/guestbook',
    active: 'url',
  },
  {
    icon: <Icons.work />,
    text: 'Work',
    url: '/work',
    active: 'nested-url',
  },
  {
    text: 'Blog',
    icon: <Icons.blog />,
    url: '/blog',
    active: 'nested-url',
  },
]
