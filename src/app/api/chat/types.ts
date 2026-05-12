import type { InferUITools, UIDataTypes, UIMessage } from 'ai'
import type { DocumentData } from 'flexsearch'
import { z } from 'zod'
import type { PageEntry } from '@/app/actions/pages'
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

export interface CustomDocument extends DocumentData {
  content: string
  description: string
  tag: PageEntry['tag']
  title: string
  url: string
}
