import type { TechStackItem } from '@/types'

const base = '/images/tech-stack'
const stackIcon = (file: string) => `${base}/${file}`
const themedStackIcon = (light: string, dark: string) => ({
  dark: stackIcon(dark),
  light: stackIcon(light),
})

export const technologies: TechStackItem[] = [
  {
    categories: ['Languages'],
    href: 'https://www.typescriptlang.org',
    icon: stackIcon('typescript.svg'),
    label: 'TypeScript',
  },
  {
    categories: ['Languages'],
    href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    icon: stackIcon('javascript.svg'),
    label: 'JavaScript',
  },
  {
    categories: ['Languages'],
    href: 'https://www.python.org',
    icon: stackIcon('python.svg'),
    label: 'Python',
  },
  {
    categories: ['Frontend'],
    href: 'https://react.dev',
    icon: themedStackIcon('react_light.svg', 'react_dark.svg'),
    label: 'React',
  },
  {
    categories: ['Frontend'],
    href: 'https://nextjs.org',
    icon: stackIcon('nextjs_icon_dark.svg'),
    label: 'Next.js',
  },
  {
    categories: ['Frontend'],
    href: 'https://tailwindcss.com',
    icon: stackIcon('tailwindcss.svg'),
    label: 'Tailwind CSS',
  },
  {
    categories: ['Frontend'],
    href: 'https://ui.shadcn.com',
    icon: themedStackIcon('shadcn-ui.svg', 'shadcn-ui_dark.svg'),
    label: 'shadcn/ui',
  },
  {
    categories: ['Frontend'],
    href: 'https://www.radix-ui.com',
    icon: themedStackIcon('radix-ui_light.svg', 'radix-ui_dark.svg'),
    label: 'Radix UI',
  },
  {
    categories: ['Frontend'],
    href: 'https://motion.dev',
    icon: themedStackIcon('motion.svg', 'motion_dark.svg'),
    label: 'Motion',
  },
  {
    categories: ['Frontend'],
    href: 'https://tanstack.com',
    icon: stackIcon('tanstack.svg'),
    label: 'TanStack',
  },
  {
    categories: ['Backend'],
    href: 'https://nodejs.org',
    icon: stackIcon('nodejs.svg'),
    label: 'Node.js',
  },
  {
    categories: ['Backend'],
    href: 'https://bun.sh',
    icon: stackIcon('bun.svg'),
    label: 'Bun',
  },
  {
    categories: ['Backend'],
    href: 'https://www.postgresql.org',
    icon: stackIcon('postgresql.svg'),
    label: 'PostgreSQL',
  },
  {
    categories: ['Backend'],
    href: 'https://redis.io',
    icon: stackIcon('redis.svg'),
    label: 'Redis',
  },
  {
    categories: ['Workflow & AI'],
    href: 'https://git-scm.com',
    icon: stackIcon('git.svg'),
    label: 'Git',
  },
  {
    categories: ['Workflow & AI'],
    href: 'https://www.docker.com',
    icon: stackIcon('docker.svg'),
    label: 'Docker',
  },
  {
    categories: ['Workflow & AI'],
    href: 'https://vercel.com',
    icon: themedStackIcon('vercel.svg', 'vercel_dark.svg'),
    label: 'Vercel',
  },
  {
    categories: ['Workflow & AI'],
    href: 'https://claude.ai',
    icon: stackIcon('claude-ai-icon.svg'),
    label: 'Claude',
  },
  {
    categories: ['Workflow & AI'],
    href: 'https://cursor.com',
    icon: themedStackIcon('cursor_light.svg', 'cursor_dark.svg'),
    label: 'Cursor',
  },
  {
    categories: ['Workflow & AI'],
    href: 'https://chatgpt.com/codex',
    icon: themedStackIcon('openai.svg', 'openai_dark.svg'),
    label: 'Codex',
  },
  {
    categories: ['Analytics'],
    href: 'https://posthog.com',
    icon: stackIcon('posthog.svg'),
    label: 'PostHog',
  },
  {
    categories: ['Analytics'],
    href: 'https://umami.is',
    icon: themedStackIcon('umami.svg', 'umami_dark.svg'),
    label: 'Umami',
  },
  {
    categories: ['Design'],
    href: 'https://www.figma.com',
    icon: stackIcon('figma.svg'),
    label: 'Figma',
  },
  {
    categories: ['Design'],
    href: 'https://paper.design',
    icon: stackIcon('paper.svg'),
    label: 'Paper',
  },
]

/** The stack by category, in first seen order. An item is listed under every category it has */
export const groupTechnologies = () => {
  const grouped = new Map<string, TechStackItem[]>()

  for (const item of technologies) {
    for (const category of item.categories) {
      const group = grouped.get(category)
      if (group) {
        group.push(item)
      } else {
        grouped.set(category, [item])
      }
    }
  }

  return [...grouped]
}
