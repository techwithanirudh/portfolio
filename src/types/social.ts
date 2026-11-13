import type { JSX } from 'react'

export interface Social {
  description?: string
  hideOnResume?: boolean
  icon: JSX.Element
  name: string
  url: string
}
