import { Icons } from '@/components/icons/icons'
import type { Skill } from '@/types'

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

export const technologies = [
  {
    href: 'https://www.typescriptlang.org',
    icon: s('typescript.svg'),
    label: 'TypeScript',
  },
  {
    href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    icon: s('javascript.svg'),
    label: 'JavaScript',
  },
  { href: 'https://www.python.org', icon: s('python.svg'), label: 'Python' },
  {
    href: 'https://react.dev',
    icon: t('react_light.svg', 'react_dark.svg'),
    label: 'React',
  },
  {
    href: 'https://nextjs.org',
    icon: s('nextjs_icon_dark.svg'),
    label: 'Next.js',
  },
  {
    href: 'https://tailwindcss.com',
    icon: s('tailwindcss.svg'),
    label: 'Tailwind CSS',
  },
  {
    href: 'https://ui.shadcn.com',
    icon: t('shadcn-ui.svg', 'shadcn-ui_dark.svg'),
    label: 'shadcn/ui',
  },
  {
    href: 'https://www.radix-ui.com',
    icon: t('radix-ui_light.svg', 'radix-ui_dark.svg'),
    label: 'Radix UI',
  },
  {
    href: 'https://motion.dev',
    icon: t('motion.svg', 'motion_dark.svg'),
    label: 'Motion',
  },
  {
    href: 'https://tanstack.com',
    icon: s('tanstack.svg'),
    label: 'TanStack',
  },
  { href: 'https://nodejs.org', icon: s('nodejs.svg'), label: 'Node.js' },
  { href: 'https://bun.sh', icon: s('bun.svg'), label: 'Bun' },
  {
    href: 'https://www.postgresql.org',
    icon: s('postgresql.svg'),
    label: 'PostgreSQL',
  },
  { href: 'https://redis.io', icon: s('redis.svg'), label: 'Redis' },
  { href: 'https://git-scm.com', icon: s('git.svg'), label: 'Git' },
  { href: 'https://www.docker.com', icon: s('docker.svg'), label: 'Docker' },
  { href: 'https://claude.ai', icon: s('claude-ai-icon.svg'), label: 'Claude' },
  {
    href: 'https://cursor.com',
    icon: t('cursor_light.svg', 'cursor_dark.svg'),
    label: 'Cursor',
  },
  {
    href: 'https://chatgpt.com/codex',
    icon: t('openai.svg', 'openai_dark.svg'),
    label: 'Codex',
  },
  { href: 'https://www.figma.com', icon: s('figma.svg'), label: 'Figma' },
]
