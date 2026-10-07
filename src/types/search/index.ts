import type { ReactNode } from 'react'

export type CommandKind = 'command' | 'page' | 'link'
export type AccountAction = 'account' | 'logout' | 'signin'

interface BaseItem {
  icon?: ReactNode
  keywords?: string[]
  title: string
}

export type CommandItem =
  | (BaseItem & { kind: 'page'; url: string })
  | (BaseItem & { kind: 'link'; url: string })
  | (BaseItem & { kind: 'theme'; theme: 'light' | 'dark' | 'system' })
  | (BaseItem & { action: AccountAction; kind: 'account' })

export interface CommandGroup {
  group: string
  items: CommandItem[]
  position?: 'before' | 'after'
}
