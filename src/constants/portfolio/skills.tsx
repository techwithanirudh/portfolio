import { BrainCircuitIcon, Code2Icon, LayersIcon } from 'lucide-react'
import { Icons } from '@/components/icons/icons'
import type { Skill } from '@/types'

export const skills: Skill[] = [
  {
    id: 1,
    Icon: Code2Icon,
    title: 'Web Development',
    description:
      'Building modern web apps with Next.js, React, TypeScript, and UI frameworks.',
    size: 'sm',
  },
  {
    id: 2,
    Icon: BrainCircuitIcon,
    title: 'AI & Machine Learning',
    description: 'Exploring AI features with Python, OpenCV, and LLMs.',
    size: 'sm',
  },
  {
    id: 3,
    Icon: LayersIcon,
    title: 'Full Stack Development',
    description:
      'Creating end-to-end solutions with Node.js, TypeScript, databases, and cloud technologies.',
    size: 'sm',
  },
]

export const technologies = [
  { label: 'TypeScript', Icon: Icons.typescript },
  { label: 'JavaScript', Icon: Icons.javascript },
  { label: 'React', Icon: Icons.react },
  { label: 'Next.js', Icon: Icons.nextjs },
  { label: 'Tailwind CSS', Icon: Icons.tailwind },
  { label: 'CSS3', Icon: Icons.css3 },
  { label: 'Node.js', Icon: Icons.nodejs },
  { label: 'Express', Icon: Icons.express },
  { label: 'Git', Icon: Icons.git },
  { label: 'shadcn/ui', Icon: Icons.shadcn },
  { label: 'Hono', Icon: Icons.hono },
  { label: 'Drizzle ORM', Icon: Icons.drizzleOrm },
] as const
