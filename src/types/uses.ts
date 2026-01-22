export type Logo =
  | { type: 'svgl'; id: string | { light: string; dark: string } }
  | { type: 'custom'; url: string }

export interface UseItem {
  name: string
  description: string
  url: string
  logo?: Logo
  featured?: boolean
}

export interface HardwareItem {
  name: string
  description: string
  url?: string
}

export interface ApplicationCategory {
  category: string
  type: 'applications'
  items: UseItem[]
}

export interface HardwareCategory {
  category: string
  type: 'hardware'
  items: HardwareItem[]
}

export type UseCategory = ApplicationCategory | HardwareCategory
