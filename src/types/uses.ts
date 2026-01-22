export type Logo =
  | { type: 'svgl'; id: string | { light: string; dark: string } }
  | { type: 'custom'; url: string }

// Software/App item with logo
export interface SoftwareItem {
  name: string
  description: string
  url: string
  logo?: Logo
  featured?: boolean
}

// Hardware item with product image
export interface HardwareItem {
  name: string
  description: string
  url?: string
  image?: string // Path to product image
}

// Tab categories
export type UsesTabId = 'all' | 'hardware' | 'software' | 'coding'

export interface UsesTab {
  id: UsesTabId
  title: string
}
