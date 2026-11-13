import type { ThemedImage } from './themed-image'

export interface SoftwareItem {
  description: string
  featured?: boolean
  logo?: ThemedImage
  name: string
  url: string
}

export interface HardwareItem {
  description: string
  image?: string
  name: string
  url?: string
}
