import type { BaseLayoutProps, LinkItemType } from 'fumadocs-ui/layouts/shared'
import type { JSX } from 'react'
import { Icons } from '@/components/icons/icons'

export interface Social {
  icon: JSX.Element
  name: string
  url: string
  description?: string
}

export const title = 'Anirudh'
export const description =
  'Building web apps and AI experiments. Always tinkering with new ideas.'
export const owner = 'Tech With Anirudh'

export const baseOptions: BaseLayoutProps = {
  nav: {
    title,
  },
  githubUrl: 'https://github.com/techwithanirudh',
}

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

export const socials: Social[] = [
  {
    icon: <Icons.gitHub />,
    name: 'GitHub',
    url: 'https://github.com/techwithanirudh',
    description: 'Check out my open source projects and contributions',
  },
  {
    icon: <Icons.twitter />,
    name: 'X (Twitter)',
    url: 'https://x.com/AnirudhWith',
    description: 'Follow me for tech updates and project announcements',
  },
  {
    icon: <Icons.linkedin />,
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/anirudhsriramb',
    description: 'Connect with me professionally',
  },
  {
    name: 'YouTube',
    description: 'Subscribe for tech tutorials and project showcases',
    url: 'https://www.youtube.com/@techwithanirudh',
    icon: <Icons.youtube />,
  },
  {
    icon: <Icons.mail />,
    name: 'Email',
    url: 'mailto:hello@techwithanirudh.com',
    description: 'Get in touch via email',
  },
]

export const postsPerPage = 5
export const worksPerPage = 6
