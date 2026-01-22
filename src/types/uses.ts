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

export interface UseCategory {
  category: string
  items: UseItem[]
}
