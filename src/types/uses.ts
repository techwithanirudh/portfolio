export type Logo = string | { light: string; dark: string }

export interface SoftwareItem {
  description: string
  featured?: boolean
  logo?: Logo
  name: string
  url: string
}

export interface HardwareItem {
  description: string
  image?: string
  name: string
  url?: string
}
