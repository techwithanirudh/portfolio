import type { ChatTools, MyUIMessage } from '@/lib/ai/chat/types'

export type ToolPart<Name extends keyof ChatTools> = Extract<
  MyUIMessage['parts'][number],
  { type: `tool-${Name}` }
>
