import { Icons } from '@/components/icons/icons'
import type { Skill, TechStackItem } from '@/types'

const base = '/images/tech-stack'
const s = (file: string) => `${base}/${file}`
const t = (light: string, dark: string) => ({ dark: s(dark), light: s(light) })

export const skills: Skill[] = [
  {
    description:
      'Building modern web apps with Next.js, React, TypeScript, and UI frameworks.',
    Icon: Icons.globe,
    id: 1,
    size: 'sm',
    title: 'Web Development',
  },
  {
    description: 'Exploring AI features with Python, OpenCV, and LLMs.',
    Icon: Icons.ai,
    id: 2,
    size: 'sm',
    title: 'AI & Machine Learning',
  },
  {
    description:
      'Creating end-to-end solutions with Node.js, TypeScript, databases, and cloud technologies.',
    Icon: Icons.layers,
    id: 3,
    size: 'sm',
    title: 'Full Stack Development',
  },
]

export const technologies: TechStackItem[] = [
  {
    categories: ['Languages'],
    href: 'https://www.typescriptlang.org',
    icon: s('typescript.svg'),
    label: 'TypeScript',
  },
  {
    categories: ['Languages'],
    href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    icon: s('javascript.svg'),
    label: 'JavaScript',
  },
  {
    categories: ['Languages'],
    href: 'https://www.python.org',
    icon: s('python.svg'),
    label: 'Python',
  },
  {
    categories: ['Frontend'],
    href: 'https://react.dev',
    icon: t('react_light.svg', 'react_dark.svg'),
    label: 'React',
  },
  {
    categories: ['Frontend'],
    href: 'https://nextjs.org',
    icon: s('nextjs_icon_dark.svg'),
    label: 'Next.js',
  },
  {
    categories: ['Frontend'],
    href: 'https://tailwindcss.com',
    icon: s('tailwindcss.svg'),
    label: 'Tailwind CSS',
  },
  {
    categories: ['Frontend'],
    href: 'https://ui.shadcn.com',
    icon: t('shadcn-ui.svg', 'shadcn-ui_dark.svg'),
    label: 'shadcn/ui',
  },
  {
    categories: ['Frontend'],
    href: 'https://www.radix-ui.com',
    icon: t('radix-ui_light.svg', 'radix-ui_dark.svg'),
    label: 'Radix UI',
  },
  {
    categories: ['Frontend'],
    href: 'https://motion.dev',
    icon: t('motion.svg', 'motion_dark.svg'),
    label: 'Motion',
  },
  {
    categories: ['Frontend'],
    href: 'https://tanstack.com',
    icon: s('tanstack.svg'),
    label: 'TanStack',
  },
  {
    categories: ['Backend & Database'],
    href: 'https://nodejs.org',
    icon: s('nodejs.svg'),
    label: 'Node.js',
  },
  {
    categories: ['Backend & Database'],
    href: 'https://bun.sh',
    icon: s('bun.svg'),
    label: 'Bun',
  },
  {
    categories: ['Backend & Database'],
    href: 'https://www.postgresql.org',
    icon: s('postgresql.svg'),
    label: 'PostgreSQL',
  },
  {
    categories: ['Backend & Database'],
    href: 'https://redis.io',
    icon: s('redis.svg'),
    label: 'Redis',
  },
  {
    categories: ['Workflow & AI'],
    href: 'https://git-scm.com',
    icon: s('git.svg'),
    label: 'Git',
  },
  {
    categories: ['Workflow & AI'],
    href: 'https://www.docker.com',
    icon: s('docker.svg'),
    label: 'Docker',
  },
  {
    categories: ['Workflow & AI'],
    href: 'https://claude.ai',
    icon: s('claude-ai-icon.svg'),
    label: 'Claude',
  },
  {
    categories: ['Workflow & AI'],
    href: 'https://cursor.com',
    icon: t('cursor_light.svg', 'cursor_dark.svg'),
    label: 'Cursor',
  },
  {
    categories: ['Workflow & AI'],
    href: 'https://chatgpt.com/codex',
    icon: t('openai.svg', 'openai_dark.svg'),
    label: 'Codex',
  },
  {
    categories: ['Design'],
    href: 'https://www.figma.com',
    icon: s('figma.svg'),
    label: 'Figma',
  },
]
