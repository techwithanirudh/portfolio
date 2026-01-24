import type { LinkItemType } from 'fumadocs-ui/layouts/shared'
import { Icons } from '@/components/icons/icons'

export const linkItems: LinkItemType[] = [
  {
    icon: <Icons.info />,
    text: 'About',
    url: '/about',
    active: 'url',
  },
  {
    icon: <Icons.phone />,
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
    icon: <Icons.code />,
    text: 'Work',
    url: '/work',
    active: 'url',
  },
  {
    text: 'Blog',
    icon: <Icons.posts />,
    url: '/blog',
    active: 'nested-url',
  },
]
