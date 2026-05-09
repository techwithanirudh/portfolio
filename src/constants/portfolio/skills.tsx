import { Icons } from '@/components/icons/icons'
import type { Skill } from '@/types'

const base = '/images/tech-stack'
const s = (file: string) => `${base}/${file}`
const t = (light: string, dark: string) => ({ light: s(light), dark: s(dark) })

export const skills: Skill[] = [
  {
    id: 1,
    Icon: Icons.globe,
    title: 'Web Development',
    description:
      'Building modern web apps with Next.js, React, TypeScript, and UI frameworks.',
    size: 'sm',
  },
  {
    id: 2,
    Icon: Icons.ai,
    title: 'AI & Machine Learning',
    description: 'Exploring AI features with Python, OpenCV, and LLMs.',
    size: 'sm',
  },
  {
    id: 3,
    Icon: Icons.layers,
    title: 'Full Stack Development',
    description:
      'Creating end-to-end solutions with Node.js, TypeScript, databases, and cloud technologies.',
    size: 'sm',
  },
]

export const technologies = [
  {
    label: 'TypeScript',
    icon: s('typescript.svg'),
    href: 'https://www.typescriptlang.org',
  },
  {
    label: 'JavaScript',
    icon: s('javascript.svg'),
    href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  },
  { label: 'Python', icon: s('python.svg'), href: 'https://www.python.org' },
  {
    label: 'React',
    icon: t('react_light.svg', 'react_dark.svg'),
    href: 'https://react.dev',
  },
  {
    label: 'Next.js',
    icon: s('nextjs_icon_dark.svg'),
    href: 'https://nextjs.org',
  },
  {
    label: 'Tailwind CSS',
    icon: s('tailwindcss.svg'),
    href: 'https://tailwindcss.com',
  },
  {
    label: 'shadcn/ui',
    icon: t('shadcn-ui.svg', 'shadcn-ui_dark.svg'),
    href: 'https://ui.shadcn.com',
  },
  {
    label: 'Radix UI',
    icon: t('radix-ui_light.svg', 'radix-ui_dark.svg'),
    href: 'https://www.radix-ui.com',
  },
  {
    label: 'Motion',
    icon: t('motion.svg', 'motion_dark.svg'),
    href: 'https://motion.dev',
  },
  {
    label: 'TanStack',
    icon: s('tanstack.svg'),
    href: 'https://tanstack.com',
  },
  { label: 'Node.js', icon: s('nodejs.svg'), href: 'https://nodejs.org' },
  { label: 'Bun', icon: s('bun.svg'), href: 'https://bun.sh' },
  {
    label: 'PostgreSQL',
    icon: s('postgresql.svg'),
    href: 'https://www.postgresql.org',
  },
  { label: 'Redis', icon: s('redis.svg'), href: 'https://redis.io' },
  { label: 'Git', icon: s('git.svg'), href: 'https://git-scm.com' },
  { label: 'Docker', icon: s('docker.svg'), href: 'https://www.docker.com' },
  { label: 'Claude', icon: s('claude-ai-icon.svg'), href: 'https://claude.ai' },
  {
    label: 'Cursor',
    icon: t('cursor_light.svg', 'cursor_dark.svg'),
    href: 'https://cursor.com',
  },
  {
    label: 'Codex',
    icon: t('openai.svg', 'openai_dark.svg'),
    href: 'https://chatgpt.com/codex',
  },
  { label: 'Figma', icon: s('figma.svg'), href: 'https://www.figma.com' },
]
