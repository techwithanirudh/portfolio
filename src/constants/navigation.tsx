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
    type: 'menu',
    text: 'Blog',
    items: [
      {
        text: 'Posts',
        description: 'View all blog posts',
        url: '/blog',
        icon: <Icons.posts />,
      },
      {
        text: 'Tags',
        description: 'View blog posts by tags',
        url: '/blog/tags',
        icon: <Icons.tags />,
      },
      {
        text: 'Newsletter',
        description: 'Subscribe to our newsletter',
        url: '/blog/newsletter',
        icon: <Icons.mail />,
      },
    ],
  },
]
