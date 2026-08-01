import type { Icon } from '@/components/icons/icons'

export type SkillSize = 'sm' | 'md' | 'lg'

export interface Skill {
  description: string
  Icon: Icon
  id: number
  size: SkillSize
  title: string
}

export interface TechStackItem {
  categories: string[]
  href: string
  icon: string | { dark: string; light: string }
  label: string
}
