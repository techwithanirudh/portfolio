import { Icons } from '@/components/icons/icons'
import type { Social } from '@/types'

export const socials: Social[] = [
  {
    description: 'Check out my open source projects and contributions',
    icon: <Icons.github />,
    name: 'GitHub',
    url: 'https://github.com/techwithanirudh',
  },
  {
    description: 'Follow me for tech updates and project announcements',
    icon: <Icons.x />,
    name: 'X',
    url: 'https://x.com/AnirudhWith',
  },
  {
    description: 'Connect with me professionally',
    icon: <Icons.linkedin />,
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/anirudhsriramb',
  },
  {
    description: 'Subscribe for tech tutorials and project showcases',
    icon: <Icons.youtube />,
    name: 'YouTube',
    url: 'https://www.youtube.com/@techwithanirudh',
  },
  {
    description: 'Get in touch via email',
    icon: <Icons.mail />,
    name: 'Email',
    url: 'mailto:hello@techwithanirudh.com',
  },
]
