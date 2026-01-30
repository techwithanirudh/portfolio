import type { InferUITools, UIDataTypes, UIMessage } from 'ai'
import type { tools } from './utils/tools'

export type ChatTools = InferUITools<typeof tools>

export type MyUIMessage = UIMessage<never, UIDataTypes, ChatTools> & {
  parts: Array<
    | UIMessage<never, UIDataTypes, ChatTools>['parts'][number]
    | {
        type: 'source-url'
        url: string
        title: string
      }
  >
}
