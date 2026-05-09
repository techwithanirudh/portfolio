import { Icons } from '@/components/icons/icons'
import type { Skill } from '@/types'

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
    Icon: Icons.typescript,
    href: 'https://www.typescriptlang.org',
  },
  {
    label: 'JavaScript',
    Icon: Icons.javascript,
    href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  },
  { label: 'React', Icon: Icons.react, href: 'https://react.dev' },
  { label: 'Next.js', Icon: Icons.nextjs, href: 'https://nextjs.org' },
  {
    label: 'Tailwind CSS',
    Icon: Icons.tailwind,
    href: 'https://tailwindcss.com',
  },
  {
    label: 'CSS3',
    Icon: Icons.css3,
    href: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
  },
  { label: 'Node.js', Icon: Icons.nodejs, href: 'https://nodejs.org' },
  { label: 'Express', Icon: Icons.express, href: 'https://expressjs.com' },
  { label: 'Git', Icon: Icons.git, href: 'https://git-scm.com' },
  { label: 'shadcn/ui', Icon: Icons.shadcn, href: 'https://ui.shadcn.com' },
  { label: 'Hono', Icon: Icons.hono, href: 'https://hono.dev' },
  {
    label: 'Drizzle ORM',
    Icon: Icons.drizzleOrm,
    href: 'https://orm.drizzle.team',
  },
] as const
