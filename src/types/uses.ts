export interface Logo {
  type: 'custom'
  url: string | { light: string; dark: string }
}

export interface SoftwareItem {
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
  image?: string
}
