import type { InferUITools, UIDataTypes, UIMessage } from 'ai'
import { z } from 'zod'
import type { tools } from './utils/tools'

export type ChatTools = InferUITools<typeof tools>
export const contextDataSchema = z.object({
  text: z.string().trim().min(1),
})

export type ChatDataTypes = UIDataTypes & {
  context: z.infer<typeof contextDataSchema>
}

export type MyUIMessage = UIMessage<never, ChatDataTypes, ChatTools> & {
  parts: Array<
    | UIMessage<never, ChatDataTypes, ChatTools>['parts'][number]
    | {
        type: 'source-url'
        url: string
        title: string
      }
  >
}
