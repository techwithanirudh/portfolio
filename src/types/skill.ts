import type { LucideIcon } from 'lucide-react'

export type SkillSize = 'sm' | 'md' | 'lg'

export interface Skill {
  description: string
  Icon: LucideIcon
  id: number
  size: SkillSize
  title: string
}
