import type { InferUITools, UIDataTypes, UIMessage } from 'ai'
import { z } from 'zod'
import type { tools } from './utils/tools'

export type ChatTools = InferUITools<typeof tools>
export const chatMessageMetadataSchema = z.object({
  context: z.string().optional(),
})

export type ChatMessageMetadata = z.infer<typeof chatMessageMetadataSchema>

export type MyUIMessage = UIMessage<ChatMessageMetadata, UIDataTypes, ChatTools> & {
  parts: Array<
    | UIMessage<ChatMessageMetadata, UIDataTypes, ChatTools>['parts'][number]
    | {
        type: 'source-url'
        url: string
        title: string
      }
  >
}
