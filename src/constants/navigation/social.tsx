import { Icons } from '@/components/icons/icons'
import { githubUrl } from '@/constants/config'
import { email, xHandle } from '@/constants/site'
import type { Social } from '@/types'

export const socials: Social[] = [
  {
    description: 'My code and open source contributions',
    icon: <Icons.github />,
    name: 'GitHub',
    url: githubUrl,
  },
  {
    description: "Posts about what I'm building",
    icon: <Icons.x />,
    name: 'X',
    url: `https://x.com/${xHandle}`,
  },
  {
    description: 'My work history',
    icon: <Icons.linkedin />,
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/anirudhsriramb',
  },
  {
    description: 'Tech tutorials and project demos',
    hideOnResume: true,
    icon: <Icons.youtube />,
    name: 'YouTube',
    url: 'https://www.youtube.com/@techwithanirudh',
  },
  {
    description: 'Write to me directly',
    icon: <Icons.mail />,
    name: 'Email',
    url: `mailto:${email}`,
  },
]
