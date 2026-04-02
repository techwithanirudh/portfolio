import type { Icon } from '@/components/icons/icons'

export type SkillSize = 'sm' | 'md' | 'lg'

export interface Skill {
  description: string
  Icon: Icon
  id: number
  size: SkillSize
  title: string
}
