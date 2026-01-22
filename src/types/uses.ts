export type Logo = {
  type: 'custom'
  url: string | { light: string; dark: string }
}

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
