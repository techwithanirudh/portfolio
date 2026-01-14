import type { LucideIcon } from 'lucide-react'
import { BrainCircuitIcon, Code2Icon, LayersIcon } from 'lucide-react'

export type SkillSize = 'sm' | 'md' | 'lg'

export interface Skill {
  id: number
  Icon: LucideIcon
  title: string
  description: string
  size: SkillSize
}

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
