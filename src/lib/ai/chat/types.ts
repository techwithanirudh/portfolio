import type { InferUITools, UIMessage } from 'ai'
import { z } from 'zod'
import type { chatTools } from '@/app/api/chat/utils/tools'

export type ChatTools = InferUITools<typeof chatTools>

export const MAX_CONTEXT_LENGTH = 1200

export const chatDataSchemas = {
  client: z.object({ location: z.string() }),
  context: z.object({ text: z.string().max(MAX_CONTEXT_LENGTH) }),
}

type ChatDataTypes = {
  [Name in keyof typeof chatDataSchemas]: z.infer<
    (typeof chatDataSchemas)[Name]
  >
}

export type ChatUIMessage = UIMessage<never, ChatDataTypes, ChatTools>
