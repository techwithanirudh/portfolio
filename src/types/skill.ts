import type { LucideIcon } from 'lucide-react'

export type SkillSize = 'sm' | 'md' | 'lg'

export interface Skill {
  id: number
  Icon: LucideIcon
  title: string
  description: string
  size: SkillSize
}
