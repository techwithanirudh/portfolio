import type { Icons } from '@/components/icons/icons'

interface StoryPhoto {
  alt: string
  caption: string
  /** Logos sit on white with some breathing room instead of filling the frame */
  contain?: boolean
  /** Background behind a wide image shown whole instead of cropped */
  letterbox?: string
  src: string
}

export interface StoryChapter {
  /** Plain text with `[label](href)` links */
  body: string
  /** Shown in the empty slot when there is no photo */
  icon?: keyof typeof Icons
  id: string
  photo?: StoryPhoto
  title: string
  when: string
}
