import type { ChatTools, ChatUIMessage } from '@/lib/ai/chat/types'

export type ToolPart<Name extends keyof ChatTools> = Extract<
  ChatUIMessage['parts'][number],
  { type: `tool-${Name}` }
>
