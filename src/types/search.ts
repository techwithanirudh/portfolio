import type { ReactNode } from 'react'

export type CommandKind = 'command' | 'page' | 'link'

interface BaseItem {
  icon?: ReactNode
  keywords?: string[]
  title: string
}

export type CommandItem =
  | (BaseItem & { kind: 'page'; url: string })
  | (BaseItem & { kind: 'link'; url: string })
  | (BaseItem & { kind: 'theme'; theme: 'light' | 'dark' | 'system' })

export interface CommandGroup {
  group: string
  items: CommandItem[]
}
