import type { LinkItemType } from 'fumadocs-ui/layouts/shared'
import { Icons } from '@/components/icons/icons'
import { pages } from '@/constants/pages'

export const linkItems: LinkItemType[] = [
  {
    active: 'url',
    icon: <Icons.user />,
    text: pages.about.title,
    url: pages.about.path,
  },
  {
    active: 'nested-url',
    icon: <Icons.work />,
    text: pages.projects.title,
    url: pages.projects.path,
  },
  {
    active: 'nested-url',
    icon: <Icons.blog />,
    text: pages.blog.title,
    url: pages.blog.path,
  },
  {
    active: 'url',
    icon: <Icons.mail />,
    text: pages.contact.title,
    url: pages.contact.path,
  },
  {
    active: 'url',
    icon: <Icons.messageSquare />,
    text: pages.guestbook.title,
    url: pages.guestbook.path,
  },
]
